import { PriorityEnum, TaskStatusEnum } from "@/entities/Task";

export const priorityTranslations: Record<PriorityEnum, string> = {
  MUST: "Urgente",
  SHOULD: "Importante",
  COULD: "Normal",
  WONT: "No hacer",
};

export const statusTranslations: Record<TaskStatusEnum, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En Progreso",
  DONE: "Hecho",
  CANCELED: "Cancelado",
};
