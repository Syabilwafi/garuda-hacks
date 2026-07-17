"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type LoginRole = "CLIENT" | "THERAPIST" | null;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<LoginRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleRoleSelect = (role: LoginRole) => {
    setSelectedRole(role);
    setEmail("");
    setPassword("");
    setFormError("");
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      setFormError("Pilih peran terlebih dahulu");
      return;
    }

    if (!email.trim()) {
      setFormError("Email wajib diisi");
      return;
    }

    if (!password) {
      setFormError("Password wajib diisi");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Format email tidak valid");
      return;
    }

    try {
      await login(email, password, selectedRole);
      router.push(selectedRole === "CLIENT" ? "/dashboard/client" : "/dashboard/therapist");
    } catch (err) {
      setFormError(error || "Login gagal");
    }
  };

  const isFormValid = selectedRole && email.trim() && password;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDFCF8",
        }}
      >
        <LoadingSpinner message="Memuat..." />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FDFCF8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem 2rem",
        position: "relative",
        fontFamily: "var(--font-primary, system-ui, sans-serif)",
      }}
    >
      {/* Subtle Grid Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
            padding: "3rem 2rem 2rem",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              textDecoration: "none",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "var(--color-martini)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="24"
                height="24"
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
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#111111",
                letterSpacing: "-0.02em",
              }}
            >
              Press<span style={{ color: "var(--color-martini)", fontWeight: 600 }}>Point</span>
            </span>
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "#111111" }}>
            Masuk
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#4B5563", margin: 0 }}>
            Lanjutkan ke dashboard Anda
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: "2.5rem 2rem" }}>
          {/* Role Selection */}
          {!selectedRole ? (
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "2rem", color: "#111111" }}>
                Pilih peran Anda
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Client Button */}
                <button
                  onClick={() => handleRoleSelect("CLIENT")}
                  style={{
                    padding: "1.5rem",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "12px",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--color-martini)";
                    (e.target as HTMLElement).style.backgroundColor = "#FAFDF9";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "#E5E7EB";
                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111111", marginBottom: "0.5rem" }}>
                    Masuk sebagai Pasien
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", margin: 0 }}>
                    Akses pemetaan nyeri 3D dan rekomendasi terapi
                  </p>
                </button>

                {/* Therapist Button */}
                <button
                  onClick={() => handleRoleSelect("THERAPIST")}
                  style={{
                    padding: "1.5rem",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "12px",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--color-martini)";
                    (e.target as HTMLElement).style.backgroundColor = "#FAFDF9";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "#E5E7EB";
                    (e.target as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111111", marginBottom: "0.5rem" }}>
                    Masuk sebagai Terapis
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", margin: 0 }}>
                    Kelola sesi terapi dan evaluasi teknik Anda
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
                <button
                  onClick={() => handleRoleSelect(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-martini)",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    marginRight: "1rem",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ←
                </button>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111111", margin: 0 }}>
                  {selectedRole === "CLIENT" ? "Masuk sebagai Pasien" : "Masuk sebagai Terapis"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Email */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#111111",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com"
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s ease",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#111111",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s ease",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-martini)")}
                    onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                  />
                </div>

                {/* Error Messages */}
                {(formError || error) && (
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#FEF2F2",
                      border: "1px solid #FECACA",
                      borderRadius: "8px",
                      color: "#DC2626",
                      fontSize: "0.9rem",
                    }}
                  >
                    {formError || error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  style={{
                    padding: "0.95rem",
                    backgroundColor: isLoading || !isFormValid ? "#D1D5DB" : "var(--color-martini)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: isLoading || !isFormValid ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && isFormValid) {
                      (e.target as HTMLElement).style.opacity = "0.9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && isFormValid) {
                      (e.target as HTMLElement).style.opacity = "1";
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </form>

              {/* Signup Link */}
              <div style={{ marginTop: "2rem", textAlign: "center", paddingTop: "2rem", borderTop: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: "0.95rem", color: "#4B5563", margin: 0 }}>
                  Belum punya akun?{" "}
                  <Link
                    href={`/signup?role=${selectedRole?.toLowerCase()}`}
                    style={{
                      color: "var(--color-martini)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
