import { useState, useMemo } from "react";
import { Plus, Search, X, Lightbulb, PackageOpen } from "lucide-react";
import Header from "@/components/Header";
import ToolCard from "@/components/ToolCard";
import ToolFormDialog from "@/components/ToolFormDialog";
import IdeaCard from "@/components/IdeaCard";
import IdeaFormDialog from "@/components/IdeaFormDialog";
import PublishLinkDialog from "@/components/PublishLinkDialog";
import GoalPlanDialog from "@/components/GoalPlanDialog";
import SkeletonCard from "@/components/SkeletonCard";
import Watermark from "@/components/Watermark";
import { useToolStore } from "@/hooks/useToolStore";
import { Tool, Idea } from "@/types/tool";

type Filter = "all" | "live" | "draft" | "idea";

export default function Index() {
  const {
    tools, addTool, updateTool, deleteTool, toggleToolDone,
    addNote, deleteNote, toggleNote, editNote,
    ideas, addIdea, updateIdea, deleteIdea, moveIdeaToTool,
    stats, loading, lastEdit,
  } = useToolStore();

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false);
  const [editIdea, setEditIdea] = useState<Idea | null>(null);
  const [publishLinkTool, setPublishLinkTool] = useState<Tool | null>(null);
  const [planTool, setPlanTool] = useState<Tool | null>(null);

  const showingIdeas = filter === "idea";

  const filteredTools = useMemo(() => {
    let result = tools;
    if (filter === "live") result = result.filter((t) => t.status === "Published");
    if (filter === "draft") result = result.filter((t) => t.status === "Draft");
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

  const currentPlanTool = planTool ? tools.find((t) => t.id === planTool.id) || planTool : null;

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

  const handleOpenPlan = (tool: Tool) => setPlanTool(tool);

  return (
    <div className="min-h-screen">
      <Header stats={stats} activeFilter={filter} onFilterChange={setFilter} />

      <div className="max-w-6xl mx-auto">
        {/* Search bar */}
        <div className="px-4 py-4 flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full bg-card border border-border rounded-xl pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all shadow-card"
              placeholder={showingIdeas ? "Cari ide..." : "Cari tool..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            {showingIdeas ? `${filteredIdeas.length} ide` : `${filteredTools.length} tool`}
          </span>
        </div>

        {/* Content */}
        {!showingIdeas ? (
          <div className="px-4 pb-24">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <PackageOpen size={48} className="text-muted-foreground/40" />
                <p className="text-sm">{search ? "Tidak ditemukan" : "Belum ada tool"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onEdit={handleEditTool}
                    onDelete={handleDeleteTool}
                    onToggleDone={toggleToolDone}
                    onToggleNote={toggleNote}
                    onAddNote={addNote}
                    onDeleteNote={deleteNote}
                    onEditNote={editNote}
                    onPublishLink={(t) => setPublishLinkTool(t)}
                    onOpenPlan={handleOpenPlan}
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
          if (showingIdeas) { setEditIdea(null); setIdeaDialogOpen(true); }
          else { setEditTool(null); setToolDialogOpen(true); }
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-primary text-primary-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition-transform z-40"
        title={showingIdeas ? "Tambah Ide" : "Tambah Tool"}
      >
        <Plus size={26} />
      </button>

      <ToolFormDialog
        open={toolDialogOpen}
        onClose={() => { setToolDialogOpen(false); setEditTool(null); }}
        onSave={handleSaveTool}
        editTool={editTool}
        onGoalSubmit={(data) => {
          setTimeout(() => {
            const found = tools.find((t) => t.name === data.name);
            if (found) setPlanTool(found);
          }, 200);
        }}
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

      <GoalPlanDialog
        open={!!currentPlanTool}
        tool={currentPlanTool}
        onClose={() => setPlanTool(null)}
        onUpdateTool={updateTool}
      />
      <Watermark lastEdit={lastEdit} />
    </div>
  );
}
