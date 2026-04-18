export type ToolStatus = "Published" | "Draft";

export type ToolCategory = "Dijual" | "Internal" | "Polri";

export interface ToolNote {
  id: string;
  text: string;
  createdAt: string;
  done: boolean;
}

export interface PlanStep {
  id: string;
  text: string;
  done: boolean;
}

export interface SmallStep {
  id: string;
  parentStepId: string;
  text: string;
  workerNote: string;
  done: boolean;
}

export interface Tool {
  id: string;
  name: string;
  status: ToolStatus;
  description: string;
  createdBy: string;
  createdMethod: string;
  githubAccount?: string;
  deployMethod?: string;
  deployEmail?: string;
  releaseDate?: string;
  link?: string;
  version?: string;
  categories: ToolCategory[];
  price?: string;
  target?: string;
  notes: ToolNote[];
  done: boolean;
  goal?: string;
  planSteps: PlanStep[];
  smallSteps: SmallStep[];
  planStatus?: "none" | "generated" | "executing" | "reviewing" | "done";
  aiReport?: string;
  updatedAt?: string;
}

export interface Idea {
  id: string;
  name: string;
  description: string;
  notes: string;
  createdAt: string;
}
