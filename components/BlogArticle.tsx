import Link from "next/link";
import type { BlogPost } from "@/data/blog-posts";

type Block =
  | { kind: "h2" | "h3" | "p" | "quote"; text: string }
  | { kind: "ul" | "ol"; items: string[] };

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ kind: "p", text });
    paragraph = [];
  };

  const flushList = () => {
    if (list && list.items.length) {
      blocks.push({ kind: list.kind, items: list.items });
    }
    list = null;
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      flushAll();
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushAll();
      blocks.push({
        kind: heading[1].length === 2 ? "h2" : "h3",
        text: heading[2].trim(),
      });
      continue;
    }

    if (line.startsWith(">")) {
      flushAll();
      blocks.push({ kind: "quote", text: line.replace(/^>\s?/, "").trim() });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      flushParagraph();
      if (!list || list.kind !== "ul") {
        flushList();
        list = { kind: "ul", items: [] };
      }
      list.items.push(bullet[1].trim());
      continue;
    }

    const ordered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ordered) {
      flushParagraph();
      if (!list || list.kind !== "ol") {
        flushList();
        list = { kind: "ol", items: [] };
      }
      list.items.push(ordered[1].trim());
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushAll();
  return blocks;
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b${index}`} style={{ color: "var(--heading)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-t${index}`}>{part}</span>;
  });
}

function headingId(text: string, index: number) {
  const slug = text
    .replace(/[\s،؛؟.,!]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug ? `${slug}-${index}` : `section-${index}`;
}

export default function BlogArticle({ post }: { post: BlogPost }) {
  const blocks = parseBlocks(post.content);

  return (
    <article className="space-y-6">
      {blocks.map((block, index) => {
        if (block.kind === "h2") {
          return (
            <h2
              key={index}
              id={headingId(block.text, index)}
              className="scroll-mt-24 pt-2 text-xl font-extrabold md:text-2xl"
              style={{ color: "var(--heading)" }}
            >
              {block.text}
            </h2>
          );
        }

        if (block.kind === "h3") {
          return (
            <h3
              key={index}
              id={headingId(block.text, index)}
              className="scroll-mt-24 pt-1 text-lg font-bold md:text-xl"
              style={{ color: "var(--accent)" }}
            >
              {block.text}
            </h3>
          );
        }

        if (block.kind === "ul" || block.kind === "ol") {
          const ListTag = block.kind === "ul" ? "ul" : "ol";
          return (
            <ListTag
              key={index}
              className={
                block.kind === "ul"
                  ? "space-y-2.5 pr-6"
                  : "space-y-2.5 pr-6 list-decimal"
              }
              style={{ color: "var(--text-secondary)" }}
            >
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className={
                    block.kind === "ul" ? "relative leading-relaxed" : "leading-relaxed"
                  }
                >
                  {block.kind === "ul" && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-5 top-2.5 h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                  {renderInline(item, `${index}-${itemIndex}`)}
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.kind === "quote") {
          return (
            <blockquote
              key={index}
              className="rounded-2xl px-5 py-4 leading-relaxed"
              style={{
                background: "var(--accent-subtle)",
                borderInlineStart: "3px solid var(--accent)",
                color: "var(--text)",
              }}
            >
              {renderInline(block.text, `q${index}`)}
            </blockquote>
          );
        }

        if (block.kind !== "p") return null;

        return (
          <p
            key={index}
            className="text-base leading-loose md:text-[17px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {renderInline(block.text, `p${index}`)}
          </p>
        );
      })}

      <div
        className="mt-10 rounded-2xl p-6 text-center"
        style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
      >
        <p className="mb-4 font-bold" style={{ color: "var(--heading)" }}>
          جاهزة لبناء مسارك المهني؟
        </p>
        <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
          اكتشف مهاراتك مجاناً عبر اختبار مِهَن، واحصلي على خطة تتناسب مع وقتك.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/assessment" className="btn-primary px-6 py-2.5 text-sm">
            ابدئي اختبار المهارات
          </Link>
          <Link href="/blog" className="btn-outline px-6 py-2.5 text-sm">
            مقالات أخرى
          </Link>
        </div>
      </div>
    </article>
  );
}