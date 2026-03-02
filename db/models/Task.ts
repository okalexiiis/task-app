import mongoose, { Schema, Model, models } from "mongoose";
import {
  Priority,
  TaskStatus,
  PriorityEnum,
  TaskStatusEnum,
} from "@/entities/Task";

export interface TaskDocument extends mongoose.Document {
  userId: string;
  name: string;
  priority: PriorityEnum;
  status: TaskStatusEnum;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<TaskDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: Priority,
      required: true,
    },
    status: {
      type: String,
      enum: TaskStatus,
      default: "PENDING",
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Task: Model<TaskDocument> =
  models.Task || mongoose.model<TaskDocument>("Task", TaskSchema);

export default Task;
