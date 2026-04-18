import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tool, ToolNote, Idea, PlanStep, SmallStep } from "@/types/tool";

type ToolRow = any;
type NoteRow = any;
type IdeaRow = any;

const mapTool = (t: ToolRow, notes: ToolNote[]): Tool => ({
  id: t.id,
  name: t.name,
  status: t.status,
  description: t.description ?? "",
  createdBy: t.created_by ?? "",
  createdMethod: t.created_method ?? "",
  githubAccount: t.github_account ?? undefined,
  deployMethod: t.deploy_method ?? undefined,
  deployEmail: t.deploy_email ?? undefined,
  releaseDate: t.release_date ?? undefined,
  link: t.link ?? undefined,
  version: t.version ?? undefined,
  categories: t.categories ?? [],
  price: t.price ?? undefined,
  target: t.target ?? undefined,
  notes,
  done: !!t.done,
  goal: t.goal ?? undefined,
  planSteps: (t.plan_steps as PlanStep[]) ?? [],
  smallSteps: (t.small_steps as SmallStep[]) ?? [],
  planStatus: t.plan_status ?? "none",
  aiReport: t.ai_report ?? undefined,
  updatedAt: t.updated_at,
} as Tool & { updatedAt?: string });

const mapNote = (n: NoteRow): ToolNote => ({
  id: n.id,
  text: n.text,
  createdAt: (n.created_at ?? "").split("T")[0],
  done: !!n.done,
});

const mapIdea = (i: IdeaRow): Idea => ({
  id: i.id,
  name: i.name,
  description: i.description ?? "",
  notes: i.notes ?? "",
  createdAt: (i.created_at ?? "").split("T")[0],
});

const toToolPatch = (u: Partial<Tool>): Record<string, any> => {
  const m: Record<string, any> = {};
  if (u.name !== undefined) m.name = u.name;
  if (u.status !== undefined) m.status = u.status;
  if (u.description !== undefined) m.description = u.description;
  if (u.createdBy !== undefined) m.created_by = u.createdBy;
  if (u.createdMethod !== undefined) m.created_method = u.createdMethod;
  if (u.githubAccount !== undefined) m.github_account = u.githubAccount;
  if (u.deployMethod !== undefined) m.deploy_method = u.deployMethod;
  if (u.deployEmail !== undefined) m.deploy_email = u.deployEmail;
  if (u.releaseDate !== undefined) m.release_date = u.releaseDate;
  if (u.link !== undefined) m.link = u.link;
  if (u.version !== undefined) m.version = u.version;
  if (u.categories !== undefined) m.categories = u.categories;
  if (u.price !== undefined) m.price = u.price;
  if (u.target !== undefined) m.target = u.target;
  if (u.done !== undefined) m.done = u.done;
  if (u.goal !== undefined) m.goal = u.goal;
  if (u.planSteps !== undefined) m.plan_steps = u.planSteps;
  if (u.smallSteps !== undefined) m.small_steps = u.smallSteps;
  if (u.planStatus !== undefined) m.plan_status = u.planStatus;
  if (u.aiReport !== undefined) m.ai_report = u.aiReport;
  return m;
};

