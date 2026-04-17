import { useState, useEffect, useCallback } from "react";

const KEY = "gibikey_saved_emails";
const DEFAULTS = ["koleksigibi@gmail.com", "gibikey.studio@gmail.com"];

export function useSavedEmails() {
  const [emails, setEmails] = useState<string[]>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        const merged = Array.from(new Set([...DEFAULTS, ...parsed]));
        setEmails(merged);
      }
    } catch {}
  }, []);

  const addEmail = useCallback((email: string) => {
    const e = email.trim();
    if (!e) return;
    setEmails((prev) => {
      if (prev.includes(e)) return prev;
      const next = [...prev, e];
      try { localStorage.setItem(KEY, JSON.stringify(next.filter((x) => !DEFAULTS.includes(x)))); } catch {}
      return next;
    });
  }, []);

  return { emails, addEmail };
}
