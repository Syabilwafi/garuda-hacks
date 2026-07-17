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
    "Basic technique shows good understanding of the target area. However, pressure on the neck area needs to be reduced and movement speed in some segments needs adjustment to avoid injury risk.",
  feedbackTimeline: [
    {
      timestampSeconds: 5.0,
      bodyAreaTargeted: "Right Shoulder",
      note: "Hand position and massage direction are correct. Light pressure as per standard.",
      severity: "INFO",
    },
    {
      timestampSeconds: 12.5,
      bodyAreaTargeted: "Right Trapezius",
      note: "Pressure too strong near the neck spine. Reduce intensity by 30–40%.",
      severity: "WARNING",
    },
    {
      timestampSeconds: 22.0,
      bodyAreaTargeted: "Neck (Cervical)",
      note: "IMPORTANT: Direct massage technique on the neck spine risks injury. Must be avoided.",
      severity: "CRITICAL",
    },
    {
      timestampSeconds: 34.0,
      bodyAreaTargeted: "Back Shoulder",
      note: "Hand position and massage direction are correct. Rhythm is consistent.",
      severity: "INFO",
    },
    {
      timestampSeconds: 45.5,
      bodyAreaTargeted: "Upper Back (Thoracic)",
      note: "Movement too fast in this area. Slow down for more even pressure distribution.",
      severity: "WARNING",
    },
    {
      timestampSeconds: 58.0,
      bodyAreaTargeted: "Left Scapula",
      note: "Effleurage technique on the scapular area is appropriate. Maintain it.",
      severity: "INFO",
    },
  ],
};

export async function evaluateVideo(
  formData: FormData
): Promise<EvaluationResponse> {
  // Using mock evaluation data instead of backend
  await new Promise((r) => setTimeout(r, 2000));
  return MOCK_EVALUATION;
}
