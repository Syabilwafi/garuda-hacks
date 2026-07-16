"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import PainTypeSelector, { PainType } from "@/components/ui/PainTypeSelector";
import DashboardMedical from "@/components/dashboard/DashboardMedical";
import DashboardTraditional from "@/components/dashboard/DashboardTraditional";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  generateAssessment,
  AssessmentResponse,
  HighlightedNode,
} from "@/api/assessmentApi";
import type { PainMarkData } from "@/components/3d/HumanModel";
const HumanModel = dynamic(() => import("@/components/3d/HumanModel"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-linen)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <LoadingSpinner message="Memuat model 3D..." />
    </div>
  ),
});
type ActiveTab = "medis" | "tradisional";
export default function PainMappingPage() {
  const [selectedPainType, setSelectedPainType] = useState<PainType | null>("THROBBING");
  const [selectedIntensity, setSelectedIntensity] = useState<number>(3);
  const [paintedPoints, setPaintedPoints] = useState<PainMarkData[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<HighlightedNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("medis");
  const [activeHighlights, setActiveHighlights] = useState(false);
  const handlePaintPoint = useCallback((point: PainMarkData) => {
    const p = { ...point, intensity: selectedIntensity };
    setPaintedPoints((prev) => [...prev, p]);
  }, [selectedIntensity]);
  const handleClearMarks = () => {
    setPaintedPoints([]);
    setHighlightedNodes([]);
    setAssessment(null);
    setActiveHighlights(false);
  };
  const handleGenerateAssessment = async () => {
    if (paintedPoints.length === 0) return;
    setLoading(true);
    setAssessment(null);
    setActiveHighlights(false);
    setHighlightedNodes([]);
    try {
      const result = await generateAssessment(
        "pasien-demo-001",
        paintedPoints.map((p) => ({
          coordinate3D: p.coordinate3D,
          painType: p.painType,
        }))
      );
      setAssessment(result);
      setActiveTab("medis");
    } finally {
      setLoading(false);
    }
  };
  const handleHighlightNodes = (nodes: HighlightedNode[]) => {
    setHighlightedNodes(nodes);
    setActiveHighlights(nodes.length > 0);
  };
  const painTypeCount = paintedPoints.reduce<Record<string, number>>((acc, p) => {
    acc[p.painType] = (acc[p.painType] ?? 0) + 1;
    return acc;
  }, {});
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "var(--color-white)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #444305 0%, #2d2c03 50%, #4a4805 100%)",
          padding: "3.5rem 2rem 5rem",
          position: "relative",
          overflow: "hidden",
          borderBottomLeftRadius: "40px",
          borderBottomRightRadius: "40px",
          boxShadow: "0 10px 30px rgba(68, 67, 5, 0.15)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-10%",
            top: "-20%",
            width: "500px",
            height: "500px",
            borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
            background: "radial-gradient(circle, rgba(175,164,6,0.15) 0%, transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
            animation: "pulse-glow 8s infinite alternate",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "-5%",
            bottom: "-30%",
            width: "400px",
            height: "400px",
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            background: "radial-gradient(circle, rgba(242,236,155,0.1) 0%, transparent 60%)",
            filter: "blur(15px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h1
            style={{
              color: "var(--color-sunflower)",
              marginBottom: "0.5rem",
            }}
          >
            Pemetaan Nyeri 3D
          </h1>
          <p
            style={{
              color: "var(--color-linen)",
              fontSize: "0.9rem",
              opacity: 0.8,
              maxWidth: "520px",
            }}
          >
            Klik atau sentuh area tubuh pada model 3D untuk menandai lokasi nyeri Anda. Putar model untuk melihat dari berbagai sudut.
          </p>
        </div>
      </div>
      <div
        style={{
          maxWidth: "1200px",
          margin: "-48px auto 0", 
          padding: "0 1.5rem 4rem",
          display: "grid",
          gridTemplateColumns: "300px 1fr 340px",
          gap: "2rem",
          alignItems: "start",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card hover-lift">
            <PainTypeSelector
              selected={selectedPainType}
              onSelect={setSelectedPainType}
            />
          </div>
          <div className="card hover-lift">
            <h3 style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--color-moss)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Level Nyeri
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-moss-60)" }}>Ringan</span>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={selectedIntensity}
                onChange={(e) => setSelectedIntensity(Number(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: "var(--color-martini)",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-moss-60)" }}>Berat</span>
            </div>
            <div style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-moss)" }}>
              Level: {selectedIntensity}
            </div>
          </div>
          {paintedPoints.length > 0 && (
            <div
              className="card animate-fade-in hover-lift"
              style={{ borderTop: "4px solid var(--color-martini)" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-martini)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.625rem",
                }}
              >
                Titik Ditandai ({paintedPoints.length})
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {Object.entries(painTypeCount).map(([type, count]) => (
                  <span
                    key={type}
                    style={{
                      padding: "0.2rem 0.5rem",
                      backgroundColor: "var(--color-sunflower)",
                      borderRadius: "999px",
                      fontFamily: "var(--font-primary)",
                      fontSize: "0.75rem",
                      color: "var(--color-moss)",
                      fontWeight: 500,
                    }}
                  >
                    {type.replace("_", " ")} ×{count}
                  </span>
                ))}
              </div>
              <button
                id="btn-clear-marks"
                onClick={handleClearMarks}
                style={{
                  marginTop: "0.75rem",
                  width: "100%",
                  padding: "0.5rem",
                  backgroundColor: "transparent",
                  border: "1.5px solid var(--color-linen)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-primary)",
                  fontSize: "0.8rem",
                  color: "var(--color-moss-60)",
                  cursor: "pointer",
                  transition: "var(--transition-base)",
                }}
              >
                Hapus Semua Tanda
              </button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            className="hover-lift"
            style={{
              height: "540px",
              borderRadius: "var(--radius-organic)",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
              backgroundColor: "#FAFAF7",
              border: "1px solid rgba(219, 221, 184, 0.4)",
            }}
          >
            <HumanModel
              selectedPainType={selectedPainType}
              paintedPoints={paintedPoints}
              highlightedNodes={highlightedNodes}
              onPaintPoint={handlePaintPoint}
              isInteractive={!loading}
            />
          </div>
          <button
            id="btn-generate-assessment"
            className="btn-primary"
            onClick={handleGenerateAssessment}
            disabled={paintedPoints.length === 0 || loading}
            style={{ 
              width: "100%", 
              padding: "1.25rem 2rem", 
              fontSize: "1.1rem",
              borderRadius: "999px", 
              boxShadow: "0 10px 30px rgba(175, 164, 6, 0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "0.5rem"
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    border: "3px solid rgba(255,255,255,0.4)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Menganalisis...
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Generate Assessment
              </>
            )}
          </button>
          {paintedPoints.length === 0 && (
            <p
              style={{
                textAlign: "center",
                fontFamily: "var(--font-primary)",
                fontSize: "0.8rem",
                color: "var(--color-moss-60)",
              }}
            >
              Pilih jenis nyeri lalu klik area tubuh pada model 3D untuk mulai
            </p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {loading && (
            <div className="card hover-lift animate-fade-in">
              <LoadingSpinner
                message="Menganalisis dengan AI..."
                subMessage="Memproses koordinat 3D dan jalur meridian..."
              />
            </div>
          )}
          {!loading && !assessment && (
            <div
              className="hover-lift"
              style={{
                minHeight: "320px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                backgroundColor: "var(--color-linen)",
                borderRadius: "var(--radius-organic-reverse)",
                textAlign: "center",
                padding: "2rem",
                boxShadow: "inset 0 2px 10px rgba(68, 67, 5, 0.05)"
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-sunflower)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#444305" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-primary)",
                    fontWeight: 600,
                    color: "var(--color-moss)",
                    fontSize: "0.95rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  Hasil Assessment
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-primary)",
                    fontSize: "0.8rem",
                    color: "var(--color-moss-60)",
                    maxWidth: "220px",
                    lineHeight: 1.55,
                  }}
                >
                  Tandai area nyeri pada model 3D lalu klik &ldquo;Generate Assessment&rdquo;
                </p>
              </div>
            </div>
          )}
          {!loading && assessment && (
            <div className="animate-fade-in">
              <div className="tab-bar">
                <button
                  id="tab-medis"
                  className={`tab-item ${activeTab === "medis" ? "active" : ""}`}
                  onClick={() => setActiveTab("medis")}
                >
                  🏥 Medis
                </button>
                <button
                  id="tab-tradisional"
                  className={`tab-item ${activeTab === "tradisional" ? "active" : ""}`}
                  onClick={() => setActiveTab("tradisional")}
                >
                  🌿 Tradisional
                </button>
              </div>
              {activeTab === "medis" && (
                <DashboardMedical data={assessment.medical} />
              )}
              {activeTab === "tradisional" && (
                <DashboardTraditional
                  data={assessment.traditional}
                  onHighlightNodes={handleHighlightNodes}
                  activeHighlights={activeHighlights}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
