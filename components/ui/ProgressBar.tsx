interface ProgressBarProps {
  pct: number;
}

export default function ProgressBar({ pct }: ProgressBarProps) {
  return (
    <footer className="flex justify-between items-center pt-7 pb-[52px] mt-2">
      <span className="text-[10px] italic text-muted tracking-[0.06em]">
        click para avanzar estado
      </span>
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] text-secondary tracking-[0.08em]">
          {pct}%
        </span>
        <div className="w-[72px] h-[2px] bg-muted rounded-[1px] overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </footer>
  );
}
