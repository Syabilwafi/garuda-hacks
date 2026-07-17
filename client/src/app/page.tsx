"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    return (
        <div style={{
          minHeight: "100vh",
          backgroundColor: "#FDFCF8",
          color: "#111111",
          fontFamily: "var(--font-primary, system-ui, sans-serif)",
          position: "relative",
          overflowX: "hidden"
        }}>
          {/* Subtle Grid Background Pattern */}
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

          <main style={{
            position: "relative",
            zIndex: 10,
            padding: "6rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box"
          }}>
            <h1
              style={{
                fontFamily: "Georgia, 'Times New Roman', Times, serif",
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                fontWeight: 800,
                lineHeight: "1.0",
                letterSpacing: "-0.03em",
                color: "#000000",
                margin: "0 0 1.5rem 0"
              }}
            >
              Pemetaan,<br />
              booking, dan<br />
              pijat aman dengan<br />
              Press<span style={{color: "var(--color-martini)"}}>Point</span>
            </h1>

            <p style={{
              fontSize: "1.15rem",
              color: "#4B5563",
              margin: "0 0 2.5rem 0",
              fontWeight: 400,
              lineHeight: "1.6",
              maxWidth: "750px"
            }}>
              PressPoint adalah platform pemetaan nyeri berbasis 3D interaktif yang menjembatani komunikasi antara pasien dan terapis profesional.
            </p>

            <button
              onClick={() => {
                  if (isAuthenticated && user) {
                      router.push(user.role === "CLIENT" ? "/dashboard/client" : "/dashboard/therapist");
                  }
                  else {
                      setIsRoleModalOpen(true);
                  }
              }
            }
              style={{
                display: "inline-block",
                textDecoration: "none",
                backgroundColor: "var(--color-martini)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "1.05rem",
                padding: "0.875rem 2.25rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 25px -5px rgba(99, 201, 100, 0.4), 0 8px 10px -6px rgba(99, 201, 100, 0.1)"
              }}
            >
              Get Started
            </button>
          </main>


          {isRoleModalOpen && (
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
                  maxWidth: "400px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  textAlign: "center"
                }}
              >
                <button
                  onClick={() => setIsRoleModalOpen(false)}
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

                <h2 style={{ fontFamily: "var(--font-primary)", fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: "1.5rem" }}>
                  Pilih Peran Anda
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <button
                    onClick={() => {
                      setIsRoleModalOpen(false);
                      router.push("/login");
                    }}
                    style={{
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "1.5px solid var(--color-moss)",
                      backgroundColor: "transparent",
                      color: "var(--color-moss)",
                      fontFamily: "var(--font-primary)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                        setIsRoleModalOpen(false);
                        router.push("/signup");
                    }}
                    style={{
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--color-martini)",
                      color: "white",
                      fontFamily: "var(--font-primary)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}