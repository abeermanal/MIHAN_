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
    <div className="mx-auto flex h-[calc(100vh-13rem)] max-w-3xl flex-col space-y-4">
      <header>
        <h1 className="section-title">المدربة الذكية 🤖</h1>
        <p className="mt-1 text-plum-600">
          نصائح مخصصة بناءً على ملفك المهني ومهاراتك.
        </p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-plum-100 bg-white p-4 shadow-card">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm bg-gold-100 text-plum-900"
                  : "rounded-bl-sm bg-plum-600 text-white"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-end">
            <div className="rounded-2xl rounded-bl-sm bg-plum-300 px-4 py-3 text-sm text-white">
              تكتب…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={sending}
            className="rounded-full border border-plum-200 bg-white px-3 py-1.5 text-xs font-bold text-plum-600 transition hover:border-plum-400 hover:text-plum-800 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2"
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
