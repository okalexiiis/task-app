import { NextRequest, NextResponse } from "next/server";
import { deleteTask } from "@/services/tasks/delete-task";
import { getTaskById } from "@/services/tasks/get-task-by-id";
import { updateTask } from "@/services/tasks/update-task";
import { notifyTaskStatusChange } from "@/services/tasks/notify-task-status-change";

const ALLOWED_STATUSES = ["PENDING", "IN_PROGRESS", "DONE", "CANCELED"];
const ALLOWED_PRIORITIES = ["MUST", "SHOULD", "COULD", "WONT"];

function sanitizeString(
  str: string | undefined,
  maxLength: number,
): string | undefined {
  if (!str) return undefined;
  return str.slice(0, maxLength).replace(/[<>]/g, "");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id || id.length > 36) {
    return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
  }

  try {
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    if (task.groupId && task.userId !== userId && task.groupId === null) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!task.groupId && task.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    console.log("Request body:", body);

    const status = sanitizeString(body.status, 20);
    console.log("Sanitized status:", status);
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 },
      );
    }

    const priority = sanitizeString(body.priority, 10);
    if (priority && !ALLOWED_PRIORITIES.includes(priority)) {
      return NextResponse.json(
        { message: "Invalid priority value" },
        { status: 400 },
      );
    }

    const name = sanitizeString(body.name, 255);
    const description = sanitizeString(body.description, 255);

    const updateData: Record<string, string> = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    console.log("updateData:", updateData);

    const oldStatus = task.status;
    console.log(
      "Updating task:",
      id,
      "with:",
      updateData,
      "oldStatus:",
      oldStatus,
    );

    const updatedTask = await updateTask(id, updateData);
    console.log("Updated task:", updatedTask);

    if (status && status !== oldStatus) {
      notifyTaskStatusChange(id, oldStatus, status).catch(console.error);
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: `Internal server error: ${(error as Error).message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // 1. Verificar que la tarea existe y pertenece al usuario
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    if (task.userId !== userId) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this task" },
        { status: 403 },
      );
    }

    // 2. Si todo es correcto, eliminar la tarea
    const success = await deleteTask(id);
    if (success) {
      return NextResponse.json({ message: "Task deleted successfully" });
    } else {
      // Esto podría ocurrir si la tarea se elimina justo entre la verificación y la eliminación
      return NextResponse.json(
        { message: "Task could not be deleted" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
