import {
  TAHAP_1_EMERGENCY,
  TAHAP_2_URGENT,
  TAHAP_3_YELLOW,
  TRIAGE_STATUS,
  SCREENING_INTENSITY_THRESHOLD,
} from "@/constants";

export type TriageStatus = typeof TRIAGE_STATUS[keyof typeof TRIAGE_STATUS];

export const calculateTriageStatus = (
  hardStopStatus: TriageStatus | null,
  triageAnswers: Record<string, "ya" | "tidak">,
  selectedIntensity: number
): TriageStatus => {
  if (
    hardStopStatus === TRIAGE_STATUS.RED_EMERGENCY ||
    hardStopStatus === TRIAGE_STATUS.RED_URGENT
  ) {
    return hardStopStatus;
  }

  const hasStage3Yes = TAHAP_3_YELLOW.some((q) => triageAnswers[q.id] === "ya");
  const isPainSevere = selectedIntensity >= SCREENING_INTENSITY_THRESHOLD;

  if (hasStage3Yes || isPainSevere) {
    return TRIAGE_STATUS.YELLOW;
  }

  return TRIAGE_STATUS.GREEN;
};

export const getTotalScreeningSteps = (): number => {
  return 1 + TAHAP_1_EMERGENCY.length + TAHAP_2_URGENT.length + TAHAP_3_YELLOW.length;
};

export const getProgressPercentage = (currentStep: number): number => {
  return Math.round((currentStep / getTotalScreeningSteps()) * 100);
};

export const getTriageMessage = (
  status: TriageStatus
): { title: string; content: string } => {
  const messages: Record<TriageStatus, { title: string; content: string }> = {
    [TRIAGE_STATUS.RED_EMERGENCY]: {
      title: "Important Health Alert",
      content:
        "For your comfort and safety, some detected symptoms require medical examination first. We strongly recommend consulting a doctor or your nearest healthcare facility before scheduling physical therapy or massage sessions.",
    },
    [TRIAGE_STATUS.RED_URGENT]: {
      title: "Our Recommendation",
      content:
        "Your symptoms should be evaluated directly by a doctor first so that future supportive therapy can be designed safely and optimally for you.",
    },
    [TRIAGE_STATUS.YELLOW]: {
      title: "Information",
      content:
        "Our team will review your health records to adjust the safest and most comfortable therapy method according to your current physical condition.",
    },
    [TRIAGE_STATUS.GREEN]: {
      title: "Screening Status",
      content: "All self-screening data is complete. Mapping results are ready to be sent to our team for your session preparation.",
    },
  };

  return messages[status];
};
