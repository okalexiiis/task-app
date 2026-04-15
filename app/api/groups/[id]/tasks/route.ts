import { getGroupTasks } from "@/services/tasks/get-group-tasks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: groupId } = await params;
  const requesterId = req.headers.get("x-user-id");
  
  if (!requesterId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await getGroupTasks(groupId);
  
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.message },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}
