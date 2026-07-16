"use client";
import { useRef } from "react";
import type { EvaluationResponse, TechniqueFeedback } from "@/api/trainingApi";
import StatusBadge from "@/components/ui/StatusBadge";
interface EvaluationTimelineProps {
  result: EvaluationResponse;
  onReset: () => void;
}
const SEVERITY_CONFIG = {
  INFO: {
    color: "#166534",
    bg: "#F0FDF4",
    border: "#86EFAC",
    icon: "✓",
    label: "Baik",
  },
  WARNING: {
    color: "#854D0E",
    bg: "#FEFCE8",
    border: "#FDE047",
    icon: "⚠",
    label: "Perhatian",
  },
  CRITICAL: {
    color: "#991B1B",
    bg: "#FEF2F2",
    border: "#FCA5A5",
    icon: "✕",
    label: "Kritis",
  },
};
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function FeedbackItem({
  item,
  onSeek,
}: {
  item: TechniqueFeedback;
  onSeek: (t: number) => void;
}) {
  const cfg = SEVERITY_CONFIG[item.severity];
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
          paddingTop: "4px",
        }}
      >
        <button
          onClick={() => onSeek(item.timestampSeconds)}
          title="Lompat ke timestamp"
          style={{
            padding: "0.2rem 0.5rem",
            backgroundColor: cfg.bg,
            color: cfg.color,
            border: `1.5px solid ${cfg.border}`,
            borderRadius: "6px",
            fontFamily: "var(--font-primary)",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "var(--transition-base)",
            minWidth: "48px",
            textAlign: "center",
          }}
        >
          {formatTime(item.timestampSeconds)}
        </button>
        <div
          style={{
            width: "2px",
            flexGrow: 1,
            minHeight: "24px",
            backgroundColor: cfg.border,
            margin: "4px 0",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          padding: "0.75rem 1rem",
          backgroundColor: cfg.bg,
          borderRadius: "var(--radius-sm)",
          border: `1px solid ${cfg.border}`,
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.375rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: cfg.color,
            }}
          >
            {item.bodyAreaTargeted}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.15rem 0.5rem",
              backgroundColor: "white",
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
              borderRadius: "999px",
              fontFamily: "var(--font-primary)",
              fontSize: "0.72rem",
              fontWeight: 600,
            }}
          >
            {cfg.icon} {cfg.label}
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "0.875rem",
            color: cfg.color,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {item.note}
        </p>
      </div>
    </div>
  );
}
export default function EvaluationTimeline({
  result,
  onReset,
}: EvaluationTimelineProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };
  const infoCount = result.feedbackTimeline.filter((f) => f.severity === "INFO").length;
  const warnCount = result.feedbackTimeline.filter((f) => f.severity === "WARNING").length;
  const critCount = result.feedbackTimeline.filter((f) => f.severity === "CRITICAL").length;
  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "var(--color-moss)",
            }}
          >
            Hasil Evaluasi AI
          </h2>
          <StatusBadge status={result.status} size="md" />
        </div>
        <p
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "0.95rem",
            color: "var(--color-moss)",
            lineHeight: 1.7,
            marginBottom: "1rem",
          }}
        >
          {result.summary}
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[
            { count: infoCount, label: "Baik", color: "#166534", bg: "#F0FDF4", border: "#86EFAC" },
            { count: warnCount, label: "Perhatian", color: "#854D0E", bg: "#FEFCE8", border: "#FDE047" },
            { count: critCount, label: "Kritis", color: "#991B1B", bg: "#FEF2F2", border: "#FCA5A5" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "0.4rem 0.875rem",
                backgroundColor: s.bg,
                borderRadius: "999px",
                border: `1px solid ${s.border}`,
                fontFamily: "var(--font-primary)",
                fontSize: "0.8rem",
                color: s.color,
                fontWeight: 600,
              }}
            >
              {s.count} {s.label}
            </div>
          ))}
        </div>
      </div>
      <div
        className="card"
        style={{
          backgroundColor: "#0f0f0f",
          aspectRatio: "16/9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-md)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            pointerEvents: "none",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: "0.8rem",
              color: "#9CA3AF",
            }}
          >
            Klik timestamp untuk loncat ke segmen
          </p>
        </div>
      </div>
      <div className="card">
        <h3
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--color-moss)",
            marginBottom: "1.25rem",
          }}
        >
          Timeline Feedback
        </h3>
        <div>
          {result.feedbackTimeline.map((item, i) => (
            <FeedbackItem key={i} item={item} onSeek={handleSeek} />
          ))}
        </div>
      </div>
      <button
        id="btn-evaluate-again"
        className="btn-secondary"
        onClick={onReset}
        style={{ alignSelf: "flex-start" }}
      >
        ← Evaluasi Video Lain
      </button>
    </div>
  );
}
