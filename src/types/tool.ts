export type ToolStatus = "Published" | "Draft";

export type ToolCategory = "Dijual" | "Internal" | "Polri";

export interface ToolNote {
  id: string;
  text: string;
  createdAt: string;
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
}

export interface Idea {
  id: string;
  name: string;
  description: string;
  notes: string;
  createdAt: string;
}
