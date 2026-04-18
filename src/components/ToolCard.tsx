import { useState } from "react";
import { Tool } from "@/types/tool";
import { Edit2, Trash2, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Circle, Link2, Sparkles, Target, Plus, X, Check, Clock } from "lucide-react";

function timeAgo(iso?: string) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

interface ToolCardProps {
  tool: Tool;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  onToggleNote: (toolId: string, noteId: string) => void;
  onAddNote: (toolId: string, text: string) => void;
  onDeleteNote: (toolId: string, noteId: string) => void;
  onEditNote: (toolId: string, noteId: string, text: string) => void;
  onPublishLink: (tool: Tool) => void;
  onOpenPlan: (tool: Tool) => void;
}

export default function ToolCard({
  tool, onEdit, onDelete, onToggleDone, onToggleNote, onAddNote, onDeleteNote, onEditNote, onPublishLink, onOpenPlan,
}: ToolCardProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const isPublished = tool.status === "Published";
  const doneNotes = tool.notes.filter((n) => n.done).length;
  const doneSmallSteps = tool.smallSteps?.filter((s) => s.done).length || 0;
  const totalSmallSteps = tool.smallSteps?.length || 0;
  const planInProgress = tool.planStatus && tool.planStatus !== "none" && tool.planStatus !== "done";

  const planStatusLabel = () => {
    switch (tool.planStatus) {
      case "generated": return { text: "Plan Siap", color: "text-status-draft" };
      case "executing": return { text: `Eksekusi ${doneSmallSteps}/${totalSmallSteps}`, color: "text-secondary" };
      case "reviewing": return { text: "Review AI", color: "text-accent" };
      case "done": return { text: "Plan Selesai", color: "text-status-published" };
      default: return null;
    }
  };

  const planLabel = planStatusLabel();

  const submitNote = () => {
    if (!newNote.trim()) return;
    onAddNote(tool.id, newNote.trim());
    setNewNote("");
  };

  const startEdit = (id: string, text: string) => {
    setEditingNoteId(id);
    setEditingText(text);
  };

  const saveEdit = (id: string) => {
    if (editingText.trim()) onEditNote(tool.id, id, editingText.trim());
    setEditingNoteId(null);
    setEditingText("");
  };

  return (
    <div className={`bg-card rounded-2xl border border-border shadow-card p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5 ${tool.done ? "opacity-70" : ""}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button onClick={() => onToggleDone(tool.id)} className="mt-1 text-muted-foreground hover:text-primary transition-colors">
            {tool.done ? <CheckCircle2 size={20} className="text-status-published" /> : <Circle size={20} />}
          </button>
          <div className="flex flex-col gap-1.5">
            <h3 className={`text-foreground font-bold text-base ${tool.done ? "line-through" : ""}`}>{tool.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isPublished ? "bg-status-published/15 text-status-published" : "bg-status-draft/15 text-status-draft"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-status-published" : "bg-status-draft"}`} />
                {tool.status}
              </span>
              {tool.version && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tool.version}</span>
              )}
              {tool.categories.map((cat) => (
                <span key={cat} className="text-xs bg-secondary/15 text-secondary px-2 py-0.5 rounded-full font-medium">{cat}</span>
              ))}
              {planLabel && (
                <span className={`text-xs font-medium ${planLabel.color}`}>• {planLabel.text}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {tool.status === "Published" && !tool.link && (
            <button onClick={() => onPublishLink(tool)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Tambah link">
              <Link2 size={15} />
            </button>
          )}
          <button onClick={() => onEdit(tool)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Edit2 size={15} />
          </button>
          <button onClick={() => onDelete(tool.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Goal */}
      {tool.goal && (
        <div className="flex items-start gap-2 pl-8">
          <Target size={13} className="text-primary mt-0.5 shrink-0" />
          <p className="text-foreground/80 text-xs font-medium line-clamp-1">{tool.goal}</p>
        </div>
      )}

      {/* Description */}
      {tool.description && (
        <p className="text-muted-foreground text-sm line-clamp-2 pl-8">{tool.description}</p>
      )}

      {/* Meta */}
      <div className="flex flex-col gap-1 text-sm pl-8">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-muted-foreground text-xs">Dibuat di</span>
          <span className="text-foreground font-medium text-xs">{tool.createdMethod || "—"}</span>
          {tool.createdBy && <span className="text-muted-foreground text-xs">· {tool.createdBy}</span>}
        </div>
        {tool.deployMethod && (
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-muted-foreground text-xs">Deploy</span>
            <span className="text-secondary font-medium text-xs">{tool.deployMethod}</span>
            {tool.deployEmail && <span className="text-muted-foreground text-xs">· {tool.deployEmail}</span>}
          </div>
        )}
        {tool.releaseDate && (
          <div className="flex gap-2 items-center">
            <span className="text-muted-foreground text-xs">Rilis</span>
            <span className="text-foreground text-xs">{tool.releaseDate}</span>
          </div>
        )}
        {tool.price && (
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-muted-foreground text-xs">Harga</span>
            <span className="text-primary font-semibold text-xs">{tool.price}</span>
            {tool.target && <span className="text-muted-foreground text-xs">· Target: {tool.target}</span>}
          </div>
        )}
        {tool.link && (
          <a href={tool.link.startsWith("http") ? tool.link : `https://${tool.link}`} target="_blank" rel="noopener noreferrer"
            className="text-secondary hover:underline flex items-center gap-1 text-xs w-fit">
            <ExternalLink size={11} /> {tool.link}
          </a>
        )}
      </div>

      {/* AI Plan resume / start button — prominent */}
      {(tool.goal || planInProgress) && (
        <div className="pl-8">
          <button
            onClick={() => onOpenPlan(tool)}
            className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-all border ${
              planInProgress
                ? "bg-gradient-primary text-primary-foreground border-transparent shadow-card pulse-orange"
                : "bg-primary-soft border-primary/30 text-primary hover:bg-primary/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} />
              <span className="text-xs font-bold">
                {planInProgress ? "Lanjutkan Progress AI" : "Mulai AI Plan"}
              </span>
            </div>
            {totalSmallSteps > 0 && (
              <span className="text-xs font-semibold opacity-90">{doneSmallSteps}/{totalSmallSteps}</span>
            )}
          </button>
          {totalSmallSteps > 0 && (
            <div className="h-1 rounded-full bg-muted overflow-hidden mt-2">
              <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${(doneSmallSteps / totalSmallSteps) * 100}%` }} />
            </div>
          )}
        </div>
      )}

      {/* Notes section */}
      <div className="pl-8 pt-1">
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>
            Catatan {tool.notes.length > 0 && <span className="text-primary font-semibold">{doneNotes}/{tool.notes.length}</span>}
          </span>
          {notesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {tool.notes.length > 0 && (
          <div className="h-1 rounded-full bg-muted overflow-hidden mt-2">
            <div className="h-full rounded-full bg-status-published transition-all" style={{ width: `${tool.notes.length ? (doneNotes / tool.notes.length) * 100 : 0}%` }} />
          </div>
        )}

        {notesOpen && (
          <div className="flex flex-col gap-1.5 mt-2 ml-1 pl-3 border-l-2 border-border">
            {tool.notes.map((note) => (
              <div key={note.id} className="flex items-center gap-2 text-sm group">
                <button onClick={() => onToggleNote(tool.id, note.id)} className="shrink-0">
                  {note.done ? <CheckCircle2 size={14} className="text-status-published" /> : <Circle size={14} className="text-muted-foreground" />}
                </button>

                {editingNoteId === note.id ? (
                  <>
                    <input
                      autoFocus
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(note.id); if (e.key === "Escape") setEditingNoteId(null); }}
                      className="flex-1 bg-muted border border-border rounded-md px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button onClick={() => saveEdit(note.id)} className="p-1 text-status-published hover:bg-status-published/10 rounded">
                      <Check size={12} />
                    </button>
                    <button onClick={() => setEditingNoteId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded">
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      onClick={() => onToggleNote(tool.id, note.id)}
                      className={`flex-1 cursor-pointer ${note.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {note.text}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{note.createdAt}</span>
                    <button
                      onClick={() => startEdit(note.id, note.text)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-opacity"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={() => onDeleteNote(tool.id, note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-opacity"
                    >
                      <Trash2 size={11} />
                    </button>
                  </>
                )}
              </div>
            ))}

            {/* Add note */}
            <div className="flex items-center gap-1.5 mt-1">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitNote(); }}
                placeholder="Tulis catatan baru..."
                className="flex-1 bg-muted border border-border rounded-md px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={submitNote}
                disabled={!newNote.trim()}
                className="p-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-40 transition-all"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Per-card watermark */}
      {tool.updatedAt && (
        <div className="pl-8 pt-1 flex items-center gap-1 text-[10px] text-muted-foreground/70 border-t border-border/50 mt-1">
          <Clock size={10} />
          <span>Diedit {timeAgo(tool.updatedAt)}</span>
        </div>
      )}
    </div>
  );
}
