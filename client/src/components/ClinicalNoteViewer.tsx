"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getClinicalNote } from "@/api/clinicalApi";

interface ClinicalNoteViewerProps {
  appointmentId: string;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function ClinicalNoteViewer({
  appointmentId,
  onClose,
  isLoading = false,
}: ClinicalNoteViewerProps) {
  const [soapNote, setSoapNote] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [triageStatus, setTriageStatus] = useState<string>("");

  useEffect(() => {
    const fetchClinicalNote = async () => {
      try {
        setLoading(true);
        const response = await getClinicalNote(appointmentId);
        setSoapNote(response.clinicalNote.soapNote);
        setTriageStatus(response.clinicalNote.triageStatus);
        setError("");
      } catch (err) {
        console.error("Error fetching clinical note:", err);
        setError(
          "Clinical notes not available yet. Make sure the assessment has been submitted."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClinicalNote();
  }, [appointmentId]);

  const getTriageBadgeStyle = (status: string) => {
    switch (status) {
      case "RED_EMERGENCY":
        return {
          bg: "#FEF2F2",
          text: "#991B1B",
          border: "#FCA5A5",
          label: "🔴 EMERGENCY",
        };
      case "RED_URGENT":
        return {
          bg: "#FFF7ED",
          text: "#C2410C",
          border: "#FFEDD5",
          label: "🔴 URGENT",
        };
      case "YELLOW":
        return {
          bg: "#FFFAEB",
          text: "#92400E",
          border: "#FCD34D",
          label: "🟡 REVIEW",
        };
      case "GREEN":
      default:
        return {
          bg: "#F0FDF4",
          text: "#16A34A",
          border: "#BBF7D0",
          label: "🟢 SAFE",
        };
    }
  };

  const triageStyle = getTriageBadgeStyle(triageStatus);

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "var(--color-moss-60)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid var(--color-martini)",
            borderTop: "3px solid transparent",
            animation: "spin 0.8s linear infinite",
            marginBottom: "1rem",
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ margin: 0 }}>Menghasilkan catatan klinis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "1.5rem",
          backgroundColor: "#FEF2F2",
          border: "1px solid #FCA5A5",
          borderRadius: "var(--radius-sm)",
          color: "#991B1B",
          fontSize: "0.9rem",
        }}
      >
        <strong>⚠️ {error}</strong>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Header with Triage Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
            Catatan Klinis SOAP
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "var(--color-moss-60)",
            }}
          >
            Assessment klinis profesional berbasis AI
          </p>
        </div>

        <div
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: triageStyle.bg,
            color: triageStyle.text,
            border: `1px solid ${triageStyle.border}`,
            borderRadius: "var(--radius-sm)",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          {triageStyle.label}
        </div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.75rem",
          color: "var(--color-moss-60)",
          lineHeight: 1.5,
        }}
      >
        <strong>📋 Catatan Penting:</strong> Dokumen ini adalah alat bantu
        komunikasi dan assessment saja, bukan pengganti diagnosis medis
        profesional. Terapis dan pasien tetap harus berkonsultasi dengan dokter
        untuk kondisi kesehatan yang serius atau tidak kunjung membaik.
      </div>

      {/* SOAP Note Content */}
      <div
        className="clinical-note-content"
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.7,
          color: "var(--color-moss)",
        }}
      >
        <style>{`
          .clinical-note-content h2 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--color-martini);
            border-bottom: 2px solid var(--color-martini);
            padding-bottom: 0.5rem;
          }

          .clinical-note-content h2:first-child {
            margin-top: 0;
          }

          .clinical-note-content ul {
            margin: 0.75rem 0;
            padding-left: 1.5rem;
          }

          .clinical-note-content li {
            margin-bottom: 0.5rem;
            list-style-type: disc;
          }

          .clinical-note-content strong {
            color: var(--color-martini);
            font-weight: 700;
          }

          .clinical-note-content em {
            color: var(--color-moss-60);
            font-style: italic;
          }

          .clinical-note-content p {
            margin: 0.5rem 0;
          }
        `}</style>

        <ReactMarkdown
          components={{
            h2: ({ node, ...props }) => (
              <h2 style={{ margin: "1.5rem 0 1rem 0" }} {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul style={{ marginLeft: "1.5rem", marginBottom: "1rem" }} {...props} />
            ),
            li: ({ node, ...props }) => (
              <li style={{ marginBottom: "0.5rem" }} {...props} />
            ),
            p: ({ node, ...props }) => (
              <p style={{ margin: "0.5rem 0" }} {...props} />
            ),
          }}
        >
          {soapNote}
        </ReactMarkdown>
      </div>

      {/* Footer with Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid #E5E7EB",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => {
            const element = document.createElement("a");
            element.setAttribute(
              "href",
              `data:text/markdown;charset=utf-8,${encodeURIComponent(soapNote)}`
            );
            element.setAttribute("download", `SOAP_Note_${appointmentId}.md`);
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--color-martini)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.opacity = "0.9";
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.opacity = "1";
          }}
        >
          📥 Download Markdown
        </button>

        <button
          onClick={() => window.print()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#F0F0F0",
            color: "var(--color-moss)",
            border: "1px solid #D1D5DB",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#E5E7EB";
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#F0F0F0";
          }}
        >
          🖨️ Print
        </button>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "var(--color-moss-60)",
              border: "1px solid #D1D5DB",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              transition: "all 0.2s",
              marginLeft: "auto",
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.borderColor =
                "var(--color-martini)";
              (e.target as HTMLButtonElement).style.color = "var(--color-martini)";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "#D1D5DB";
              (e.target as HTMLButtonElement).style.color = "var(--color-moss-60)";
            }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
