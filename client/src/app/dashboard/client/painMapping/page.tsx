"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/ProtectedRoute";
import PainTypeSelector, { PainType } from "@/components/ui/PainTypeSelector";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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

const TAHAP_1_EMERGENCY = [
    { id: "t1_1", label: "Apakah Anda mengalami nyeri dada atau sesak napas?" },
    { id: "t1_2", label: "Apakah Anda tiba-tiba kehilangan kekuatan pada tangan atau kaki?" },
    { id: "t1_3", label: "Apakah Anda kehilangan kontrol buang air kecil atau besar?" },
    { id: "t1_4", label: "Apakah Anda mengalami mati rasa di sekitar genital, bokong, atau paha dalam?" },
    { id: "t1_5", label: "Apakah nyeri muncul setelah kecelakaan atau benturan berat?" },
    { id: "t1_6", label: "Apakah salah satu kaki tiba-tiba bengkak, merah, hangat, dan nyeri?" },
];

const TAHAP_2_URGENT = [
    { id: "t2_1", label: "Apakah Anda demam atau menggigil?" },
    { id: "t2_2", label: "Apakah area nyeri merah, panas, atau membengkak?" },
    { id: "t2_3", label: "Apakah terdapat luka terbuka atau infeksi?" },
    { id: "t2_4", label: "Apakah berat badan turun tanpa direncanakan?" },
    { id: "t2_5", label: "Apakah Anda memiliki riwayat kanker dan sekarang mengalami nyeri baru?" },
    { id: "t2_6", label: "Apakah nyeri terus memburuk atau membangunkan Anda setiap malam?" },
    { id: "t2_7", label: "Apakah Anda tidak dapat berjalan atau menggunakan bagian tubuh tersebut?" },
];

const TAHAP_3_YELLOW = [
    { id: "t3_1", label: "Apakah Anda sedang hamil?" },
    { id: "t3_2", label: "Apakah Anda memiliki osteoporosis?" },
    { id: "t3_3", label: "Apakah Anda menggunakan pengencer darah?" },
    { id: "t3_4", label: "Apakah Anda baru menjalani operasi?" },
    { id: "t3_5", label: "Apakah Anda mengalami kesemutan atau mati rasa ringan?" },
    { id: "t3_6", label: "Apakah Anda memiliki diabetes atau gangguan sensasi?" },
    { id: "t3_7", label: "Apakah Anda memiliki implan pada area keluhan?" },
];

type TriageStatus = "HIJAU" | "KUNING" | "MERAH_MENDESAK" | "MERAH_DARURAT" | null;

