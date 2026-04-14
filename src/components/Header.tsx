import { Settings, Menu } from "lucide-react";

interface HeaderProps {
  stats: { total: number; live: number; idea: number };
}

export default function Header({ stats }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Settings size={18} className="text-primary" />
        </div>
        <div>
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">GIBIKEY</span>
          <h1 className="text-foreground font-bold text-lg leading-tight flex items-center gap-2">
            Tool Tracker
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">V6</span>
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatBadge label="TOOL" value={stats.total} />
        <StatBadge label="LIVE" value={stats.live} />
        <StatBadge label="IDEA" value={stats.idea} />
        <button className="p-2 ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-xs">
      <span className="text-foreground font-bold">{value}</span>
      <span className="text-muted-foreground font-medium">{label}</span>
    </div>
  );
}
