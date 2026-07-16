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
            {/* Header Banner */}
            <div
                style={{
                    backgroundColor: "var(--color-white)",
                    borderBottom: "1px solid #E5E7EB",
                    padding: "2.5rem 1.5rem",
                }}
            >
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <h1
                        style={{
                            marginBottom: "0.5rem",
                            fontSize: "clamp(1.5rem, 4vw, 1.875rem)"
                        }}
                    >
                        Pemetaan Nyeri 3D
                    </h1>
                    <p
                        style={{
                            color: "var(--color-moss-60)",
                            fontSize: "0.9rem",
                            maxWidth: "520px",
                        }}
                    >
                        Klik atau sentuh area tubuh pada model 3D untuk menandai lokasi nyeri Anda. Putar model untuk melihat dari berbagai sudut.
                    </p>
                </div>
            </div>

            {/* Main Responsive Layout Wrapper */}
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "2rem 1.5rem 4rem",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", /* Fallback strategy for clean flex/grid */
                        gap: "2rem",
                        alignItems: "start",
                    }}
                    className="responsive-main-grid"
                >
                    {/* Custom style injection for structural media queries */}
                    <style dangerouslySetInnerHTML={{__html: `
            @media (min-width: 1024px) {
              .responsive-main-grid {
                grid-template-columns: 300px 1fr 340px !important;
              }
            }
            @media (max-width: 640px) {
              .model-container {
                height: 400px !important;
              }
            }
          `}} />

                    {/* Left Panel: Selectors */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div className="card">
                            <PainTypeSelector
                                selected={selectedPainType}
                                onSelect={setSelectedPainType}
                            />
                        </div>
                        <div className="card">
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
                                className="card animate-fade-in"
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

                    {/* Middle Panel: 3D Canvas Canvas & Generator button */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div
                            className=" model-container"
                            style={{
                                height: "540px",
                                borderRadius: "var(--radius-organic)",
                                overflow: "hidden",
                                boxShadow: "var(--shadow-card)",
                                backgroundColor: "#FAFAFA",
                                border: "1px solid #E5E7EB",
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
                                padding: "1rem 2rem",
                                fontSize: "1rem",
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

                    {/* Right Panel: Results Dashboard */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {loading && (
                            <div className="card animate-fade-in">
                                <LoadingSpinner
                                    message="Menganalisis dengan AI..."
                                    subMessage="Memproses koordinat 3D dan jalur meridian..."
                                />
                            </div>
                        )}
                        {!loading && !assessment && (
                            <div
                                style={{
                                    minHeight: "320px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "1.25rem",
                                    backgroundColor: "var(--color-linen)",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid #E5E7EB",
                                    textAlign: "center",
                                    padding: "2rem",
                                }}
                            >
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
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
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
        </div>
    );
}