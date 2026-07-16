"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav
      style={{
        height: "64px",
        backgroundColor: "var(--color-white)",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "var(--color-martini)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="12" cy="9" rx="5" ry="7" fill="#FFFFFF" opacity="0.9" />
            <circle cx="12" cy="9" r="2.5" fill="#0D9488" />
            <path d="M9 16 Q12 22 15 16" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-primary)",
            fontWeight: 700,
            fontSize: "1.15rem",
            color: "var(--color-moss)",
            letterSpacing: "-0.02em",
          }}
        >
          Press
          <span style={{ color: "var(--color-martini)", fontWeight: 600 }}>Point</span>
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <NavLink
            href="/painMapping" label="Pemetaan Nyeri" active={pathname === "/painMapping"} />
        <NavLink
          href="/training"
          label="Evaluasi Training"
          active={pathname === "/training"}
        />
      </div>
    </nav>
  );
}
function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        fontFamily: "var(--font-primary)",
        fontSize: "0.9rem",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--color-martini)" : "var(--color-moss-60)",
        backgroundColor: active ? "var(--color-sunflower)" : "transparent",
        textDecoration: "none",
        transition: "var(--transition-base)",
      }}
    >
      {label}
    </Link>
  );
}
