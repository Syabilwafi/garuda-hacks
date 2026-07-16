"use client";
import type { TraditionalAssessment, HighlightedNode } from "@/api/assessmentApi";
interface DashboardTraditionalProps {
  data: TraditionalAssessment;
  onHighlightNodes: (nodes: HighlightedNode[]) => void;
  activeHighlights: boolean;
}
export default function DashboardTraditional({
  data,
  onHighlightNodes,
  activeHighlights,
}: DashboardTraditionalProps) {
  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      <div className="card hover-lift">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.875rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--color-martini)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Titik Pijat Direkomendasikan
          </p>
          <button
            onClick={() =>
              onHighlightNodes(activeHighlights ? [] : data.highlightedNodes)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.3rem 0.75rem",
              backgroundColor: activeHighlights
                ? "var(--color-martini)"
                : "transparent",
              color: activeHighlights ? "white" : "var(--color-martini)",
              border: "1.5px solid var(--color-martini)",
              borderRadius: "999px",
              fontFamily: "var(--font-primary)",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "var(--transition-base)",
            }}
          >
            <span style={{ fontSize: "0.9em" }}>
              {activeHighlights ? "⬛" : "✨"}
            </span>
            {activeHighlights ? "Sembunyikan" : "Sorot di Model 3D"}
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.highlightedNodes.map((node) => (
            <div
              key={node.id}
              className="hover-lift"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 1rem",
                backgroundColor: "var(--color-linen)",
                borderRadius: "999px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-martini)",
                  flexShrink: 0,
                  animation: activeHighlights
                    ? "pulse-glow 1.5s ease-in-out infinite"
                    : "none",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "var(--color-moss)",
                }}
              >
                {node.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="card hover-lift"
        style={{ position: "relative", borderLeft: "none" }}
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
          Instruksi Pijat
        </p>
        <p
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "0.95rem",
            color: "var(--color-moss)",
            lineHeight: 1.7,
          }}
        >
          {data.instructions}
        </p>
      </div>
      <div
        className="card"
        style={{
          backgroundColor: "#FEFCE8",
          border: "1px solid #FDE047",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#991B1B",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.625rem",
          }}
        >
          ⚠ Pantangan & Peringatan
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.contraindications.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
                fontFamily: "var(--font-primary)",
                fontSize: "0.875rem",
                color: "#991B1B",
                lineHeight: 1.6,
              }}
            >
              <span style={{ flexShrink: 0, fontWeight: 700 }}>•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
