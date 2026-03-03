"use client";
import { Trash } from "lucide-react";
import { Task, TaskStatusEnum, PriorityEnum } from "@/entities/Task";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const PRIORITY_CLASSES: Record<PriorityEnum, string> = {
  MUST: "bg-accent border-accent",
  SHOULD: "bg-primary border-primary",
  COULD: "bg-secondary border-secondary",
  WONT: "bg-muted border-muted",
};

const PRIORITY_TEXT_CLASSES: Record<PriorityEnum, string> = {
  MUST: "text-accent border-accent",
  SHOULD: "text-primary border-primary",
  COULD: "text-secondary border-secondary",
  WONT: "text-muted border-muted",
};

const PRIORITY_LABEL: Record<PriorityEnum, string> = {
  MUST: "must",
  SHOULD: "should",
  COULD: "could",
  WONT: "won't",
};

const STATUS_LABEL: Record<TaskStatusEnum, string> = {
  PENDING: "pendiente",
  IN_PROGRESS: "en curso",
  DONE: "listo",
  CANCELED: "cancelado",
};

interface TaskItemProps {
  task: Task;
  index: number;
  finished?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({
  task,
  index,
  finished = false,
  onToggle,
  onDelete,
}: TaskItemProps) {
  const today = new Date();
  const isOverdue = task.dueDate && new Date(task.dueDate) < today;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el evento de clic se propague al <li>
    onDelete(task.id);
  };

  return (
    <li
      onClick={() => onToggle(task.id)}
      title={finished ? "Click para reabrir" : `Click → avanzar estado`}
      className="
        group flex items-center gap-3.5
        py-3 border-b border-muted
        cursor-pointer
        transition-all duration-200
        hover:pl-2
      "
      style={{ animationDelay: `${index * 0.04 + 0.04}s` }}
    >
      {/* ... (el resto del componente se mantiene igual hasta el Index) ... */}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            "font-serif text-[18px] font-normal leading-snug whitespace-nowrap overflow-hidden text-ellipsis",
            finished && "line-through text-secondary italic text-[15px]",
          )}
        >
          {task.name}
        </p>

        <div className="flex gap-2 mt-1 items-center flex-wrap">
          {/* Status tag */}
          <span
            className={clsx(
              "text-[9px] tracking-[0.12em] uppercase px-1.5 py-0.5 border rounded-[2px]",
              {
                "text-accent border-accent": finished,
                "text-primary border-primary":
                  !finished && task.status === "IN_PROGRESS",
                "text-secondary border-secondary":
                  !finished && task.status !== "IN_PROGRESS",
              },
            )}
          >
            {STATUS_LABEL[task.status]}
          </span>

          {/* Priority tag */}
          {!finished && (
            <span
              className={twMerge(
                "text-[9px] tracking-[0.12em] uppercase px-1.5 py-0.5 border rounded-[2px]",
                PRIORITY_TEXT_CLASSES[task.priority],
              )}
            >
              {PRIORITY_LABEL[task.priority]}
            </span>
          )}

          {/* Due date */}
          {task.dueDate && !finished && (
            <span
              className={clsx("text-[9px] font-light tracking-[0.06em]", {
                "text-accent": isOverdue,
                "text-secondary": !isOverdue,
              })}
            >
              {isOverdue ? "⚑ " : ""}
              {new Date(task.dueDate).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Botón de eliminar y número de índice */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          title="Eliminar tarea"
          className="opacity-0 group-hover:opacity-100 text-primary hover:text-accent transition-all duration-200 p-1 cursor-pointer"
        >
          <Trash size={16} />
        </button>

        <span className="text-[10px] font-light text-muted tracking-[0.06em] shrink-0 w-6 text-right transition-colors duration-200 group-hover:text-secondary">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </li>
  );
}
