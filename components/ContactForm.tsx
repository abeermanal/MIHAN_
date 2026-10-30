"use client";

import { useState } from "react";

const topicOptions = [
  "دعم فني",
  "استفسار عام",
  "شراكات",
  "اقتراح تحسين",
];

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(topicOptions[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "ready" | "copied">("idle");

  const body = [
    `الاسم: ${name || "—"}`,
    `البريد: ${email || "—"}`,
    `الموضوع: ${topic}`,
    "",
    message,
  ].join("\n");

  const canSubmit = name.trim().length > 1 && email.includes("@") && message.trim().length > 9;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    if (contactEmail) {
      const subject = encodeURIComponent(`[مِهَن] ${topic}`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;
      setStatus("ready");
      return;
    }

    setStatus("ready");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(body);
      setStatus("copied");
    } catch {
      setStatus("ready");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-extrabold" style={{ color: "var(--heading)" }}>
        أرسلي رسالتك
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
            الاسم
          </span>
          <input
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="اسمك"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
            البريد الإلكتروني
          </span>
          <input
            className="input"
            type="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
          موضوع الرسالة
        </span>
        <select
          className="input"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        >
          {topicOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
          الرسالة
        </span>
        <textarea
          className="input min-h-[150px]"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="اكتبي تفاصيل استفسارك هنا..."
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" className="btn-primary px-6 py-2.5 text-sm" disabled={!canSubmit}>
          إرسال الرسالة
        </button>
        <button type="button" onClick={handleCopy} className="btn-outline px-6 py-2.5 text-sm">
          نسخ النص
        </button>
      </div>

      {status === "ready" && (
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          {contactEmail
            ? "فتحنا برنامج البريد لديك. إن لم تُفتح النافذة، استخدمي زر نسخ النص."
            : "لم يُضف بريد الموقع الرسمي بعد. انسخي النص وأرسليه لنا عبر البريد الذي تختارينه."}
        </p>
      )}

      {status === "copied" && (
        <p className="text-xs font-bold" style={{ color: "var(--link)" }}>
          تم نسخ النص إلى الحافظة.
        </p>
      )}
    </form>
  );
}