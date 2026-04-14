import { useState } from "react";
import { Tool } from "@/types/tool";
import { Edit2, Trash2, ChevronDown, ChevronUp, FileText, ExternalLink } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
}

export default function ToolCard({ tool, onEdit, onDelete }: ToolCardProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const isPending = tool.status === "Pending";

  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3 relative group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-foreground font-bold text-lg">{tool.name}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isPending
                  ? "bg-status-pending/20 text-status-pending"
                  : "bg-status-publish/20 text-status-publish"
              }`}
            >
              {tool.status}
            </span>
            {tool.version && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {tool.version}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(tool)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(tool.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      {tool.description && (
        <p className="text-muted-foreground text-sm line-clamp-2">{tool.description}</p>
      )}

      {/* Meta info */}
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex gap-3">
          <span className="text-muted-foreground">Dibuat</span>
          <span className="text-foreground font-medium">{tool.createdMethod}</span>
          {tool.createdBy && <span className="text-muted-foreground">· {tool.createdBy}</span>}
        </div>
        {tool.deployMethod && (
          <div className="flex gap-3">
            <span className="text-muted-foreground">Deploy</span>
            <span className="text-primary font-medium">{tool.deployMethod}</span>
            {tool.deployEmail && <span className="text-muted-foreground">· {tool.deployEmail}</span>}
          </div>
        )}
        {tool.releaseDate && (
          <div className="flex gap-3">
            <span className="text-muted-foreground">Rilis</span>
            <span className="text-primary font-medium">{tool.releaseDate}</span>
          </div>
        )}
        {tool.link && (
          <div className="flex gap-3 items-center">
            <span className="text-muted-foreground">Link</span>
            <a href={`https://${tool.link}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
              <ExternalLink size={12} />
              {tool.link}
            </a>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isPending ? "bg-status-pending" : "bg-status-publish"}`}
          style={{ width: isPending ? "40%" : "100%" }}
        />
      </div>

      {/* Notes toggle */}
      <button
        onClick={() => setNotesOpen(!notesOpen)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-1"
      >
        <FileText size={14} />
        <span>
          Catatan{" "}
          <span className="text-primary font-medium">
            {tool.notes.length > 0 ? `0/${tool.notes.length}` : "0"}
          </span>
        </span>
        {notesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {notesOpen && tool.notes.length > 0 && (
        <div className="flex flex-col gap-2 pl-6 border-l-2 border-border">
          {tool.notes.map((note) => (
            <div key={note.id} className="text-sm text-muted-foreground">
              <span className="text-foreground">{note.text}</span>
              <span className="ml-2 text-xs">({note.createdAt})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
