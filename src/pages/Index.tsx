import { useState, useMemo } from "react";
import { Plus, Search, X, Lightbulb, Wrench, PackageOpen } from "lucide-react";
import Header from "@/components/Header";
import ToolCard from "@/components/ToolCard";
import ToolFormDialog from "@/components/ToolFormDialog";
import IdeaCard from "@/components/IdeaCard";
import IdeaFormDialog from "@/components/IdeaFormDialog";
import PublishLinkDialog from "@/components/PublishLinkDialog";
import SkeletonCard from "@/components/SkeletonCard";
import { useToolStore } from "@/hooks/useToolStore";
import { Tool, Idea } from "@/types/tool";

type Tab = "Tool" | "Ide";
type Filter = "Semua" | "Published" | "Draft";

export default function Index() {
  const {
    tools, addTool, updateTool, deleteTool, toggleToolDone, toggleNote,
    ideas, addIdea, updateIdea, deleteIdea, moveIdeaToTool,
    stats, loading,
  } = useToolStore();

  const [tab, setTab] = useState<Tab>("Tool");
  const [filter, setFilter] = useState<Filter>("Semua");
  const [search, setSearch] = useState("");
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false);
  const [editIdea, setEditIdea] = useState<Idea | null>(null);
  const [publishLinkTool, setPublishLinkTool] = useState<Tool | null>(null);

  const filtered = useMemo(() => {
    let result = tools;
    if (filter === "Published") result = result.filter((t) => t.status === "Published");
    if (filter === "Draft") result = result.filter((t) => t.status === "Draft");
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    return result;
  }, [tools, filter, search]);

  const filteredIdeas = useMemo(() => {
    if (!search) return ideas;
    const q = search.toLowerCase();
    return ideas.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }, [ideas, search]);

  const handleSaveTool = (data: any) => {
    if (editTool) updateTool(editTool.id, data);
    else addTool(data);
    setEditTool(null);
  };

  const handleEditTool = (tool: Tool) => { setEditTool(tool); setToolDialogOpen(true); };
  const handleDeleteTool = (id: string) => { if (confirm("Hapus tool ini?")) deleteTool(id); };

  const handleSaveIdea = (data: any) => {
    if (editIdea) updateIdea(editIdea.id, data);
    else addIdea(data);
    setEditIdea(null);
  };

  const handleEditIdea = (idea: Idea) => { setEditIdea(idea); setIdeaDialogOpen(true); };
  const handleDeleteIdea = (id: string) => { if (confirm("Hapus ide ini?")) deleteIdea(id); };

  const handlePublishLink = (link: string) => {
    if (publishLinkTool) updateTool(publishLinkTool.id, { link });
  };

  const handleMoveIdea = (id: string) => {
    if (confirm("Pindahkan ide ini ke Tool Tracker?")) moveIdeaToTool(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header stats={stats} />

      <div className="max-w-6xl mx-auto">
        {/* Tabs & Search */}
        <div className="px-4 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex gap-1 bg-muted/40 rounded-xl p-1">
            {([
              { key: "Tool" as Tab, icon: <Wrench size={14} />, label: "Tool Tracker" },
              { key: "Ide" as Tab, icon: <Lightbulb size={14} />, label: "Ide" },
            ]).map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === key ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {tab === "Tool" && (
            <div className="flex gap-1 bg-muted/40 rounded-xl p-1">
              {(["Semua", "Published", "Draft"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          <div className="relative flex-1 w-full sm:w-auto sm:max-w-xs ml-auto">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full bg-muted/40 border border-border/40 rounded-xl pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {tab === "Tool" ? (
          <div className="px-4 pb-24">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <PackageOpen size={48} className="text-muted-foreground/40" />
                <p className="text-sm">{search ? "Tidak ditemukan" : "Belum ada tool"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onEdit={handleEditTool}
                    onDelete={handleDeleteTool}
                    onToggleDone={toggleToolDone}
                    onToggleNote={toggleNote}
                    onPublishLink={(t) => setPublishLinkTool(t)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 pb-24">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredIdeas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <Lightbulb size={48} className="text-muted-foreground/40" />
                <p className="text-sm">{search ? "Tidak ditemukan" : "Belum ada ide — catat ide pertamamu!"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} onEdit={handleEditIdea} onDelete={handleDeleteIdea} onMoveToTool={handleMoveIdea} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          if (tab === "Tool") { setEditTool(null); setToolDialogOpen(true); }
          else { setEditIdea(null); setIdeaDialogOpen(true); }
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform z-40"
      >
        <Plus size={26} />
      </button>

      <ToolFormDialog
        open={toolDialogOpen}
        onClose={() => { setToolDialogOpen(false); setEditTool(null); }}
        onSave={handleSaveTool}
        editTool={editTool}
      />

      <IdeaFormDialog
        open={ideaDialogOpen}
        onClose={() => { setIdeaDialogOpen(false); setEditIdea(null); }}
        onSave={handleSaveIdea}
        editIdea={editIdea}
      />

      <PublishLinkDialog
        open={!!publishLinkTool}
        onClose={() => setPublishLinkTool(null)}
        onSave={handlePublishLink}
        toolName={publishLinkTool?.name || ""}
      />
    </div>
  );
}
