import { Wrench } from "lucide-react";

interface HeaderProps {
  stats: { total: number; live: number; draft: number; idea: number };
}

export default function Header({ stats }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <Wrench size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-primary text-[10px] font-bold tracking-[0.2em]">GIBIKEY STUDIO</p>
            <h1 className="text-foreground font-bold text-lg leading-tight">Tool Tracker</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatBadge label="Total" value={stats.total} />
          <StatBadge label="Live" value={stats.live} color="text-status-published" />
          <StatBadge label="Draft" value={stats.draft} color="text-status-draft" />
          <StatBadge label="Ide" value={stats.idea} color="text-primary" />
        </div>
      </div>
    </header>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full text-xs">
      <span className={`font-bold ${color || "text-foreground"}`}>{value}</span>
      <span className="text-muted-foreground font-medium">{label}</span>
    </div>
  );
}
