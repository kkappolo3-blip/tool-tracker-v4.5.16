import { useState } from "react";
import { Tool } from "@/types/tool";
import { Edit2, Trash2, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Circle, Link2 } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  onToggleNote: (toolId: string, noteId: string) => void;
  onPublishLink: (tool: Tool) => void;
}

export default function ToolCard({ tool, onEdit, onDelete, onToggleDone, onToggleNote, onPublishLink }: ToolCardProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const isPublished = tool.status === "Published";
  const doneNotes = tool.notes.filter((n) => n.done).length;

  return (
    <div className={`bg-card rounded-2xl border border-border/60 p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 ${tool.done ? "opacity-60" : ""}`}>
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
                <span key={cat} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{cat}</span>
              ))}
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

      {/* Description */}
      {tool.description && (
        <p className="text-muted-foreground text-sm line-clamp-2 pl-8">{tool.description}</p>
      )}

      {/* Meta */}
      <div className="flex flex-col gap-1 text-sm pl-8">
        <div className="flex gap-2 items-center">
          <span className="text-muted-foreground text-xs">Dibuat di</span>
          <span className="text-foreground font-medium text-xs">{tool.createdMethod || "—"}</span>
          {tool.createdBy && <span className="text-muted-foreground text-xs">· {tool.createdBy}</span>}
        </div>
        {tool.deployMethod && (
          <div className="flex gap-2 items-center">
            <span className="text-muted-foreground text-xs">Deploy</span>
            <span className="text-primary font-medium text-xs">{tool.deployMethod}</span>
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
          <div className="flex gap-2 items-center">
            <span className="text-muted-foreground text-xs">Harga</span>
            <span className="text-primary font-medium text-xs">{tool.price}</span>
            {tool.target && <span className="text-muted-foreground text-xs">· Target: {tool.target}</span>}
          </div>
        )}
        {tool.link && (
          <a href={tool.link.startsWith("http") ? tool.link : `https://${tool.link}`} target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 text-xs w-fit">
            <ExternalLink size={11} /> {tool.link}
          </a>
        )}
      </div>

      {/* Progress */}
      {tool.notes.length > 0 && (
        <div className="pl-8">
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(doneNotes / tool.notes.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Notes toggle */}
      {tool.notes.length > 0 && (
        <>
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors pl-8"
          >
            <span>Catatan <span className="text-primary font-semibold">{doneNotes}/{tool.notes.length}</span></span>
            {notesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {notesOpen && (
            <div className="flex flex-col gap-1.5 pl-8 ml-2 border-l-2 border-border/50">
              {tool.notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => onToggleNote(tool.id, note.id)}
                  className="flex items-center gap-2 text-sm text-left hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors"
                >
                  {note.done ? <CheckCircle2 size={14} className="text-status-published shrink-0" /> : <Circle size={14} className="text-muted-foreground shrink-0" />}
                  <span className={note.done ? "line-through text-muted-foreground" : "text-foreground"}>{note.text}</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">{note.createdAt}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
