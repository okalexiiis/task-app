import { TaskStatusEnum } from "@/entities/Task";

export function cycleStatus(current: TaskStatusEnum): TaskStatusEnum {
  const cycle: TaskStatusEnum[] = [
    "PENDING",
    "IN_PROGRESS",
    "DONE",
    "CANCELED",
  ];
  return cycle[(cycle.indexOf(current) + 1) % cycle.length];
}
