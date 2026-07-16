import type { MedicalAssessment } from "@/api/assessmentApi";
interface DashboardMedicalProps {
  data: MedicalAssessment;
}
export default function DashboardMedical({ data }: DashboardMedicalProps) {
  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      <div className="card" style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--color-sunflower)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-martini)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.25rem",
              }}
            >
              Keluhan Utama
            </p>
            <p
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "1rem",
                fontWeight: 500,
                color: "var(--color-moss)",
                lineHeight: 1.55,
              }}
            >
              {data.complaint}
            </p>
          </div>
        </div>
      </div>
      <div
        className="card hover-lift"
        style={{
          borderLeft: "none",
          position: "relative"
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "0",
            top: "20px",
            bottom: "20px",
            width: "4px",
            borderRadius: "0 4px 4px 0",
            backgroundColor: "var(--color-martini)",
            opacity: 0.7
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-martini)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.5rem",
          }}
        >
          Kemungkinan Indikasi
        </p>
        <p
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "0.95rem",
            color: "var(--color-moss)",
            lineHeight: 1.65,
          }}
        >
          {data.indication}
        </p>
      </div>
      <div className="card hover-lift">
        <p
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-martini)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.75rem",
          }}
        >
          Area Anatomi Terdampak
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {data.affectedAreas.map((area) => (
            <span
              key={area}
              style={{
                display: "inline-block",
                padding: "0.4rem 1rem",
                backgroundColor: "var(--color-linen)",
                borderRadius: "999px",
                border: "1px solid #E5E7EB",
                fontFamily: "var(--font-primary)",
                fontSize: "0.85rem",
                color: "var(--color-moss)",
                fontWeight: 500,
              }}
            >
              {area}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: "0.875rem 1rem",
          backgroundColor: "var(--color-sunflower)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--color-linen)",
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "1rem", flexShrink: 0 }}>ℹ️</span>
        <p
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "0.8rem",
            color: "var(--color-moss)",
            lineHeight: 1.6,
          }}
        >
          Hasil ini merupakan <strong>asesmen awal berbasis AI</strong>, bukan diagnosis medis. Harap konsultasikan dengan dokter atau tenaga medis profesional untuk penanganan lebih lanjut.
        </p>
      </div>
    </div>
  );
}
