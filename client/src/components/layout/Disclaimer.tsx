export default function Disclaimer() {
  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: "var(--color-moss)",
        borderTop: "3px solid var(--color-martini)",
        padding: "2rem",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "var(--color-martini)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#F2EC9B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-primary)",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--color-sunflower)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Disclaimer Kesehatan
          </h3>
        </div>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {[
            "PressPoint adalah alat bantu komunikasi dan evaluasi, bukan pengganti diagnosis medis profesional.",
            "Rekomendasi titik pijat bersifat peredaan nyeri sementara, bukan pengobatan definitif.",
            "Evaluasi teknik terapi berbasis AI bersifat pendukung penilaian, bukan sertifikasi resmi kompetensi terapis.",
            "Pengguna disarankan tetap berkonsultasi ke tenaga medis untuk kondisi yang tidak membaik atau memburuk.",
          ].map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                fontFamily: "var(--font-primary)",
                fontSize: "0.8rem",
                color: "var(--color-linen)",
                lineHeight: 1.55,
              }}
            >
              <span
                style={{
                  color: "var(--color-martini)",
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                •
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div
          style={{
            paddingTop: "1rem",
            borderTop: "1px solid rgba(219,221,184,0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: "0.75rem",
              color: "var(--color-linen)",
              opacity: 0.6,
            }}
          >
            © 2025 PressPoint — GarudaHacks Project
          </span>
          <span
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: "0.75rem",
              color: "var(--color-martini)",
              fontWeight: 500,
            }}
          >
            Dibangun untuk kesehatan masyarakat Indonesia
          </span>
        </div>
      </div>
    </footer>
  );
}
