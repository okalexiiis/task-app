import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Task from "@/db/models/Task";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const task = await Task.create({
      userId: body.userId,
      name: body.name,
      priority: body.priority,
      status: body.status ?? "PENDING",
      description: body.description,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating task", error },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    //    const userId = req.headers.get("x-user-id");
    const userId = "f3ae734a-22b0-4200-a7f5-ca6b57d7330e";

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching tasks", error },
      { status: 500 },
    );
  }
}
