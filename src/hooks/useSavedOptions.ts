import { useState, useEffect, useCallback } from "react";

function useSavedList(key: string, defaults: string[]) {
  const [items, setItems] = useState<string[]>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        setItems(Array.from(new Set([...defaults, ...parsed])));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const add = useCallback((value: string) => {
    const v = value.trim();
    if (!v) return;
    setItems((prev) => {
      if (prev.includes(v)) return prev;
      const next = [...prev, v];
      try {
        localStorage.setItem(key, JSON.stringify(next.filter((x) => !defaults.includes(x))));
      } catch {}
      return next;
    });
  }, [key, defaults]);

  return { items, add };
}

const PLATFORM_DEFAULTS = ["Lovable", "Replit", "Atoms", "Canvas Gemini", "GPT Codex", "Z.ai", "Manual Coding"];
const GITHUB_DEFAULTS = ["gibikey", "koleksigibi"];

export function useSavedPlatforms() {
  const { items, add } = useSavedList("gibikey_saved_platforms", PLATFORM_DEFAULTS);
  return { platforms: items, addPlatform: add };
}

export function useSavedGithubAccounts() {
  const { items, add } = useSavedList("gibikey_saved_github", GITHUB_DEFAULTS);
  return { githubAccounts: items, addGithubAccount: add };
}

export function useSavedDeployPlatforms() {
  const { items, add } = useSavedList("gibikey_saved_deploy_platforms", PLATFORM_DEFAULTS);
  return { deployPlatforms: items, addDeployPlatform: add };
}
