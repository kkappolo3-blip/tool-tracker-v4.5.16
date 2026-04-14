import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import ToolCard from "@/components/ToolCard";
import ToolFormDialog from "@/components/ToolFormDialog";
import { useToolStore } from "@/hooks/useToolStore";
import { Tool } from "@/types/tool";

type Tab = "Tool" | "Planning";

export default function Index() {
  const { tools, addTool, updateTool, deleteTool, stats } = useToolStore();
  const [tab, setTab] = useState<Tab>("Tool");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tools.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [tools, search]);

  const pending = filtered.filter((t) => t.status === "Pending");
  const published = filtered.filter((t) => t.status === "Publish");

  const handleSave = (data: any) => {
    if (editTool) {
      updateTool(editTool.id, data);
    } else {
      addTool(data);
    }
    setEditTool(null);
  };

  const handleEdit = (tool: Tool) => {
    setEditTool(tool);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus tool ini?")) deleteTool(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header stats={stats} />

      {/* Tabs & Search */}
      <div className="px-4 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1">
          {(["Tool", "Planning"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 w-full sm:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full bg-muted border border-border rounded-full pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {tab === "Tool" ? (
        <div className="px-4 pb-24">
          {/* Pending */}
          {pending.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">DALAM PROSES</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{pending.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pending.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}

          {/* Published */}
          {published.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4 justify-center">
                <div className="w-2 h-2 rounded-full bg-status-publish" />
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">PUBLISH ({published.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {published.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="px-4 py-12 text-center text-muted-foreground">
          <p className="text-lg">Planning board segera hadir 🚀</p>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => { setEditTool(null); setDialogOpen(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40"
      >
        <Plus size={28} />
      </button>

      <ToolFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditTool(null); }}
        onSave={handleSave}
        editTool={editTool}
      />
    </div>
  );
}
