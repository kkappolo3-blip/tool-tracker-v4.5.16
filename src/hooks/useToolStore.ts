import { useState, useCallback } from "react";
import { Tool, ToolNote, Idea, PlanStep, SmallStep } from "@/types/tool";

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialTools: Tool[] = [
  {
    id: "1",
    name: "NEW PECAH AI",
    status: "Draft",
    description: "https://atoms.dev/chat/26671f5ad7f141a0ad6kkappolo3",
    createdBy: "koleksigibi@gmail.com",
    createdMethod: "Atoms",
    categories: [],
    notes: [
      { id: "n1", text: "Setup project structure", createdAt: "2026-04-10", done: true },
      { id: "n2", text: "Design UI mockup", createdAt: "2026-04-11", done: true },
      { id: "n3", text: "Implement API integration", createdAt: "2026-04-12", done: false },
      { id: "n4", text: "Testing phase", createdAt: "2026-04-13", done: false },
    ],
    done: false,
    goal: "Membuat AI yang bisa memecah goal besar menjadi langkah kecil",
    planSteps: [],
    smallSteps: [],
    planStatus: "none",
  },
  {
    id: "2",
    name: "PECAH AI",
    status: "Draft",
    description: "Pecah goal besar jadi langkah-langkah kecil yang bisa langsung dikerjakan.",
    createdBy: "koleksigibi@gmail.com",
    createdMethod: "Lovable",
    categories: [],
    notes: [
      { id: "n5", text: "Initial concept", createdAt: "2026-04-09", done: true },
      { id: "n6", text: "Prototype v1", createdAt: "2026-04-10", done: false },
      { id: "n7", text: "User feedback", createdAt: "2026-04-12", done: false },
    ],
    done: false,
    planSteps: [],
    smallSteps: [],
    planStatus: "none",
  },
  {
    id: "3",
    name: "Tool Tracker",
    status: "Published",
    description: "Dashboard untuk tracking semua tool yang dibuat",
    createdBy: "koleksigibi@gmail.com",
    createdMethod: "Replit",
    deployMethod: "Replit",
    deployEmail: "koleksigibi@gmail.com",
    releaseDate: "13 Apr 2026",
    link: "data-grid-manager--koleksigibi.replit.app",
    version: "v6.1",
    categories: ["Internal"],
    notes: [],
    done: true,
    planSteps: [],
    smallSteps: [],
    planStatus: "done",
  },
];

const initialIdeas: Idea[] = [
  {
    id: "i1",
    name: "AI Resume Builder",
    description: "Tool untuk generate resume dari LinkedIn profile",
    notes: "Bisa pakai Lovable + OpenAI API",
    createdAt: "2026-04-12",
  },
];

export function useToolStore() {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [loading, setLoading] = useState(true);

  useState(() => {
    setTimeout(() => setLoading(false), 800);
  });

  const addTool = useCallback((tool: Omit<Tool, "id" | "notes" | "done" | "planSteps" | "smallSteps" | "planStatus">) => {
    setTools((prev) => [...prev, { ...tool, id: generateId(), notes: [], done: false, planSteps: [], smallSteps: [], planStatus: "none" }]);
  }, []);

  const updateTool = useCallback((id: string, updates: Partial<Tool>) => {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTool = useCallback((id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleToolDone = useCallback((id: string) => {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const addNote = useCallback((toolId: string, text: string) => {
    const note: ToolNote = { id: generateId(), text, createdAt: new Date().toISOString().split("T")[0], done: false };
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, notes: [...t.notes, note] } : t))
    );
  }, []);

  const deleteNote = useCallback((toolId: string, noteId: string) => {
    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId ? { ...t, notes: t.notes.filter((n) => n.id !== noteId) } : t
      )
    );
  }, []);

  const toggleNote = useCallback((toolId: string, noteId: string) => {
    setTools((prev) =>
      prev.map((t) =>
        t.id === toolId
          ? { ...t, notes: t.notes.map((n) => (n.id === noteId ? { ...n, done: !n.done } : n)) }
          : t
      )
    );
  }, []);

  // Plan management
  const setPlanSteps = useCallback((toolId: string, steps: PlanStep[]) => {
    setTools((prev) => prev.map((t) => (t.id === toolId ? { ...t, planSteps: steps, planStatus: "generated" } : t)));
  }, []);

  const setSmallSteps = useCallback((toolId: string, steps: SmallStep[]) => {
    setTools((prev) => prev.map((t) => (t.id === toolId ? { ...t, smallSteps: steps, planStatus: "executing" } : t)));
  }, []);

  const updateSmallStepWorkerNote = useCallback((toolId: string, stepId: string, workerNote: string) => {
    setTools((prev) => prev.map((t) => (
      t.id === toolId
        ? { ...t, smallSteps: t.smallSteps.map((s) => (s.id === stepId ? { ...s, workerNote } : s)) }
        : t
    )));
  }, []);

  const toggleSmallStepDone = useCallback((toolId: string, stepId: string) => {
    setTools((prev) => prev.map((t) => (
      t.id === toolId
        ? { ...t, smallSteps: t.smallSteps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)) }
        : t
    )));
  }, []);

  const setAiReport = useCallback((toolId: string, report: string) => {
    setTools((prev) => prev.map((t) => (t.id === toolId ? { ...t, aiReport: report, planStatus: "reviewing" } : t)));
  }, []);

  const setPlanStatus = useCallback((toolId: string, status: Tool["planStatus"]) => {
    setTools((prev) => prev.map((t) => (t.id === toolId ? { ...t, planStatus: status } : t)));
  }, []);

  // Ideas
  const addIdea = useCallback((idea: Omit<Idea, "id" | "createdAt">) => {
    setIdeas((prev) => [...prev, { ...idea, id: generateId(), createdAt: new Date().toISOString().split("T")[0] }]);
  }, []);

  const updateIdea = useCallback((id: string, updates: Partial<Idea>) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const moveIdeaToTool = useCallback((ideaId: string) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    const newTool: Tool = {
      id: generateId(),
      name: idea.name,
      status: "Draft",
      description: idea.description,
      createdBy: "Gibikey Studio",
      createdMethod: "",
      categories: [],
      notes: idea.notes ? [{ id: generateId(), text: idea.notes, createdAt: idea.createdAt, done: false }] : [],
      done: false,
      planSteps: [],
      smallSteps: [],
      planStatus: "none",
    };
    setTools((prev) => [...prev, newTool]);
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
  }, [ideas]);

  const stats = {
    total: tools.length,
    live: tools.filter((t) => t.status === "Published").length,
    draft: tools.filter((t) => t.status === "Draft").length,
    idea: ideas.length,
  };

  return {
    tools, addTool, updateTool, deleteTool, toggleToolDone,
    addNote, deleteNote, toggleNote,
    setPlanSteps, setSmallSteps, updateSmallStepWorkerNote, toggleSmallStepDone, setAiReport, setPlanStatus,
    ideas, addIdea, updateIdea, deleteIdea, moveIdeaToTool,
    stats, loading,
  };
}
