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
      title: "Catatan Kesehatan Penting",
      content:
        "Demi kenyamanan dan keselamatan Anda, beberapa keluhan yang terdeteksi membutuhkan pemeriksaan medis terlebih dahulu. Kami sangat menyarankan Anda berkonsultasi dengan dokter atau unit kesehatan terdekat sebelum menjadwalkan sesi terapi fisik atau pijat.",
    },
    [TRIAGE_STATUS.RED_URGENT]: {
      title: "Saran Kami",
      content:
        "Keluhan yang Anda rasakan sebaiknya dievaluasi secara langsung oleh dokter terlebih dahulu agar terapi pendukung ke depan dapat dirancang dengan aman dan optimal untuk Anda.",
    },
    [TRIAGE_STATUS.YELLOW]: {
      title: "Informasi",
      content:
        "Tim kami akan meninjau catatan kesehatan Anda untuk menyesuaikan metode terapi yang paling aman dan nyaman sesuai dengan kondisi fisik Anda saat ini.",
    },
    [TRIAGE_STATUS.GREEN]: {
      title: "Status Screening",
      content: "Semua data skrining mandiri telah lengkap. Hasil pemetaan siap dikirimkan kepada tim kami untuk persiapan sesi Anda.",
    },
  };

  return messages[status];
};
