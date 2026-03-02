interface TaskSectionHeaderProps {
  label: string;
  count: number;
}

export default function TaskSectionHeader({
  label,
  count,
}: TaskSectionHeaderProps) {
  return (
    <div className="flex items-baseline justify-between py-7 pb-3.5">
      <span className="text-[10px] tracking-[0.18em] uppercase text-secondary">
        {label}
      </span>
      <span className="font-serif italic text-[13px] text-secondary">
        {count} tarea{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
