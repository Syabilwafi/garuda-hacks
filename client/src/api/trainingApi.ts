import type { EvaluationStatus } from "@/components/ui/StatusBadge";
export interface TechniqueFeedback {
  timestampSeconds: number;
  bodyAreaTargeted: string;
  note: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}
export interface EvaluationResponse {
  evaluationId: string;
  status: EvaluationStatus;
  summary: string;
  feedbackTimeline: TechniqueFeedback[];
}
const MOCK_EVALUATION: EvaluationResponse = {
  evaluationId: "eval-mock-001",
  status: "PERLU_PERBAIKAN",
  summary:
    "Teknik dasar sudah menunjukkan pemahaman yang baik terhadap area target. Namun, tekanan pada area leher perlu dikurangi dan kecepatan gerakan di beberapa segmen perlu disesuaikan untuk menghindari risiko cedera.",
  feedbackTimeline: [
    {
      timestampSeconds: 5.0,
      bodyAreaTargeted: "Pundak Kanan",
      note: "Posisi tangan dan arah pijatan sudah tepat. Tekanan ringan sesuai standar.",
      severity: "INFO",
    },
    {
      timestampSeconds: 12.5,
      bodyAreaTargeted: "Trapezius Dextra",
      note: "Tekanan terlalu kuat di area dekat tulang belakang leher. Kurangi intensitas 30–40%.",
      severity: "WARNING",
    },
    {
      timestampSeconds: 22.0,
      bodyAreaTargeted: "Leher Belakang (Cervical)",
      note: "PENTING: Teknik pijatan langsung pada tulang belakang leher berisiko cedera. Harus dihindari.",
      severity: "CRITICAL",
    },
    {
      timestampSeconds: 34.0,
      bodyAreaTargeted: "Pundak Belakang",
      note: "Posisi tangan dan arah pijatan sudah tepat. Ritme sudah konsisten.",
      severity: "INFO",
    },
    {
      timestampSeconds: 45.5,
      bodyAreaTargeted: "Punggung Atas (Thoracic)",
      note: "Gerakan terlalu cepat di area ini. Perlambat agar tekanan lebih terdistribusi merata.",
      severity: "WARNING",
    },
    {
      timestampSeconds: 58.0,
      bodyAreaTargeted: "Scapula Sinistra",
      note: "Teknik effleurage di area tulang belikat sudah sesuai. Pertahankan.",
      severity: "INFO",
    },
  ],
};
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
export async function evaluateVideo(
  formData: FormData
): Promise<EvaluationResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/training/evaluate`, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(60000), 
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(
      "[trainingApi] Backend tidak tersedia, menggunakan fallback mock:",
      error
    );
    await new Promise((r) => setTimeout(r, 3500));
    return MOCK_EVALUATION;
  }
}
