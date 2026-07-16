"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<"pasien" | "therapist" | null>(null);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");

  const openModal = (role: "pasien" | "therapist") => {
    setLoginRole(role);
    setModalMode("login");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoginRole(null);
    setModalMode("login");
  };

  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<{ role: "pasien" | "therapist" }>;
      if (customEvent.detail && customEvent.detail.role) {
        openModal(customEvent.detail.role);
      }
    };

    window.addEventListener("openLoginModal", handleOpenModal);
    return () => window.removeEventListener("openLoginModal", handleOpenModal);
  }, []);
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
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={() => openModal("pasien")}
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
          }}
        >
          Login Sebagai Pasien
        </button>
        <button
          onClick={() => openModal("therapist")}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: "9999px",
            border: "1.5px solid #6366F1",
            backgroundColor: "#6366F1",
            fontFamily: "var(--font-primary)",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          Login Sebagai Therapist
        </button>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2.5rem 2rem",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
              }}
            >
              &#x2715;
            </button>
            
            <h2 style={{ 
              fontFamily: "var(--font-primary)", 
              fontSize: "1.75rem", 
              fontWeight: 800, 
              color: "#111827",
              marginBottom: "1.5rem",
              textAlign: "center"
            }}>
              {modalMode === "login" 
                ? "Welcome Back" 
                : `Daftar ${loginRole === "pasien" ? "Pasien" : "Therapist"}`}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input 
                type="text" 
                placeholder="Username" 
                style={{
                  padding: "0.875rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontFamily: "var(--font-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  color: "#111827"
                }}
              />
              <input 
                type="password" 
                placeholder="Password" 
                style={{
                  padding: "0.875rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontFamily: "var(--font-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  color: "#111827"
                }}
              />
              
              <button
                style={{
                  padding: "0.875rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#6366F1",
                  color: "white",
                  fontFamily: "var(--font-primary)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                  transition: "background-color 0.2s ease"
                }}
              >
                {modalMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </div>

            <p style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontFamily: "var(--font-primary)",
              fontSize: "0.875rem",
              color: "#6B7280"
            }}>
              {modalMode === "login" ? (
                <>
                  Tidak punya akun?{" "}
                  <button 
                    onClick={() => setModalMode("register")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#6366F1",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: "var(--font-primary)",
                      textDecoration: "none"
                    }}
                  >
                    Daftar Sebagai {loginRole === "pasien" ? "Pasien" : "Therapist"}
                  </button>
                </>
              ) : (
                <>
                  Sudah memiliki akun?{" "}
                  <button 
                    onClick={() => setModalMode("login")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#6366F1",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: "var(--font-primary)",
                      textDecoration: "none"
                    }}
                  >
                    Masuk
                  </button>
                </>
              )}
            </p>

            <p style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontFamily: "var(--font-primary)",
              fontSize: "0.8rem",
              color: "#6B7280",
              lineHeight: "1.5"
            }}>
              Dengan masuk atau mendaftar, Anda menyetujui{" "}
              <a href="#" style={{ color: "#0066cc", textDecoration: "none", fontWeight: 500 }}>
                Syarat & Ketentuan
              </a>
              {" "}dan{" "}
              <a href="#" style={{ color: "#0066cc", textDecoration: "none", fontWeight: 500 }}>
                Kebijakan Privasi
              </a>
              {" "}PressPoint.
            </p>
          </div>
        </div>
      )}
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
