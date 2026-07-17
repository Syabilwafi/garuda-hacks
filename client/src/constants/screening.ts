export const SCREENING_STAGES = {
  STAGE_1_EMERGENCY: "EMERGENCY",
  STAGE_2_URGENT: "URGENT",
  STAGE_3_YELLOW: "YELLOW",
} as const;

export const TRIAGE_STATUS = {
  GREEN: "GREEN",
  YELLOW: "YELLOW",
  RED_URGENT: "RED_URGENT",
  RED_EMERGENCY: "RED_EMERGENCY",
} as const;

export const TAHAP_1_EMERGENCY = [
  { id: "t1_1", label: "Do you experience chest pain or shortness of breath?" },
  { id: "t1_2", label: "Have you suddenly lost strength in your hands or feet?" },
  { id: "t1_3", label: "Have you lost control of bowel or bladder function?" },
  { id: "t1_4", label: "Do you experience numbness around the genitals, buttocks, or inner thighs?" },
  { id: "t1_5", label: "Did the pain appear after an accident or serious impact?" },
  { id: "t1_6", label: "Is one leg suddenly swollen, red, warm, and painful?" },
] as const;

export const TAHAP_2_URGENT = [
  { id: "t2_1", label: "Do you have fever or chills?" },
  { id: "t2_2", label: "Is the area red, hot, or swollen?" },
  { id: "t2_3", label: "Is there an open wound or infection?" },
  { id: "t2_4", label: "Have you lost weight without planning to?" },
  { id: "t2_5", label: "Do you have a history of cancer and now experience new pain?" },
  { id: "t2_6", label: "Is the pain getting worse or waking you up every night?" },
  { id: "t2_7", label: "Are you unable to walk or use that body part?" },
] as const;

export const TAHAP_3_YELLOW = [
  { id: "t3_1", label: "Are you pregnant?" },
  { id: "t3_2", label: "Do you have osteoporosis?" },
  { id: "t3_3", label: "Are you taking blood thinners?" },
  { id: "t3_4", label: "Have you recently had surgery?" },
  { id: "t3_5", label: "Do you experience tingling or mild numbness?" },
  { id: "t3_6", label: "Do you have diabetes or sensory disorder?" },
  { id: "t3_7", label: "Do you have an implant in the affected area?" },
] as const;

export const SCREENING_INTENSITY_THRESHOLD = 7;
export const SCREENING_DEBOUNCE_MS = 300;
