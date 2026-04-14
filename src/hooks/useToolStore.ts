import { useState, useCallback } from "react";
import { Tool, ToolNote, ToolStatus } from "@/types/tool";

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialTools: Tool[] = [
  {
    id: "1",
    name: "NEW PECAH AI",
    status: "Pending",
    description: "https://atoms.dev/chat/26671f5ad7f141a0ad6kkappolo3",
    createdBy: "",
    createdMethod: "Manual Coding",
    notes: [
      { id: "n1", text: "Setup project structure", createdAt: "2026-04-10" },
      { id: "n2", text: "Design UI mockup", createdAt: "2026-04-11" },
      { id: "n3", text: "Implement API integration", createdAt: "2026-04-12" },
      { id: "n4", text: "Testing phase", createdAt: "2026-04-13" },
    ],
  },
  {
    id: "2",
    name: "PECAH AI",
    status: "Pending",
    description: "Pecah goal besar jadi langkah-langkah kecil yang bisa langsung dikerjakan.",
    createdBy: "",
    createdMethod: "Lovable",
    notes: [
      { id: "n5", text: "Initial concept", createdAt: "2026-04-09" },
      { id: "n6", text: "Prototype v1", createdAt: "2026-04-10" },
      { id: "n7", text: "User feedback", createdAt: "2026-04-12" },
    ],
  },
  {
    id: "3",
    name: "Tool Tracker",
    status: "Publish",
    description: "",
    createdBy: "koleksigibi@gmail.com",
    createdMethod: "Replit",
    deployMethod: "Replit",
    deployEmail: "koleksigibi@gmail.com",
    releaseDate: "13 Apr 2026",
    link: "data-grid-manager--koleksigibi.replit.app",
    version: "v6.1",
    notes: [],
  },
];

export function useToolStore() {
  const [tools, setTools] = useState<Tool[]>(initialTools);

  const addTool = useCallback((tool: Omit<Tool, "id" | "notes">) => {
    setTools((prev) => [...prev, { ...tool, id: generateId(), notes: [] }]);
  }, []);

  const updateTool = useCallback((id: string, updates: Partial<Tool>) => {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTool = useCallback((id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNote = useCallback((toolId: string, text: string) => {
    const note: ToolNote = { id: generateId(), text, createdAt: new Date().toISOString().split("T")[0] };
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

  const stats = {
    total: tools.length,
    live: tools.filter((t) => t.status === "Publish").length,
    idea: 0,
  };

  return { tools, addTool, updateTool, deleteTool, addNote, deleteNote, stats };
}
