export default function Disclaimer() {
  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: "var(--color-linen)",
        borderTop: "1px solid #E5E7EB",
        padding: "1.5rem",
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
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              backgroundColor: "var(--color-martini)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#FFFFFF"
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
              fontSize: "0.85rem",
              color: "var(--color-moss)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Health Disclaimer
          </h3>
        </div>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          {[
            "PressPoint is a communication and evaluation tool, not a substitute for professional medical diagnosis.",
            "Massage point recommendations provide temporary pain relief, not definitive treatment.",
            "AI-based therapy technique evaluation supports assessment, not official therapist competency certification.",
            "Users are advised to consult healthcare professionals if conditions do not improve or worsen.",
          ].map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                fontFamily: "var(--font-primary)",
                fontSize: "0.8rem",
                color: "var(--color-moss-60)",
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
            borderTop: "1px solid #E5E7EB",
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
              color: "var(--color-moss-60)",
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
            Built for public health
          </span>
        </div>
      </div>
    </footer>
  );
}