export function useToolStore() {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastEdit, setLastEdit] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [toolsRes, notesRes, ideasRes] = await Promise.all([
      supabase.from("tools").select("*").order("created_at", { ascending: true }),
      supabase.from("tool_notes").select("*").order("created_at", { ascending: true }),
      supabase.from("ideas").select("*").order("created_at", { ascending: true }),
    ]);
    const allNotes = (notesRes.data ?? []) as NoteRow[];
    const tlist = ((toolsRes.data ?? []) as ToolRow[]).map((t) =>
      mapTool(t, allNotes.filter((n) => n.tool_id === t.id).map(mapNote))
    );
    const ilist = ((ideasRes.data ?? []) as IdeaRow[]).map(mapIdea);
    setTools(tlist);
    setIdeas(ilist);
    const latest = [...(toolsRes.data ?? []), ...(ideasRes.data ?? []), ...(notesRes.data ?? [])]
      .map((r: any) => r.updated_at)
      .filter(Boolean)
      .sort()
      .pop();
    setLastEdit(latest ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchAll();
    else { setTools([]); setIdeas([]); setLoading(false); }
  }, [user, fetchAll]);

  const touch = () => setLastEdit(new Date().toISOString());

  // ===== Tools =====
  const addTool = useCallback(async (tool: Omit<Tool, "id" | "notes" | "done" | "planSteps" | "smallSteps" | "planStatus">) => {
    if (!user) return;
    const payload = { ...toToolPatch(tool as any), user_id: user.id };
    const { data, error } = await supabase.from("tools").insert(payload).select("*").single();
    if (error) { console.error(error); return; }
    setTools((p) => [...p, mapTool(data, [])]);
    touch();
  }, [user]);

  const updateTool = useCallback(async (id: string, updates: Partial<Tool>) => {
    const patch = toToolPatch(updates);
    const { data, error } = await supabase.from("tools").update(patch).eq("id", id).select("*").single();
    if (error) { console.error(error); return; }
    setTools((p) => p.map((t) => (t.id === id ? mapTool(data, t.notes) : t)));
    touch();
  }, []);

  const deleteTool = useCallback(async (id: string) => {
    const { error } = await supabase.from("tools").delete().eq("id", id);
    if (error) { console.error(error); return; }
    setTools((p) => p.filter((t) => t.id !== id));
    touch();
  }, []);

  const toggleToolDone = useCallback(async (id: string) => {
    const t = tools.find((x) => x.id === id);
    if (!t) return;
    await updateTool(id, { done: !t.done });
  }, [tools, updateTool]);

  // ===== Notes =====
  const addNote = useCallback(async (toolId: string, text: string) => {
    if (!user) return;
    const { data, error } = await supabase.from("tool_notes").insert({ tool_id: toolId, user_id: user.id, text }).select("*").single();
    if (error) { console.error(error); return; }
    setTools((p) => p.map((t) => (t.id === toolId ? { ...t, notes: [...t.notes, mapNote(data)] } : t)));
    touch();
  }, [user]);

  const deleteNote = useCallback(async (toolId: string, noteId: string) => {
    const { error } = await supabase.from("tool_notes").delete().eq("id", noteId);
    if (error) { console.error(error); return; }
    setTools((p) => p.map((t) => (t.id === toolId ? { ...t, notes: t.notes.filter((n) => n.id !== noteId) } : t)));
    touch();
  }, []);

  const editNote = useCallback(async (toolId: string, noteId: string, text: string) => {
    const { error } = await supabase.from("tool_notes").update({ text }).eq("id", noteId);
    if (error) { console.error(error); return; }
    setTools((p) => p.map((t) =>
      t.id === toolId ? { ...t, notes: t.notes.map((n) => (n.id === noteId ? { ...n, text } : n)) } : t
    ));
    touch();
  }, []);

  const toggleNote = useCallback(async (toolId: string, noteId: string) => {
    const tool = tools.find((t) => t.id === toolId);
    const note = tool?.notes.find((n) => n.id === noteId);
    if (!note) return;
    const { error } = await supabase.from("tool_notes").update({ done: !note.done }).eq("id", noteId);
    if (error) { console.error(error); return; }
    setTools((p) => p.map((t) =>
      t.id === toolId ? { ...t, notes: t.notes.map((n) => (n.id === noteId ? { ...n, done: !n.done } : n)) } : t
    ));
    touch();
  }, [tools]);

  // ===== Plan =====
  const setPlanSteps = useCallback((toolId: string, steps: PlanStep[]) => {
    return updateTool(toolId, { planSteps: steps, planStatus: "generated" });
  }, [updateTool]);

  const setSmallSteps = useCallback((toolId: string, steps: SmallStep[]) => {
    return updateTool(toolId, { smallSteps: steps, planStatus: "executing" });
  }, [updateTool]);

  const updateSmallStepWorkerNote = useCallback((toolId: string, stepId: string, workerNote: string) => {
    const t = tools.find((x) => x.id === toolId);
    if (!t) return;
    const next = t.smallSteps.map((s) => (s.id === stepId ? { ...s, workerNote } : s));
    return updateTool(toolId, { smallSteps: next });
  }, [tools, updateTool]);

  const toggleSmallStepDone = useCallback((toolId: string, stepId: string) => {
    const t = tools.find((x) => x.id === toolId);
    if (!t) return;
    const next = t.smallSteps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s));
    return updateTool(toolId, { smallSteps: next });
  }, [tools, updateTool]);

  const setAiReport = useCallback((toolId: string, report: string) => {
    return updateTool(toolId, { aiReport: report, planStatus: "reviewing" });
  }, [updateTool]);

  const setPlanStatus = useCallback((toolId: string, status: Tool["planStatus"]) => {
    return updateTool(toolId, { planStatus: status });
  }, [updateTool]);

  // ===== Ideas =====
  const addIdea = useCallback(async (idea: Omit<Idea, "id" | "createdAt">) => {
    if (!user) return;
    const { data, error } = await supabase.from("ideas").insert({
      user_id: user.id, name: idea.name, description: idea.description, notes: idea.notes,
    }).select("*").single();
    if (error) { console.error(error); return; }
    setIdeas((p) => [...p, mapIdea(data)]);
    touch();
  }, [user]);

  const updateIdea = useCallback(async (id: string, updates: Partial<Idea>) => {
    const { data, error } = await supabase.from("ideas").update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
    }).eq("id", id).select("*").single();
    if (error) { console.error(error); return; }
    setIdeas((p) => p.map((i) => (i.id === id ? mapIdea(data) : i)));
    touch();
  }, []);

  const deleteIdea = useCallback(async (id: string) => {
    const { error } = await supabase.from("ideas").delete().eq("id", id);
    if (error) { console.error(error); return; }
    setIdeas((p) => p.filter((i) => i.id !== id));
    touch();
  }, []);

  const moveIdeaToTool = useCallback(async (ideaId: string) => {
    if (!user) return;
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    const { data: tool, error } = await supabase.from("tools").insert({
      user_id: user.id,
      name: idea.name,
      status: "Draft",
      description: idea.description,
      created_by: "Gibikey Studio",
    }).select("*").single();
    if (error) { console.error(error); return; }
    let initialNotes: ToolNote[] = [];
    if (idea.notes) {
      const { data: n } = await supabase.from("tool_notes").insert({
        tool_id: tool.id, user_id: user.id, text: idea.notes,
      }).select("*").single();
      if (n) initialNotes = [mapNote(n)];
    }
    await supabase.from("ideas").delete().eq("id", ideaId);
    setTools((p) => [...p, mapTool(tool, initialNotes)]);
    setIdeas((p) => p.filter((i) => i.id !== ideaId));
    touch();
  }, [ideas, user]);

  const stats = {
    total: tools.length,
    live: tools.filter((t) => t.status === "Published").length,
    draft: tools.filter((t) => t.status === "Draft").length,
    idea: ideas.length,
  };

  return {
    tools, addTool, updateTool, deleteTool, toggleToolDone,
    addNote, deleteNote, toggleNote, editNote,
    setPlanSteps, setSmallSteps, updateSmallStepWorkerNote, toggleSmallStepDone, setAiReport, setPlanStatus,
    ideas, addIdea, updateIdea, deleteIdea, moveIdeaToTool,
    stats, loading, lastEdit,
  };
}
