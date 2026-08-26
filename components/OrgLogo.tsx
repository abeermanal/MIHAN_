interface Props {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "lg";
}

const sizes = {
  sm: { box: "h-8 w-8 text-sm", img: "h-8 w-8" },
  lg: { box: "h-14 w-14 text-xl", img: "h-14 w-14" },
};

/** شعار الجهة أو حرفها الأول كبديل أنيق */
export default function OrgLogo({ name, logoUrl, size = "sm" }: Props) {
  const s = sizes[size];
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`شعار ${name}`}
        className={`${s.img} shrink-0 rounded-lg border border-royal-100 bg-white object-contain p-0.5`}
      />
    );
  }
  return (
    <span
      className={`grid ${s.box} shrink-0 place-items-center rounded-lg bg-royal-600 font-extrabold text-coral-300`}
    >
      {name.trim().charAt(0) || "؟"}
    </span>
  );
}
