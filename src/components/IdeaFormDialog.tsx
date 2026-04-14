import { useState, useEffect } from "react";
import { Idea } from "@/types/tool";
import { X } from "lucide-react";

interface IdeaFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Idea, "id" | "createdAt"> | Partial<Idea>) => void;
  editIdea?: Idea | null;
}

export default function IdeaFormDialog({ open, onClose, onSave, editIdea }: IdeaFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editIdea) {
      setName(editIdea.name); setDescription(editIdea.description); setNotes(editIdea.notes);
    } else {
      setName(""); setDescription(""); setNotes("");
    }
  }, [editIdea, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, notes });
    onClose();
  };

  const inputClass = "w-full bg-muted/50 border border-border/60 rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl shadow-primary/5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-foreground text-lg font-bold">{editIdea ? "Edit Ide" : "Catat Ide Baru"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nama Ide *</label>
            <input className={inputClass} placeholder="Nama ide tool..." value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Deskripsi</label>
            <textarea className={inputClass} placeholder="Deskripsi singkat..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div>
            <label className={labelClass}>Catatan</label>
            <textarea className={inputClass} placeholder="Catatan tambahan, referensi, dll..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
          <button type="submit" className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-semibold text-sm mt-1 hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20">
            {editIdea ? "Simpan" : "Catat Ide"}
          </button>
        </form>
      </div>
    </div>
  );
}
