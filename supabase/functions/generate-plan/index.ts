import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, toolName, goal, planSteps, workerNotes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate_plan") {
      systemPrompt = `Kamu adalah asisten perencanaan pembuatan tool/aplikasi. Tugasmu adalah membuat alur/langkah-langkah pembuatan tool berdasarkan goal yang diberikan user. 

ATURAN PENTING:
- Gunakan bahasa Indonesia yang jelas dan mudah dipahami
- JANGAN gunakan istilah teknis pemrograman atau bahasa kode
- JANGAN gunakan perumpamaan atau analogi
- Tulis langkah-langkah yang konkret dan bisa langsung dikerjakan
- Setiap langkah harus jelas apa yang harus dilakukan
- Berikan 4-8 langkah utama
- Format: satu langkah per baris, diawali dengan nomor (1. 2. 3. dst)`;
      
      userPrompt = `Tool yang akan dibuat: "${toolName}"
Goal: "${goal}"

Buatkan alur langkah-langkah pembuatan tool ini:`;
    
    } else if (action === "break_steps") {
      systemPrompt = `Kamu adalah asisten yang memecah langkah besar menjadi instruksi kecil yang bisa langsung di-copy paste ke platform pembuat aplikasi (seperti Lovable, Replit, dll).

ATURAN:
- Bahasa Indonesia yang jelas
- Setiap instruksi kecil harus bisa langsung di-copy dan di-paste ke worker/platform pembuat aplikasi
- Instruksi harus detail dan spesifik sehingga worker bisa langsung mengerjakan
- Pisahkan setiap langkah besar menjadi 2-4 instruksi kecil
- Format setiap instruksi: mulai dengan "LANGKAH [nomor parent].[nomor sub]: " diikuti instruksi
- Setiap instruksi di baris baru`;

      userPrompt = `Tool: "${toolName}"
Goal: "${goal}"

Langkah-langkah besar:
${planSteps.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}

Pecah setiap langkah besar menjadi instruksi kecil yang bisa langsung dikerjakan oleh worker:`;

    } else if (action === "analyze_worker") {
      systemPrompt = `Kamu adalah asisten analisis yang mengevaluasi laporan dari worker/platform pembuat aplikasi. 

ATURAN:
- Bahasa Indonesia
- Analisa apakah semua langkah sudah dikerjakan dengan benar
- Berikan ringkasan apa saja yang sudah selesai
- Jika ada yang kurang atau perlu diperbaiki, sebutkan dengan jelas
- Berikan rekomendasi langkah selanjutnya
- Format laporan yang rapi dan mudah dibaca`;

      userPrompt = `Tool: "${toolName}"
Goal: "${goal}"

Catatan dari worker untuk setiap langkah:
${workerNotes.map((n: { step: string; note: string }, i: number) => `--- Langkah ${i + 1}: ${n.step}\nLaporan Worker: ${n.note || "(belum ada laporan)"}`).join("\n\n")}

Analisa semua laporan worker di atas dan buat laporan lengkap:`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Coba lagi nanti." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit habis. Tambahkan kredit di Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
