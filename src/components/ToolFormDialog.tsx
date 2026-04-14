import { useState, useEffect } from "react";
import { Tool, ToolStatus } from "@/types/tool";
import { X } from "lucide-react";

interface ToolFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Tool, "id" | "notes"> | Partial<Tool>) => void;
  editTool?: Tool | null;
}

export default function ToolFormDialog({ open, onClose, onSave, editTool }: ToolFormDialogProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ToolStatus>("Pending");
  const [description, setDescription] = useState("");
  const [createdMethod, setCreatedMethod] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [version, setVersion] = useState("");
  const [link, setLink] = useState("");
  const [deployMethod, setDeployMethod] = useState("");
  const [deployEmail, setDeployEmail] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  useEffect(() => {
    if (editTool) {
      setName(editTool.name);
      setStatus(editTool.status);
      setDescription(editTool.description);
      setCreatedMethod(editTool.createdMethod);
      setCreatedBy(editTool.createdBy);
      setVersion(editTool.version || "");
      setLink(editTool.link || "");
      setDeployMethod(editTool.deployMethod || "");
      setDeployEmail(editTool.deployEmail || "");
      setReleaseDate(editTool.releaseDate || "");
    } else {
      setName(""); setStatus("Pending"); setDescription(""); setCreatedMethod("");
      setCreatedBy(""); setVersion(""); setLink(""); setDeployMethod(""); setDeployEmail(""); setReleaseDate("");
    }
  }, [editTool, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, status, description, createdMethod, createdBy, version, link, deployMethod, deployEmail, releaseDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-foreground text-lg font-bold">{editTool ? "Edit Tool" : "Tambah Tool"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Nama Tool" value={name} onChange={(e) => setName(e.target.value)} required />
          <select className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm" value={status} onChange={(e) => setStatus(e.target.value as ToolStatus)}>
            <option value="Pending">Pending</option>
            <option value="Publish">Publish</option>
          </select>
          <textarea className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <input className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Dibuat dengan (e.g. Lovable, Replit)" value={createdMethod} onChange={(e) => setCreatedMethod(e.target.value)} />
          <input className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Email pembuat" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} />
          <input className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Versi (e.g. v6.1)" value={version} onChange={(e) => setVersion(e.target.value)} />
          <input className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Deploy method" value={deployMethod} onChange={(e) => setDeployMethod(e.target.value)} />
          <input className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Deploy email" value={deployEmail} onChange={(e) => setDeployEmail(e.target.value)} />
          <input className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Tanggal rilis" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
          <input className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
          <button type="submit" className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-semibold text-sm mt-2 hover:opacity-90 transition-opacity">
            {editTool ? "Simpan" : "Tambah"}
          </button>
        </form>
      </div>
    </div>
  );
}
