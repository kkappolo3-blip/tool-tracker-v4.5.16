import { useState, useEffect } from "react";
import { Tool, ToolStatus, ToolCategory } from "@/types/tool";
import { X, Sparkles, Plus } from "lucide-react";
import { useSavedEmails } from "@/hooks/useSavedEmails";

const PLATFORMS = ["Lovable", "Replit", "Atoms", "Canvas Gemini", "GPT Codex", "Z.ai", "Manual Coding", "Lainnya"];
const GITHUB_ACCOUNTS = ["gibikey", "koleksigibi", "Lainnya"];
const CATEGORIES: ToolCategory[] = ["Dijual", "Internal", "Polri"];

interface ToolFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Tool, "id" | "notes" | "done" | "planSteps" | "smallSteps" | "planStatus"> | Partial<Tool>) => void;
  editTool?: Tool | null;
  onGoalSubmit?: (toolData: any) => void;
}

export default function ToolFormDialog({ open, onClose, onSave, editTool, onGoalSubmit }: ToolFormDialogProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ToolStatus>("Draft");
  const [description, setDescription] = useState("");
  const [createdMethod, setCreatedMethod] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [githubAccount, setGithubAccount] = useState("");
  const [version, setVersion] = useState("");
  const [link, setLink] = useState("");
  const [deployMethod, setDeployMethod] = useState("");
  const [deployEmail, setDeployEmail] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [price, setPrice] = useState("");
  const [target, setTarget] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (editTool) {
      setName(editTool.name); setStatus(editTool.status); setDescription(editTool.description);
      setCreatedMethod(editTool.createdMethod); setCreatedBy(editTool.createdBy);
      setGithubAccount(editTool.githubAccount || ""); setVersion(editTool.version || "");
      setLink(editTool.link || ""); setDeployMethod(editTool.deployMethod || "");
      setDeployEmail(editTool.deployEmail || ""); setReleaseDate(editTool.releaseDate || "");
      setCategories(editTool.categories || []); setPrice(editTool.price || ""); setTarget(editTool.target || "");
      setGoal(editTool.goal || "");
    } else {
      setName(""); setStatus("Draft"); setDescription(""); setCreatedMethod(""); setCreatedBy("");
      setGithubAccount(""); setVersion(""); setLink(""); setDeployMethod(""); setDeployEmail("");
      setReleaseDate(""); setCategories([]); setPrice(""); setTarget(""); setGoal("");
    }
  }, [editTool, open]);

  if (!open) return null;

  const toggleCategory = (cat: ToolCategory) => {
    setCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, status, description, createdMethod, createdBy, githubAccount, version, link, deployMethod, deployEmail, releaseDate, categories, price, target, goal };
    onSave(data);
    onClose();
  };

  const handleGoalAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !name.trim()) return;
    const data = { name, status, description, createdMethod, createdBy, githubAccount, version, link, deployMethod, deployEmail, releaseDate, categories, price, target, goal };
    onSave(data);
    onClose();
    // Trigger AI plan generation
    onGoalSubmit?.(data);
  };

  const inputClass = "w-full bg-muted/50 border border-border/60 rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border/60 rounded-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto shadow-2xl shadow-primary/5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-foreground text-lg font-bold">{editTool ? "Edit Tool" : "Buat Tool Baru"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nama Tool *</label>
            <input className={inputClass} placeholder="Nama tool..." value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Deskripsi</label>
            <textarea className={inputClass} placeholder="Deskripsi singkat..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>

          {/* Goal field */}
          <div>
            <label className={labelClass}>🎯 Goal</label>
            <textarea
              className={inputClass}
              placeholder="Tulis goal utama tool ini, misal: Foto TimeSTAMP, Aplikasi kasir sederhana..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">AI akan membantu memecah goal ini menjadi langkah-langkah pembuatan</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Dibuat di</label>
              <select className={inputClass} value={createdMethod} onChange={(e) => setCreatedMethod(e.target.value)}>
                <option value="">Pilih platform...</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Akun / Email</label>
              <select className={inputClass} value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}>
                <option value="">Pilih akun...</option>
                {ACCOUNTS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Akun GitHub</label>
            <select className={inputClass} value={githubAccount} onChange={(e) => setGithubAccount(e.target.value)}>
              <option value="">Pilih GitHub...</option>
              {GITHUB_ACCOUNTS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Deploy di</label>
              <select className={inputClass} value={deployMethod} onChange={(e) => setDeployMethod(e.target.value)}>
                <option value="">Pilih platform...</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Akun Deploy</label>
              <select className={inputClass} value={deployEmail} onChange={(e) => setDeployEmail(e.target.value)}>
                <option value="">Pilih akun...</option>
                {ACCOUNTS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Versi</label>
              <input className={inputClass} placeholder="e.g. v1.0" value={version} onChange={(e) => setVersion(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Tanggal Rilis</label>
              <input className={inputClass} placeholder="e.g. 14 Apr 2026" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Kategori Status</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat} type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    categories.includes(cat)
                      ? "bg-primary/20 border-primary/40 text-primary"
                      : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {categories.includes("Dijual") && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Estimasi Harga</label>
                <input className={inputClass} placeholder="e.g. Rp 500.000" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Target</label>
                <input className={inputClass} placeholder="e.g. UMKM, Freelancer" value={target} onChange={(e) => setTarget(e.target.value)} />
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Status</label>
            <div className="flex gap-2">
              {(["Draft", "Published"] as ToolStatus[]).map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                    status === s
                      ? s === "Published" ? "bg-status-published/15 border-status-published/40 text-status-published" : "bg-status-draft/15 border-status-draft/40 text-status-draft"
                      : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20">
              {editTool ? "Simpan Perubahan" : "Buat Tool"}
            </button>
            {goal.trim() && name.trim() && !editTool && (
              <button
                type="button"
                onClick={handleGoalAI}
                className="flex items-center gap-2 bg-accent text-accent-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-all hover:shadow-lg border border-primary/30"
              >
                <Sparkles size={16} className="text-primary" />
                Buat + AI Plan
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
