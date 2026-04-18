import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Kind = "email" | "platform" | "github" | "deploy";

const PLATFORM_DEFAULTS = ["Lovable", "Replit", "Atoms", "Canvas Gemini", "GPT Codex", "Z.ai", "Manual Coding"];
const GITHUB_DEFAULTS = ["gibikey", "koleksigibi"];
const EMAIL_DEFAULTS: string[] = [];
const DEPLOY_DEFAULTS = PLATFORM_DEFAULTS;

function useSavedKind(kind: Kind, defaults: string[]) {
  const { user } = useAuth();
  const [items, setItems] = useState<string[]>(defaults);

  const load = useCallback(async () => {
    if (!user) { setItems(defaults); return; }
    const { data } = await supabase.from("saved_options").select("value").eq("kind", kind);
    const stored = (data ?? []).map((r: any) => r.value as string);
    setItems(Array.from(new Set([...defaults, ...stored])));
  }, [user, kind, defaults]);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (value: string) => {
    const v = value.trim();
    if (!v || !user) return;
    setItems((prev) => (prev.includes(v) ? prev : [...prev, v]));
    if (defaults.includes(v)) return;
    await supabase.from("saved_options").insert({ user_id: user.id, kind, value: v }).select();
  }, [user, kind, defaults]);

  return { items, add };
}

export function useSavedEmails() {
  const { items, add } = useSavedKind("email", EMAIL_DEFAULTS);
  return { emails: items, addEmail: add };
}
export function useSavedPlatforms() {
  const { items, add } = useSavedKind("platform", PLATFORM_DEFAULTS);
  return { platforms: items, addPlatform: add };
}
export function useSavedGithubAccounts() {
  const { items, add } = useSavedKind("github", GITHUB_DEFAULTS);
  return { githubAccounts: items, addGithubAccount: add };
}
export function useSavedDeployPlatforms() {
  const { items, add } = useSavedKind("deploy", DEPLOY_DEFAULTS);
  return { deployPlatforms: items, addDeployPlatform: add };
}
