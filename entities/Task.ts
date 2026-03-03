export const Priority = ["MUST", "SHOULD", "COULD", "WONT"] as const;

export type PriorityEnum = (typeof Priority)[number];

export const TaskStatus = [
  "PENDING",
  "IN_PROGRESS",
  "DONE",
  "CANCELED",
] as const;

export type TaskStatusEnum = (typeof TaskStatus)[number];

export type Task = {
  id: string;
  userId: string;
  name: string;
  priority: PriorityEnum;
  status: TaskStatusEnum;
  description: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};
