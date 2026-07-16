"use client";
import { useState, useRef, useCallback } from "react";
import { evaluateVideo } from "@/api/trainingApi";
import type { EvaluationResponse } from "@/api/trainingApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EvaluationTimeline from "@/components/training/EvaluationTimeline";
type UploadStep = "idle" | "selected" | "uploading" | "done" | "error";
export default function VideoUploadForm() {
  const [step, setStep] = useState<UploadStep>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [therapistId, setTherapistId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFile = useCallback((file: File) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Format video tidak didukung. Gunakan MP4, MOV, atau WebM.");
      setStep("error");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setErrorMsg("Ukuran video melebihi batas 500 MB.");
      setStep("error");
      return;
    }
    setSelectedFile(file);
    setStep("selected");
    setErrorMsg("");
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );
  const handleSubmit = async () => {
    if (!selectedFile) return;
    setStep("uploading");
    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("therapistId", therapistId || "terapis-demo-001");
    formData.append("patientId", patientId || "pasien-demo-001");
    try {
      const data = await evaluateVideo(formData);
      setResult(data);
      setStep("done");
    } catch {
      setErrorMsg("Terjadi kesalahan saat memproses video. Silakan coba lagi.");
      setStep("error");
    }
  };
  const handleReset = () => {
    setStep("idle");
    setSelectedFile(null);
    setResult(null);
    setErrorMsg("");
  };
  if (step === "done" && result) {
    return <EvaluationTimeline result={result} onReset={handleReset} />;
  }
  if (step === "uploading") {
    return (
      <div className="card" style={{ minHeight: "320px" }}>
        <LoadingSpinner
          message="Menganalisis video dengan AI..."
          subMessage="Proses ini memerlukan 30–60 detik. Mohon tunggu dan jangan menutup halaman ini."
        />
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        className="card"
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label
            htmlFor="therapist-id"
            style={{
              display: "block",
              fontFamily: "var(--font-primary)",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--color-moss)",
              marginBottom: "0.375rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            ID Terapis
          </label>
          <input
            id="therapist-id"
            className="input"
            type="text"
            placeholder="Contoh: terapis-budi-001"
            value={therapistId}
            onChange={(e) => setTherapistId(e.target.value)}
          />
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label
            htmlFor="patient-id"
            style={{
              display: "block",
              fontFamily: "var(--font-primary)",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--color-moss)",
              marginBottom: "0.375rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            ID Pasien
          </label>
          <input
            id="patient-id"
            className="input"
            type="text"
            placeholder="Contoh: pasien-andi-001"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
      </div>
      <div
        id="video-drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--color-martini)" : step === "selected" ? "var(--color-martini)" : "var(--color-linen)"}`,
          borderRadius: "var(--radius-md)",
          padding: "2.5rem 2rem",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragOver
            ? "rgba(175,164,6,0.07)"
            : step === "selected"
            ? "rgba(242,236,155,0.3)"
            : "var(--color-white)",
          transition: "var(--transition-base)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <input
          ref={fileInputRef}
          id="video-file-input"
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {step === "selected" && selectedFile ? (
          <>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "var(--color-sunflower)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#444305" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="#444305" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-primary)", fontWeight: 600, color: "var(--color-moss)", fontSize: "0.95rem" }}>
                {selectedFile.name}
              </p>
              <p style={{ fontFamily: "var(--font-primary)", fontSize: "0.8rem", color: "var(--color-moss-60)" }}>
                {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Klik untuk ganti file
              </p>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "var(--color-linen)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="#AFA406" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-primary)", fontWeight: 600, color: "var(--color-moss)", fontSize: "1rem" }}>
                Seret & lepas video di sini
              </p>
              <p style={{ fontFamily: "var(--font-primary)", fontSize: "0.85rem", color: "var(--color-moss-60)" }}>
                atau klik untuk memilih file
              </p>
              <p style={{ fontFamily: "var(--font-primary)", fontSize: "0.75rem", color: "var(--color-moss-60)", marginTop: "0.25rem" }}>
                Format: MP4, MOV, WebM · Maks. 500 MB
              </p>
            </div>
          </>
        )}
      </div>
      {step === "error" && (
        <div
          style={{
            padding: "0.875rem 1rem",
            backgroundColor: "#FEF2F2",
            borderRadius: "var(--radius-sm)",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
            fontFamily: "var(--font-primary)",
            fontSize: "0.875rem",
          }}
        >
          ⚠ {errorMsg}
        </div>
      )}
      <button
        id="btn-evaluate-video"
        className="btn-primary"
        onClick={handleSubmit}
        disabled={step !== "selected"}
        style={{ width: "100%", padding: "1rem" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
        </svg>
        Evaluasi Video dengan AI
      </button>
    </div>
  );
}
