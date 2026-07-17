"use client";

import React from "react";
import ClinicalNoteViewer from "./ClinicalNoteViewer";

interface ClinicalNoteModalProps {
  isOpen: boolean;
  appointmentId: string;
  patientName: string;
  onClose: () => void;
}

export default function ClinicalNoteModal({
  isOpen,
  appointmentId,
  patientName,
  onClose,
}: ClinicalNoteModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          cursor: "pointer",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          width: "90%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem",
            borderBottom: "1px solid #E5E7EB",
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.3rem" }}>
              Catatan Klinis Pasien
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "var(--color-moss-60)",
              }}
            >
              {patientName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "var(--color-moss-60)",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.color = "var(--color-martini)";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.color = "var(--color-moss-60)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "2rem",
            overflowY: "auto",
            flex: 1,
          }}
        >
          <ClinicalNoteViewer appointmentId={appointmentId} onClose={onClose} />
        </div>
      </div>
    </>
  );
}
