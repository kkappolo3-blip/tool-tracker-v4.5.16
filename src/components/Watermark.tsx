import { useAuth } from "@/hooks/useAuth";

interface Props {
  lastEdit?: string | null;
}

function timeAgo(iso?: string | null) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  const d = Math.floor(h / 24);
  return `${d}h lalu`;
}

export default function Watermark({ lastEdit }: Props) {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="fixed bottom-2 left-2 z-30 pointer-events-none select-none text-[10px] text-muted-foreground/60 font-mono leading-tight bg-card/40 backdrop-blur-sm px-2 py-1 rounded-md">
      <div>👤 {user.email}</div>
      <div>✎ Edit: {timeAgo(lastEdit)}</div>
    </div>
  );
}
