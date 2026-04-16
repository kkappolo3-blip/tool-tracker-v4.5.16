import { useState } from "react";
import { Tool, PlanStep, SmallStep } from "@/types/tool";
import { supabase } from "@/integrations/supabase/client";
import {
  X, Sparkles, Edit3, Play, Copy, Check, ChevronDown, ChevronUp,
  Loader2, FileText, CheckCircle2, Circle, MessageSquare, RotateCcw
} from "lucide-react";
import { toast } from "sonner";

const generateId = () => Math.random().toString(36).substring(2, 9);

interface GoalPlanDialogProps {
  open: boolean;
  tool: Tool | null;
  onClose: () => void;
  onUpdateTool: (id: string, updates: Partial<Tool>) => void;
}

export default function GoalPlanDialog({ open, tool, onClose, onUpdateTool }: GoalPlanDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [editingPlan, setEditingPlan] = useState(false);
  const [editText, setEditText] = useState("");
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!open || !tool) return null;

  const callAI = async (action: string, extra: Record<string, any> = {}) => {
    const { data, error } = await supabase.functions.invoke("generate-plan", {
      body: { action, toolName: tool.name, goal: tool.goal, ...extra },
    });
    if (error) throw new Error(error.message || "AI error");
    if (data?.error) throw new Error(data.error);
    return data.result as string;
  };

  const generatePlan = async () => {
    setLoading(true);
    setLoadingMessage("AI sedang membuat alur pembuatan...");
    try {
      const result = await callAI("generate_plan");
      const steps: PlanStep[] = result
        .split("\n")
        .filter((line: string) => /^\d+\./.test(line.trim()))
        .map((line: string) => ({
          id: generateId(),
          text: line.replace(/^\d+\.\s*/, "").trim(),
          done: false,
        }));
      if (steps.length === 0) {
        steps.push({ id: generateId(), text: result.trim(), done: false });
      }
      onUpdateTool(tool.id, { planSteps: steps, planStatus: "generated" });
      toast.success("Alur berhasil dibuat!");
    } catch (e: any) {
      toast.error(e.message || "Gagal generate plan");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleEditPlan = () => {
    setEditText(tool.planSteps.map((s, i) => `${i + 1}. ${s.text}`).join("\n"));
    setEditingPlan(true);
  };

  const saveEditPlan = () => {
    const steps: PlanStep[] = editText
      .split("\n")
      .filter((l) => l.trim())
      .map((line) => ({
        id: generateId(),
        text: line.replace(/^\d+\.\s*/, "").trim(),
        done: false,
      }));
    onUpdateTool(tool.id, { planSteps: steps, planStatus: "generated", smallSteps: [], aiReport: undefined });
    setEditingPlan(false);
    toast.success("Plan diperbarui!");
  };

  const executePlan = async () => {
    setLoading(true);
    setLoadingMessage("AI sedang memecah langkah menjadi instruksi kecil...");
    try {
      const result = await callAI("break_steps", {
        planSteps: tool.planSteps.map((s) => s.text),
      });
      const smallSteps: SmallStep[] = result
        .split("\n")
        .filter((line: string) => line.trim().startsWith("LANGKAH"))
        .map((line: string) => {
          const match = line.match(/LANGKAH\s*(\d+)\.\d+:\s*(.*)/);
          const parentIdx = match ? parseInt(match[1]) - 1 : 0;
          const parentId = tool.planSteps[parentIdx]?.id || tool.planSteps[0]?.id || "";
          return {
            id: generateId(),
            parentStepId: parentId,
            text: match ? match[2].trim() : line.replace(/^LANGKAH\s*\d+\.\d+:\s*/, "").trim(),
            workerNote: "",
            done: false,
          };
        });
      if (smallSteps.length === 0) {
        // Fallback: treat each line as a step
        result.split("\n").filter((l: string) => l.trim()).forEach((line: string, i: number) => {
          const parentId = tool.planSteps[Math.min(i, tool.planSteps.length - 1)]?.id || "";
          smallSteps.push({
            id: generateId(),
            parentStepId: parentId,
            text: line.replace(/^[-•\d.]+\s*/, "").trim(),
            workerNote: "",
            done: false,
          });
        });
      }
      onUpdateTool(tool.id, { smallSteps, planStatus: "executing" });
      toast.success("Instruksi kecil berhasil dibuat!");
    } catch (e: any) {
      toast.error(e.message || "Gagal break steps");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Disalin ke clipboard!");
  };

  const handleWorkerNoteChange = (stepId: string, note: string) => {
    const updated = tool.smallSteps.map((s) => (s.id === stepId ? { ...s, workerNote: note } : s));
    onUpdateTool(tool.id, { smallSteps: updated });
  };

  const toggleSmallStepDone = (stepId: string) => {
    const updated = tool.smallSteps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s));
    onUpdateTool(tool.id, { smallSteps: updated });
  };

  const toggleExpand = (id: string) => {
    setExpandedSteps((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const allSmallStepsDone = tool.smallSteps.length > 0 && tool.smallSteps.every((s) => s.done);

  const analyzeWorkerNotes = async () => {
    setLoading(true);
    setLoadingMessage("AI sedang menganalisa laporan worker...");
    try {
      const workerNotes = tool.smallSteps.map((s) => ({ step: s.text, note: s.workerNote }));
      const result = await callAI("analyze_worker", { workerNotes });
      onUpdateTool(tool.id, { aiReport: result, planStatus: "reviewing" });
      toast.success("Analisa selesai!");
    } catch (e: any) {
      toast.error(e.message || "Gagal analisa");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const markDone = () => {
    onUpdateTool(tool.id, { planStatus: "done", done: true });
    toast.success("Tool ditandai selesai!");
    onClose();
  };

  const doneSmallSteps = tool.smallSteps.filter((s) => s.done).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border/60 rounded-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto shadow-2xl shadow-primary/5" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-foreground text-lg font-bold">AI Plan — {tool.name}</h2>
            </div>
            {tool.goal && (
              <p className="text-sm text-muted-foreground">🎯 {tool.goal}</p>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 py-8 justify-center">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">{loadingMessage}</span>
          </div>
        )}

        {/* Step 1: No plan yet */}
        {!loading && tool.planStatus === "none" && (
          <div className="text-center py-8">
            <Sparkles size={40} className="mx-auto text-primary/40 mb-3" />
            <p className="text-muted-foreground text-sm mb-4">Belum ada plan. Klik tombol di bawah untuk meminta AI membuat alur pembuatan.</p>
            <button onClick={generatePlan} className="bg-primary text-primary-foreground rounded-xl px-6 py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
              <span className="flex items-center gap-2"><Sparkles size={16} /> Generate Plan</span>
            </button>
          </div>
        )}

        {/* Step 2: Plan generated — edit or execute */}
        {!loading && tool.planStatus === "generated" && !editingPlan && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">📋 Alur Pembuatan</h3>
            <div className="flex flex-col gap-2 mb-4">
              {tool.planSteps.map((step, i) => (
                <div key={step.id} className="flex items-start gap-2 bg-muted/30 rounded-xl px-3 py-2.5 border border-border/40">
                  <span className="text-primary font-bold text-sm mt-0.5">{i + 1}.</span>
                  <span className="text-foreground text-sm">{step.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleEditPlan} className="flex-1 flex items-center justify-center gap-2 bg-muted/50 border border-border/60 text-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:bg-muted transition-all">
                <Edit3 size={16} /> Edit Plan
              </button>
              <button onClick={executePlan} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
                <Play size={16} /> Eksekusi Plan
              </button>
            </div>
          </div>
        )}

        {/* Edit plan mode */}
        {!loading && editingPlan && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">✏️ Edit Alur</h3>
            <p className="text-xs text-muted-foreground mb-2">Satu langkah per baris. Tambah atau kurangi sesuai kebutuhan.</p>
            <textarea
              className="w-full bg-muted/50 border border-border/60 rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all min-h-[200px] font-mono"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditingPlan(false)} className="flex-1 bg-muted/50 border border-border/60 text-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:bg-muted transition-all">
                Batal
              </button>
              <button onClick={saveEditPlan} className="flex-1 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
                Simpan Plan
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Executing — small steps with copy & worker notes */}
        {!loading && tool.planStatus === "executing" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">🔧 Instruksi untuk Worker</h3>
              <span className="text-xs text-muted-foreground">{doneSmallSteps}/{tool.smallSteps.length} selesai</span>
            </div>

            {/* Progress */}
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${tool.smallSteps.length ? (doneSmallSteps / tool.smallSteps.length) * 100 : 0}%` }} />
            </div>

            <div className="flex flex-col gap-3">
              {tool.smallSteps.map((step, i) => (
                <div key={step.id} className={`border rounded-xl transition-all ${step.done ? "border-status-published/40 bg-status-published/5" : "border-border/40 bg-muted/20"}`}>
                  {/* Step header */}
                  <div className="flex items-start gap-2 px-3 py-2.5">
                    <button onClick={() => toggleSmallStepDone(step.id)} className="mt-0.5 shrink-0">
                      {step.done ? <CheckCircle2 size={18} className="text-status-published" /> : <Circle size={18} className="text-muted-foreground" />}
                    </button>
                    <span className={`text-sm flex-1 ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {step.text}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => copyToClipboard(step.text, step.id)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy instruksi"
                      >
                        {copiedId === step.id ? <Check size={14} className="text-status-published" /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={() => toggleExpand(step.id)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {expandedSteps.has(step.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Worker note */}
                  {expandedSteps.has(step.id) && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MessageSquare size={12} className="text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Catatan dari Worker</span>
                      </div>
                      <textarea
                        className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all min-h-[80px]"
                        placeholder="Paste laporan dari worker di sini..."
                        value={step.workerNote}
                        onChange={(e) => handleWorkerNoteChange(step.id, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={handleEditPlan} className="flex-1 flex items-center justify-center gap-2 bg-muted/50 border border-border/60 text-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:bg-muted transition-all">
                <Edit3 size={16} /> Edit Plan
              </button>
              {allSmallStepsDone && (
                <button onClick={analyzeWorkerNotes} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
                  <FileText size={16} /> Analisa Laporan
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Reviewing — AI report */}
        {!loading && tool.planStatus === "reviewing" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">📊 Laporan AI</h3>
            <div className="bg-muted/30 border border-border/40 rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap mb-4 max-h-[300px] overflow-y-auto">
              {tool.aiReport}
            </div>
            <div className="flex gap-2">
              <button onClick={handleEditPlan} className="flex-1 flex items-center justify-center gap-2 bg-muted/50 border border-border/60 text-foreground rounded-xl px-4 py-2.5 font-semibold text-sm hover:bg-muted transition-all">
                <RotateCcw size={16} /> Edit Plan
              </button>
              <button onClick={markDone} className="flex-1 flex items-center justify-center gap-2 bg-status-published text-white rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
                <CheckCircle2 size={16} /> Selesai
              </button>
            </div>
          </div>
        )}

        {/* Done state */}
        {!loading && tool.planStatus === "done" && (
          <div className="text-center py-8">
            <CheckCircle2 size={40} className="mx-auto text-status-published mb-3" />
            <p className="text-foreground font-semibold mb-1">Tool selesai dibuat!</p>
            <p className="text-sm text-muted-foreground">Semua langkah sudah dikerjakan dan diverifikasi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
