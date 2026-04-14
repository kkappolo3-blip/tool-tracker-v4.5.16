import { Idea } from "@/types/tool";
import { Edit2, Trash2, ArrowRight } from "lucide-react";

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onMoveToTool: (id: string) => void;
}

export default function IdeaCard({ idea, onEdit, onDelete, onMoveToTool }: IdeaCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
      <div className="flex items-start justify-between">
        <h3 className="text-foreground font-bold text-base">{idea.name}</h3>
        <div className="flex gap-0.5">
          <button onClick={() => onMoveToTool(idea.id)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Pindahkan ke Tool Tracker">
            <ArrowRight size={15} />
          </button>
          <button onClick={() => onEdit(idea)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Edit2 size={15} />
          </button>
          <button onClick={() => onDelete(idea.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      {idea.description && <p className="text-muted-foreground text-sm">{idea.description}</p>}
      {idea.notes && (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 italic">💡 {idea.notes}</p>
      )}
      <p className="text-xs text-muted-foreground mt-auto">{idea.createdAt}</p>
    </div>
  );
}
