import { NextRequest, NextResponse } from "next/server";
import { createTask } from "@/services/tasks/create-task";
import { getAllTasks } from "@/services/tasks/get-all-tasks";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Aseguramos que la tarea se asocie al usuario correcto
    const newTaskData = { ...body, userId };

    const newTask = await createTask(newTaskData);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Error creating task" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "x-user-id header is missing" },
        { status: 400 },
      );
    }

    const tasks = await getAllTasks(userId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 },
    );
  }
}

