import { useState } from "react";
import { X } from "lucide-react";

interface PublishLinkDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (link: string) => void;
  toolName: string;
}

export default function PublishLinkDialog({ open, onClose, onSave, toolName }: PublishLinkDialogProps) {
  const [link, setLink] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(link);
    setLink("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl shadow-primary/5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-foreground text-lg font-bold">Link Publish</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Tempelkan link publish untuk <span className="text-foreground font-medium">{toolName}</span></p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="w-full bg-muted/50 border border-border/60 rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            placeholder="https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <button type="submit" className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
            Simpan Link
          </button>
        </form>
      </div>
    </div>
  );
}