export default function PainMappingPage() {
    const router = useRouter();

    const [selectedPainType, setSelectedPainType] = useState<PainType | null>("THROBBING");
    const [selectedIntensity, setSelectedIntensity] = useState<number>(3);
    const [paintedPoints, setPaintedPoints] = useState<PainMarkData[]>([]);

    const [healthDescription, setHealthDescription] = useState("");
    const [triageAnswers, setTriageAnswers] = useState<Record<string, "ya" | "tidak">>({});

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [hardStopStatus, setHardStopStatus] = useState<TriageStatus>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handlePaintPoint = useCallback((point: PainMarkData) => {
        const p = { ...point, intensity: Math.round(selectedIntensity) };
        setPaintedPoints((prev) => [...prev, p]);
    }, [selectedIntensity]);

    const handleClearMarks = () => {
        setPaintedPoints([]);
    };

    const handleAnswer = (questionId: string, answer: "ya" | "tidak", stageType: 1 | 2 | 3) => {
        const updatedAnswers = { ...triageAnswers, [questionId]: answer };
        setTriageAnswers(updatedAnswers);

        if (answer === "ya") {
            if (stageType === 1) {
                setHardStopStatus("MERAH_DARURAT");
            } else if (stageType === 2 && hardStopStatus !== "MERAH_DARURAT") {
                setHardStopStatus("MERAH_MENDESAK");
            }
        }

        setCurrentStep((prev) => prev + 1);
    };

    const handleNextStep = () => {
        if (currentStep === 0 && !healthDescription.trim()) {
            alert("Silakan isi deskripsi keluhan kesehatan Anda terlebih dahulu.");
            return;
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handleBackStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const getFinalTriageStatus = (): TriageStatus => {
        if (hardStopStatus === "MERAH_DARURAT" || hardStopStatus === "MERAH_MENDESAK") {
            return hardStopStatus;
        }

        const hasStage3Yes = TAHAP_3_YELLOW.some((q) => triageAnswers[q.id] === "ya");
        const isPainSevere = selectedIntensity >= 7;

        if (hasStage3Yes || isPainSevere) {
            return "KUNING";
        }

        return "HIJAU";
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const finalStatus = getFinalTriageStatus();

        const formData = {
            paintedPoints: paintedPoints.map((p) => ({
                coordinate3D: p.coordinate3D,
                painType: p.painType,
                intensity: p.intensity,
            })),
            healthDescription,
            selectedIntensity,
            statusTriase: finalStatus,
            answers: triageAnswers
        };

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Submitted Form Data: ", formData);
            setSubmitSuccess(true);

            setHealthDescription("");
            setTriageAnswers({});
            setPaintedPoints([]);

            router.push("/dashboard/client");
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalTriageQuestions = TAHAP_1_EMERGENCY.length + TAHAP_2_URGENT.length + TAHAP_3_YELLOW.length;
    const totalSteps = 1 + totalTriageQuestions;
    const progressPercentage = Math.round((currentStep / totalSteps) * 100);

    const painTypeCount = paintedPoints.reduce<Record<string, number>>((acc, p) => {
        acc[p.painType] = (acc[p.painType] ?? 0) + 1;
        return acc;
    }, {});

    const finalStatus = getFinalTriageStatus();

    const buttonYaStyle = {
        flex: 1,
        padding: "0.85rem",
        backgroundColor: "var(--color-martini)",
        color: "white",
        border: "none",
        borderRadius: "999px",
        fontWeight: 700,
        cursor: "pointer"
    };

    const buttonTidakStyle = {
        flex: 1,
        padding: "0.85rem",
        backgroundColor: "#F3F4F6",
        color: "var(--color-moss)",
        border: "1px solid #E5E7EB",
        borderRadius: "999px",
        fontWeight: 700,
        cursor: "pointer"
    };

    //@ts-ignore
    return (
        <ProtectedRoute requiredRole="CLIENT">
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
                        Pemetaan Nyeri 3D & Skrining Keselamatan
                    </h1>
                    <p
                        style={{
                            color: "var(--color-moss-60)",
                            fontSize: "0.9rem",
                            maxWidth: "520px",
                        }}
                    >
                        Klik atau sentuh area tubuh pada model 3D untuk menandai lokasi nyeri Anda, kemudian selesaikan skrining mandiri di panel kanan.
                    </p>
                </div>
            </div>

            {/* Main Layout */}
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
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "2rem",
                        alignItems: "start",
                    }}
                    className="responsive-main-grid"
                >
                    <style dangerouslySetInnerHTML={{__html: `
                        @media (min-width: 1024px) {
                          .responsive-main-grid {
                            grid-template-columns: 300px 1fr 360px !important;
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
                                    max="10"
                                    step="1"
                                    value={selectedIntensity}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setSelectedIntensity(val);
                                    }}
                                    style={{
                                        flex: 1,
                                        accentColor: "var(--color-martini)",
                                        cursor: "pointer"
                                    }}
                                />
                                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-moss-60)" }}>Berat</span>
                            </div>
                            <div style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-moss)" }}>
                                Level: {selectedIntensity} / 10
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

                    {/* Middle Panel: 3D Canvas */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div
                            className="model-container"
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
                                highlightedNodes={[]}
                                onPaintPoint={handlePaintPoint}
                                isInteractive={!isSubmitting}
                            />
                        </div>
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

                    {/* Right Panel: Flashcard Form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div
                            className="card"
                            style={{
                                minHeight: "450px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                border: "1px solid #E5E7EB",
                                transition: "all 0.3s ease",
                                position: "relative"
                            }}
                        >
                            {/* Progress Bar Atas */}
                            <div style={{ marginBottom: "1.5rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-moss-80)" }}>
                                        Skrining Mandiri
                                    </span>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-martini)" }}>
                                        {progressPercentage}%
                                    </span>
                                </div>
                                <div style={{ width: "100%", height: "6px", backgroundColor: "var(--color-linen)", borderRadius: "999px", overflow: "hidden" }}>
                                    <div style={{ width: `${progressPercentage}%`, height: "100%", backgroundColor: "var(--color-martini)", transition: "width 0.3s ease" }} />
                                </div>
                            </div>

                            {/* Konten Flashcard */}
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>

                                {/* Step 0: Deskripsi */}
                                {currentStep === 0 && (
                                    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-moss)" }}>
                                            Tuliskan Deskripsi Keluhan Kesehatan Anda
                                        </h3>
                                        <p style={{ fontSize: "0.8rem", color: "var(--color-moss-60)", lineHeight: 1.4 }}>
                                            Mohon berikan rincian mengenai gejala atau masalah kesehatan utama yang Anda rasakan secara detail.
                                        </p>
                                        <textarea
                                            required
                                            className="input"
                                            placeholder="Contoh: Nyeri menjalar dari pinggang bawah ke bokong kanan sejak 3 hari lalu..."
                                            rows={5}
                                            value={healthDescription}
                                            onChange={(e) => setHealthDescription(e.target.value)}
                                            style={{ resize: "none", width: "100%", marginTop: "0.5rem" }}
                                        />
                                    </div>
                                )}

                                {/* Pertanyaan Tahap 1 (Darurat) */}
                                {currentStep >= 1 && currentStep < 1 + TAHAP_1_EMERGENCY.length && (() => {
                                    const qIndex = currentStep - 1;
                                    const q = TAHAP_1_EMERGENCY[qIndex];
                                    return (
                                        <div className="animate-fade-in" style={{ textAlign: "center" }}>
                                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-moss)", marginTop: "0.75rem", lineHeight: 1.4, minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {q.label}
                                            </h3>
                                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
                                                <button type="button" onClick={() => handleAnswer(q.id, "ya", 1)} style={buttonYaStyle}>Ya</button>
                                                <button type="button" onClick={() => handleAnswer(q.id, "tidak", 1)} style={buttonTidakStyle}>Tidak</button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Pertanyaan Tahap 2 (Mendesak) */}
                                {currentStep >= 1 + TAHAP_1_EMERGENCY.length && currentStep < 1 + TAHAP_1_EMERGENCY.length + TAHAP_2_URGENT.length && (() => {
                                    const qIndex = currentStep - (1 + TAHAP_1_EMERGENCY.length);
                                    const q = TAHAP_2_URGENT[qIndex];
                                    return (
                                        <div className="animate-fade-in" style={{ textAlign: "center" }}>
                                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-moss)", marginTop: "0.75rem", lineHeight: 1.4, minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {q.label}
                                            </h3>
                                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
                                                <button type="button" onClick={() => handleAnswer(q.id, "ya", 2)} style={buttonYaStyle}>Ya</button>
                                                <button type="button" onClick={() => handleAnswer(q.id, "tidak", 2)} style={buttonTidakStyle}>Tidak</button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Pertanyaan Tahap 3 (Kuning) */}
                                {currentStep >= 1 + TAHAP_1_EMERGENCY.length + TAHAP_2_URGENT.length && currentStep < totalSteps && (() => {
                                    const qIndex = currentStep - (1 + TAHAP_1_EMERGENCY.length + TAHAP_2_URGENT.length);
                                    const q = TAHAP_3_YELLOW[qIndex];
                                    return (
                                        <div className="animate-fade-in" style={{ textAlign: "center" }}>
                                            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-moss)", marginTop: "0.75rem", lineHeight: 1.4, minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {q.label}
                                            </h3>
                                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
                                                <button type="button" onClick={() => handleAnswer(q.id, "ya", 3)} style={buttonYaStyle}>Ya</button>
                                                <button type="button" onClick={() => handleAnswer(q.id, "tidak", 3)} style={buttonTidakStyle}>Tidak</button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Selesai & Hasil Akhir (Presented calmly only at the end) */}
                                {currentStep === totalSteps && (
                                    <div className="animate-fade-in" style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "var(--color-linen)", color: "var(--color-martini)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem" }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>

                                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-moss)" }}>Skrining Selesai</h3>

                                        {/* Triage Feedback - Reassured and Non-Threatening */}
                                        {finalStatus === "MERAH_DARURAT" && (
                                            <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", padding: "1rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--color-moss)", textAlign: "left", lineHeight: 1.5 }}>
                                                <strong>Catatan Kesehatan:</strong> Demi kenyamanan dan keselamatan Anda, beberapa keluhan yang terdeteksi membutuhkan pemeriksaan medis terlebih dahulu. Kami sangat menyarankan Anda berkonsultasi dengan dokter atau unit kesehatan terdekat sebelum menjadwalkan sesi terapi fisik atau pijat.
                                            </div>
                                        )}

                                        {finalStatus === "MERAH_MENDESAK" && (
                                            <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", padding: "1rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--color-moss)", textAlign: "left", lineHeight: 1.5 }}>
                                                <strong>Saran Kami:</strong> Keluhan yang Anda rasakan sebaiknya dievaluasi secara langsung oleh dokter terlebih dahulu agar terapi pendukung ke depan dapat dirancang dengan aman dan optimal untuk Anda.
                                            </div>
                                        )}

                                        {finalStatus === "KUNING" && (
                                            <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", padding: "1rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--color-moss)", textAlign: "left", lineHeight: 1.5 }}>
                                                <strong>Informasi:</strong> Tim kami akan meninjau catatan kesehatan Anda untuk menyesuaikan metode terapi yang paling aman dan nyaman sesuai dengan kondisi fisik Anda saat ini.
                                            </div>
                                        )}

                                        {finalStatus === "HIJAU" && (
                                            <p style={{ fontSize: "0.8rem", color: "var(--color-moss-60)", lineHeight: 1.5 }}>
                                                Semua data skrining mandiri telah lengkap. Hasil pemetaan siap dikirimkan kepada tim kami untuk persiapan sesi Anda.
                                            </p>
                                        )}

                                        <button
                                            onClick={handleSubmitForm}
                                            disabled={isSubmitting || paintedPoints.length === 0}
                                            className="btn-primary"
                                            style={{
                                                width: "100%",
                                                padding: "0.85rem 1.5rem",
                                                fontSize: "1rem",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                marginTop: "0.5rem"
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                                                    Mengirim...
                                                </>
                                            ) : (
                                                <>Kirim Assessment</>
                                            )}
                                        </button>
                                        {paintedPoints.length === 0 && (
                                            <p style={{ fontSize: "0.75rem", color: "red", marginTop: "-0.25rem" }}>
                                                * Harap tandai setidaknya satu titik nyeri pada model 3D sebelum mengirim.
                                            </p>
                                        )}
                                    </div>
                                )}

                            </div>

                            {/* Tombol Navigasi Bawah */}
                            {currentStep < totalSteps && (
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #F3F4F6" }}>
                                    <button
                                        type="button"
                                        onClick={handleBackStep}
                                        disabled={currentStep === 0}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: currentStep === 0 ? "#D1D5DB" : "var(--color-moss-60)",
                                            cursor: currentStep === 0 ? "not-allowed" : "pointer",
                                            fontSize: "0.85rem",
                                            fontWeight: 600
                                        }}
                                    >
                                        ← Kembali
                                    </button>

                                    {currentStep === 0 && (
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "var(--color-martini)",
                                                cursor: "pointer",
                                                fontSize: "0.85rem",
                                                fontWeight: 700
                                            }}
                                        >
                                            Lanjut →
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}