import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Auth() {
  const { user, loading, signIn, signUp, resendVerification } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) nav("/", { replace: true });
  }, [user, loading, nav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    setSubmitting(true);
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error);
      else toast.success("Selamat datang kembali!");
    } else {
      const { error, needsVerify } = await signUp(email, password);
      if (error) toast.error(error);
      else if (needsVerify) {
        setPendingEmail(email);
        toast.success("Cek email kamu untuk verifikasi");
      } else {
        toast.success("Akun dibuat!");
      }
    }
    setSubmitting(false);
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    const { error } = await resendVerification(pendingEmail);
    if (error) toast.error(error);
    else toast.success("Email verifikasi dikirim ulang");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src={logo} alt="Gibikey Studio" className="w-16 h-16 rounded-2xl object-contain drop-shadow-lg" />
          <div className="text-center">
            <p className="text-primary text-[10px] font-bold tracking-[0.2em]">GIBIKEY STUDIO</p>
            <h1 className="text-2xl font-bold">Tool Tracker</h1>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-elevated">
          <div className="flex gap-2 mb-5 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === "signin" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === "signup" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              Daftar
            </button>
          </div>

          {pendingEmail ? (
            <div className="text-center py-4 space-y-3">
              <Mail size={40} className="mx-auto text-primary" />
              <h2 className="font-semibold">Verifikasi email kamu</h2>
              <p className="text-sm text-muted-foreground">
                Link verifikasi telah dikirim ke<br />
                <span className="font-medium text-foreground">{pendingEmail}</span>
              </p>
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
              >
                Kirim ulang email verifikasi
              </button>
              <div>
                <button
                  onClick={() => { setPendingEmail(null); setMode("signin"); }}
                  className="text-xs text-muted-foreground hover:text-foreground mt-2"
                >
                  Kembali ke login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 karakter)"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm shadow-card hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {mode === "signin" ? "Masuk" : "Daftar & Verifikasi Email"}
              </button>
              {mode === "signup" && (
                <p className="text-xs text-muted-foreground text-center">
                  Setelah daftar, kamu akan menerima email berisi link verifikasi.
                </p>
              )}
            </form>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          © Gibikey Studio · Tool Tracker
        </p>
      </div>
    </div>
  );
}
