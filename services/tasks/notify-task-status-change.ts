import { getGroupMembersForNotification } from "@/services/groups/get-group-members";
import { sendTaskNotification } from "@/lib/email";
import { db } from "@/db";
import { TaskSchema } from "@/db/schemas/Task";
import { GroupSchema } from "@/db/schemas/Groups";
import { eq } from "drizzle-orm";

const NOTIFICATION_STATUSES = ["DONE", "CANCELED"];

export async function notifyTaskStatusChange(
  taskId: string,
  oldStatus: string,
  newStatus: string,
  currentUserId: string, // quien hizo el cambio
) {
  if (!NOTIFICATION_STATUSES.includes(newStatus)) return;

  const tasks = await db
    .select()
    .from(TaskSchema)
    .where(eq(TaskSchema.id, taskId));

  const task = tasks[0];
  if (!task || !task.groupId) return;

  const group = await db
    .select({ groupName: GroupSchema.groupName })
    .from(GroupSchema)
    .where(eq(GroupSchema.id, task.groupId));

  const groupMembers = await getGroupMembersForNotification(task.groupId);
  if (!groupMembers.length) return;

  // Buscar el rol de quien hizo el cambio
  const currentMember = groupMembers.find((m) => m.member_id === currentUserId);
  const currentRole = currentMember?.role;
  const currentUsername = currentMember?.username || "Usuario"; // 👈

  let membersToNotify = groupMembers.filter(
    (member) => member.email && member.member_id !== currentUserId,
  );

  // Si quien hizo el cambio es MEMBER → solo notificar a OWNER y ADMINs
  if (currentRole === "MEMBER") {
    membersToNotify = membersToNotify.filter(
      (member) => member.role === "OWNER" || member.role === "ADMIN",
    );
  }

  console.log(
    `Notifying ${membersToNotify.length} members (changer role: ${currentRole})`,
  );

  const notifyPromises = membersToNotify.map((member) =>
    sendTaskNotification(
      member.email!,
      member.username || "Usuario",
      task.name,
      oldStatus,
      newStatus,
      group[0]?.groupName,
      currentUsername, // 👈
    ),
  );

  await Promise.allSettled(notifyPromises);
}
