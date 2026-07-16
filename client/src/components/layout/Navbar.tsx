"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav
      style={{
        height: "64px",
        backgroundColor: "var(--color-moss)",
        borderBottom: "3px solid var(--color-martini)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 16px rgba(68,67,5,0.25)",
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
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "var(--color-martini)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 0 3px rgba(242,236,155,0.25)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="12" cy="9" rx="5" ry="7" fill="#F2EC9B" opacity="0.85" />
            <circle cx="12" cy="9" r="2.5" fill="#444305" />
            <path d="M9 16 Q12 22 15 16" stroke="#F2EC9B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-primary)",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "var(--color-sunflower)",
            letterSpacing: "-0.02em",
          }}
        >
          Press
          <span style={{ color: "var(--color-linen)", fontWeight: 400 }}>Point</span>
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <NavLink href="/" label="Pemetaan Nyeri" active={pathname === "/"} />
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
        color: active ? "var(--color-sunflower)" : "var(--color-linen)",
        backgroundColor: active ? "rgba(242,236,155,0.12)" : "transparent",
        textDecoration: "none",
        transition: "var(--transition-base)",
        borderBottom: active ? "2px solid var(--color-martini)" : "2px solid transparent",
      }}
    >
      {label}
    </Link>
  );
}
