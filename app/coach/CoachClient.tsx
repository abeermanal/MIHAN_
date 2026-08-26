"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "ما المجال المناسب لي؟",
  "كيف أبدأ تعلم تحليل البيانات؟",
  "نصائح لسيرتي الذاتية",
  "كيف أستعد للمقابلة؟",
];

export default function CoachClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "أهلاً بك في المدربة الذكية 💜\nأنا هنا لأساعدك في مسارك المهني — اسأليني عن المجال المناسب لك، أو كيف تبدئين التعلم، أو نصائح للسيرة الذاتية والمقابلات.",
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setSending(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "عذراً، حدث خطأ — حاولي مجدداً.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "تعذر الاتصال بالخادم — حاولي مجدداً." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-13rem)] max-w-3xl flex-col gap-4">
      {/* Gradient header */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-l from-royal-600 via-royal-500 to-coral-400 px-5 py-4 text-white shadow-soft">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-sm font-extrabold text-white shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-extrabold">المدربة الذكية</h1>
          <p className="text-xs text-white/70">نصائح مخصصة بناءً على ملفك المهني ومهاراتك</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-lavender-100/60 bg-white p-4 shadow-card">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-start" : "justify-end"}`}
          >
            {m.role === "assistant" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-royal-500 to-coral-400 text-xs font-extrabold text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm bg-lavender-50 text-navy-800"
                  : "rounded-bl-sm gradient-primary text-white"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {sending && (
          <div className="flex justify-end gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-royal-500 to-coral-400 text-xs font-extrabold text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-gradient-to-br from-royal-400 to-royal-500 px-4 py-3 text-sm text-white">
              <span className="animate-pulse">جارٍ الكتابة</span>
              <span className="flex gap-0.5">
                <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-white" style={{ animationDelay: "0ms" }} />
                <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-white" style={{ animationDelay: "150ms" }} />
                <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-white" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion pills */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={sending}
            className="rounded-full border border-lavender-200 bg-white px-4 py-2 text-xs font-bold text-royal-600 transition-all duration-200 hover:border-royal-300 hover:bg-lavender-50 hover:text-navy-800 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2"
      >
        <input
          className="input flex-1"
          placeholder="اكتبي سؤالك هنا…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button type="submit" className="btn-primary" disabled={sending || !input.trim()}>
          إرسال
        </button>
      </form>
    </div>
  );
}
