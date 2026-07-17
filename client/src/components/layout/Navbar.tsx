"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Image from 'next/image'

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isLandingPage = pathname === "/";
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    const handleLogout = () => {
        logout();
        router.push("/");
        setShowUserMenu(false);
    };

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
                        width: "64px",
                        height: "64px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Image src="/logo.png" alt="Logo" width={48} height={48} />
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

            {/* Menu Container */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
                {/* Dashboard Link (authenticated only) */}
                {isAuthenticated && !isAuthPage && (
                    <NavLink
                        href={user?.role === "CLIENT" ? "/dashboard/client" : "/dashboard/therapist"}
                        label="Dashboard"
                        active={pathname.includes("/dashboard")}
                    />
                )}

                {/* Unauthenticated - Show Login/Signup buttons */}
                {!isAuthenticated && isLandingPage && (
                    <>
                        <Link
                            href="/login"
                            style={{
                                padding: "0.5rem 1.25rem",
                                borderRadius: "9999px",
                                border: "1.5px solid var(--color-moss)",
                                backgroundColor: "transparent",
                                fontFamily: "var(--font-primary)",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                color: "var(--color-moss)",
                                cursor: "pointer",
                                textDecoration: "none",
                                display: "inline-block",
                            }}
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/signup"
                            style={{
                                padding: "0.5rem 1.25rem",
                                borderRadius: "9999px",
                                backgroundColor: "var(--color-martini)",
                                fontFamily: "var(--font-primary)",
                                fontSize: "0.95rem",
                                fontWeight: 700,
                                color: "#FFFFFF",
                                cursor: "pointer",
                                textDecoration: "none",
                                display: "inline-block",
                            }}
                        >
                            Daftar
                        </Link>
                    </>
                )}

                {/* Authenticated */}
                {isAuthenticated && (
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "9999px",
                                backgroundColor: "var(--color-sunflower)",
                                border: "none",
                                fontFamily: "var(--font-primary)",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                color: "var(--color-moss)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <span>👤 {user?.fullName || "Pengguna"}</span>
                            <span style={{ fontSize: "0.75rem" }}>▼</span>
                        </button>

                        {showUserMenu && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    marginTop: "0.5rem",
                                    backgroundColor: "white",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    minWidth: "200px",
                                    zIndex: 1000,
                                }}
                            >
                                <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #E5E7EB" }}>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: "0 0 0.25rem 0", color: "#111827" }}>
                                        {user?.fullName}
                                    </p>
                                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                                        {user?.role === "CLIENT" ? "Klien" : "Terapis"}
                                    </p>
                                </div>

                                <Link
                                    href={user?.role === "CLIENT" ? "/dashboard/client" : "/dashboard/therapist"}
                                    style={{
                                        display: "block",
                                        padding: "0.75rem 1rem",
                                        color: "#111827",
                                        textDecoration: "none",
                                        fontSize: "0.9rem",
                                        borderBottom: "1px solid #E5E7EB",
                                    }}
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem 1rem",
                                        textAlign: "left",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "#DC2626",
                                        fontSize: "0.9rem",
                                        cursor: "pointer",
                                        fontFamily: "var(--font-primary)",
                                        fontWeight: 500,
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
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