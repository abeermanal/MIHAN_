import Link from "next/link";
import { useId } from "react";

interface LogoProps {
  size?: number;
  href?: string;
  variant?: "default" | "inverse";
  showText?: boolean;
  className?: string;
}

/**
 * مِهَن | MIHAN — Premium geometric logo combining an abstract "M"
 * (skill/career) with an upward growth path and a gold spark of insight.
 */
export default function Logo({
  size = 36,
  href,
  variant = "default",
  showText = true,
  className = "",
}: LogoProps) {
  const uid = useId().replace(/[:]/g, "");
  const inverse = variant === "inverse";

  const tealGradId = `mihan-teal-${uid}`;
  const goldGradId = `mihan-gold-${uid}`;

  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="مِهَن MIHAN"
      className="shrink-0"
    >
      <defs>
        <linearGradient
          id={tealGradId}
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1A8A8A" />
          <stop offset="45%" stopColor="#0D5555" />
          <stop offset="100%" stopColor="#0A1F1F" />
        </linearGradient>
        <linearGradient
          id={goldGradId}
          x1="10"
          y1="38"
          x2="38"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#E3C87F" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#B8963E" />
        </linearGradient>
      </defs>

      {inverse ? (
        <g>
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="12"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
          <path
            d="M12 35 L12 16 L24 28 L36 16 L36 35"
            stroke={`url(#${goldGradId})`}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M24 28 L24 7"
            stroke={`url(#${goldGradId})`}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="24" cy="4.5" r="2" fill="#EDD9A0" />
        </g>
      ) : (
        <g>
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="13"
            fill={`url(#${tealGradId})`}
          />
          <rect
            x="6.5"
            y="6.5"
            width="35"
            height="35"
            rx="9"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.8"
          />
          <path
            d="M12 35 L12 16 L24 28 L36 16 L36 35"
            stroke={`url(#${goldGradId})`}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M24 28 L24 7"
            stroke={`url(#${goldGradId})`}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="24" cy="4.5" r="2" fill="#E8CF8A" />
        </g>
      )}
    </svg>
  );

  const wordmark = (
    <span className="flex flex-col leading-none">
      <span
        className="font-sans font-extrabold"
        style={{
          color: inverse ? "#FFFFFF" : "var(--heading)",
          fontSize: Math.round(size * 0.62),
          lineHeight: 1.15,
        }}
      >
        مِهَن
      </span>
      <span
        className="font-sans font-bold"
        dir="ltr"
        style={{
          color: inverse ? "#E3C87F" : "var(--brand-mark)",
          fontSize: Math.round(size * 0.3),
          letterSpacing: "0.28em",
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        MIHAN
      </span>
    </span>
  );

  const inner = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {icon}
      {showText && wordmark}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex shrink-0 items-center"
        aria-label="مِهَن MIHAN — الرئيسية"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
