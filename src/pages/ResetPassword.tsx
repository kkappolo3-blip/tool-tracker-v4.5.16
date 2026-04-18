import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase recovery sets a session via hash; wait briefly then mark ready
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password minimal 6 karakter");
    if (password !== confirm) return toast.error("Konfirmasi password tidak cocok");
    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);
    if (error) return toast.error(error);
    toast.success("Password berhasil diubah");
    nav("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src={logo} alt="Gibikey Studio" className="w-16 h-16 rounded-2xl object-contain drop-shadow-lg" />
          <div className="text-center">
            <p className="text-primary text-[10px] font-bold tracking-[0.2em]">GIBIKEY STUDIO</p>
            <h1 className="text-2xl font-bold">Reset Password</h1>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-elevated">
          {!ready ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">Masukkan password baru kamu.</p>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password baru"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Konfirmasi password"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm shadow-card hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Simpan Password Baru
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
