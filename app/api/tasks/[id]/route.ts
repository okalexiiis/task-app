import { NextRequest, NextResponse } from "next/server";
import { deleteTask } from "@/services/tasks/delete-task";
import { getTaskById } from "@/services/tasks/get-task-by-id";
import { updateTask } from "@/services/tasks/update-task";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  try {
    const task = await getTaskById(id);
    if (!task || task.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updatedTask = await updateTask(id, body);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

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
