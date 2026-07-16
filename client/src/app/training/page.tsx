import type { Metadata } from "next";
import VideoUploadForm from "@/components/training/VideoUploadForm";
export const metadata: Metadata = {
  title: "Evaluasi Training — PressPoint",
  description:
    "Upload video sesi terapi untuk mendapatkan evaluasi teknik berbasis AI. Sistem akan menganalisis posisi, tekanan, dan keamanan teknik yang digunakan.",
};
export default function TrainingPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "var(--color-white)",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-white)",
          borderBottom: "1px solid #E5E7EB",
          padding: "2.5rem 2rem",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "var(--color-martini)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              Evaluasi Training Terapis
            </h1>
          </div>
          <p
            style={{
              color: "var(--color-moss-60)",
              fontSize: "0.9rem",
              maxWidth: "560px",
              lineHeight: 1.6,
            }}
          >
            Upload video sesi terapi untuk mendapatkan evaluasi teknik berbasis AI. Sistem akan menganalisis posisi tangan, tekanan, dan area pijatan secara otomatis.
          </p>
        </div>
      </div>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem 1.5rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <div>
          <VideoUploadForm />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card" style={{ borderTop: "3px solid var(--color-martini)" }}>
            <h3
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--color-martini)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem",
              }}
            >
              Cara Kerja
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                {
                  step: "1",
                  title: "Upload Video",
                  desc: "Rekam atau unggah video sesi terapi (MP4/MOV/WebM, maks. 500 MB).",
                },
                {
                  step: "2",
                  title: "Analisis AI",
                  desc: "Sistem menganalisis teknik, posisi tangan, tekanan, dan area target menggunakan AI.",
                },
                {
                  step: "3",
                  title: "Terima Laporan",
                  desc: "Dapatkan laporan evaluasi lengkap dengan feedback per timestamp.",
                },
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-martini)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-primary)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-primary)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--color-moss)",
                        marginBottom: "0.15rem",
                      }}
                    >
                      {s.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-primary)",
                        fontSize: "0.8rem",
                        color: "var(--color-moss-60)",
                        lineHeight: 1.5,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-linen">
            <p
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-moss)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              Keterangan Status
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { color: "#166534", bg: "#F0FDF4", border: "#86EFAC", label: "Teknik Sesuai", desc: "Semua teknik sudah aman dan tepat" },
                { color: "#854D0E", bg: "#FEFCE8", border: "#FDE047", label: "Perlu Perbaikan", desc: "Ada beberapa teknik yang perlu diperbaiki" },
                { color: "#991B1B", bg: "#FEF2F2", border: "#FCA5A5", label: "Berisiko", desc: "Ditemukan teknik yang berpotensi membahayakan" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: s.bg,
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${s.border}`,
                  }}
                >
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "0.8rem", fontWeight: 600, color: s.color, marginBottom: "0.1rem" }}>
                    {s.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-primary)", fontSize: "0.73rem", color: s.color, opacity: 0.8 }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: "0.875rem",
              backgroundColor: "var(--color-sunflower)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-linen)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "0.78rem",
                color: "var(--color-moss)",
                lineHeight: 1.6,
              }}
            >
              <strong>Catatan:</strong> Evaluasi AI ini bersifat <em>pendukung penilaian</em>, bukan sertifikasi resmi kompetensi terapis. Waktu analisis sekitar 30–60 detik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
