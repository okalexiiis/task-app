import { Task } from "@/entities/Task";
import TaskItem from "./TaskItem";
import TaskSectionHeader from "./TaskSectionHeader";

interface TaskListProps {
  tasks: Task[];
  label: string;
  finished?: boolean;
  onToggle: (id: string) => void;
}

export default function TaskList({
  tasks,
  label,
  finished = false,
  onToggle,
}: TaskListProps) {
  if (tasks.length === 0) return null;

  return (
    <div
      className="relative before:content-[''] before:absolute before:-left-9 before:top-0 before:bottom-0 before:w-px before:opacity-35"
    >
      <div
        className="absolute -left-9 top-0 bottom-0 w-px opacity-35"
        style={{
          background:
            "repeating-linear-gradient(to bottom, var(--accent) 0, var(--accent) 2px, transparent 2px, transparent 10px)",
        }}
      />

      <TaskSectionHeader label={label} count={tasks.length} />

      <ul className="list-none">
        {tasks.map((task, i) => (
          <TaskItem
            key={task._id}
            task={task}
            index={i}
            finished={finished}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </div>
  );
}
