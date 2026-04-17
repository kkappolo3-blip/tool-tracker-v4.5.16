import { Wrench } from "lucide-react";

type FilterKey = "all" | "live" | "draft" | "idea";

interface HeaderProps {
  stats: { total: number; live: number; draft: number; idea: number };
  activeFilter: FilterKey;
  onFilterChange: (f: FilterKey) => void;
}

export default function Header({ stats, activeFilter, onFilterChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-card/80 border-b border-border shadow-card">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elevated">
            <Wrench size={20} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary text-[10px] font-bold tracking-[0.2em]">GIBIKEY STUDIO</p>
            <h1 className="text-foreground font-bold text-lg leading-tight">Tool Tracker</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatBadge label="Total" value={stats.total} active={activeFilter === "all"} onClick={() => onFilterChange("all")} accent="foreground" />
          <StatBadge label="Live" value={stats.live} active={activeFilter === "live"} onClick={() => onFilterChange("live")} accent="published" />
          <StatBadge label="Proses" value={stats.draft} active={activeFilter === "draft"} onClick={() => onFilterChange("draft")} accent="draft" />
          <StatBadge label="Ide" value={stats.idea} active={activeFilter === "idea"} onClick={() => onFilterChange("idea")} accent="idea" />
        </div>
      </div>
    </header>
  );
}

function StatBadge({
  label, value, active, onClick, accent,
}: {
  label: string; value: number; active: boolean; onClick: () => void;
  accent: "foreground" | "published" | "draft" | "idea";
}) {
  const accentColor = {
    foreground: "text-foreground",
    published: "text-status-published",
    draft: "text-status-draft",
    idea: "text-status-idea",
  }[accent];
  const activeBg = {
    foreground: "bg-foreground/10 ring-foreground/40",
    published: "bg-status-published/15 ring-status-published/50",
    draft: "bg-status-draft/15 ring-status-draft/50",
    idea: "bg-status-idea/15 ring-status-idea/50",
  }[accent];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
        active ? `${activeBg} ring-2 shadow-sm` : "bg-muted hover:bg-muted/70"
      }`}
    >
      <span className={`font-bold ${accentColor}`}>{value}</span>
      <span className="text-muted-foreground font-medium">{label}</span>
    </button>
  );
}
