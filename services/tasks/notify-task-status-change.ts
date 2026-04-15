import { getGroupOwnersAndAdmins } from "@/services/groups/get-group-owners-and-admins";
import { sendTaskNotification } from "@/lib/email";
import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { TaskSchema } from "@/db/schemas/Task";
import { GroupSchema } from "@/db/schemas/Groups";
import { eq } from "drizzle-orm";

const NOTIFICATION_STATUSES = ["DONE", "CANCELED"];

export async function notifyTaskStatusChange(
  taskId: string,
  oldStatus: string,
  newStatus: string
) {
  if (!NOTIFICATION_STATUSES.includes(newStatus)) {
    return;
  }

  const tasks = await db
    .select()
    .from(TaskSchema)
    .where(eq(TaskSchema.id, taskId));

  const task = tasks[0];
  if (!task || !task.groupId) {
    return;
  }

  const assignees = await db
    .select({ username: UserSchema.username, email: UserSchema.email })
    .from(UserSchema)
    .where(eq(UserSchema.id, task.userId));

  const assignee = assignees[0];
  if (!assignee?.email) {
    return;
  }

  const groups = await db
    .select({ groupName: GroupSchema.groupName })
    .from(GroupSchema)
    .where(eq(GroupSchema.id, task.groupId));

  const group = groups[0];

  const ownersAndAdmins = await getGroupOwnersAndAdmins(task.groupId);

  const notifyPromises = ownersAndAdmins
    .filter((member) => member.email && member.member_id !== task.userId)
    .map((member) =>
      sendTaskNotification(
        member.email!,
        member.username || "Usuario",
        task.name,
        oldStatus,
        newStatus,
        group?.groupName
      )
    );

  await Promise.allSettled(notifyPromises);
}