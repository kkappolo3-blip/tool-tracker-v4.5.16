export type ToolStatus = "Pending" | "Publish";

export interface ToolNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Tool {
  id: string;
  name: string;
  status: ToolStatus;
  description: string;
  createdBy: string;
  createdMethod: string;
  deployMethod?: string;
  deployEmail?: string;
  releaseDate?: string;
  link?: string;
  version?: string;
  notes: ToolNote[];
}
