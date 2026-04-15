import { Group } from "@/entities/Group";

export default function GroupsList({
  groups,
  onSelectGroup,
}: {
  groups: Group[];
  onSelectGroup: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 mt-6">
      <h2 className="font-mono text-secondary text-xs uppercase tracking-widest">
        Mis Grupos
      </h2>
      {groups.length === 0 && (
        <p className="text-muted text-sm italic">
          No perteneces a ningún grupo todavía.
        </p>
      )}
      {groups.map((g) => (
        <div
          key={g.id}
          onClick={() => onSelectGroup(g.id)}
          className="p-4 border border-muted hover:border-accent cursor-pointer transition-colors rounded-lg flex justify-between items-center"
        >
          <span className="font-bold">{g.groupName}</span>
          <span className="text-[10px] bg-muted px-2 py-1 rounded uppercase">
            Owner
          </span>
        </div>
      ))}
    </div>
  );
}
