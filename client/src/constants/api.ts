export const API_CONFIG = {
  TIMEOUT_MS: 15000,
  MOCK_DELAY_MS: 1800,
  ASSESSMENT_ENDPOINT: "/api/assessment/generate",
  TRAINING_EVALUATE_ENDPOINT: "/api/training/evaluate",
  VIDEO_PROCESS_TIMEOUT_MS: 30000,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Connection unavailable. Using saved data.",
  ASSESSMENT_FAILED: "Failed to create assessment. Please try again.",
  VIDEO_UPLOAD_FAILED: "Failed to upload video. Please try again.",
  INVALID_INPUT: "Invalid input. Please check your data again.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
} as const;

export const SUCCESS_MESSAGES = {
  ASSESSMENT_CREATED: "Assessment created successfully!",
  VIDEO_UPLOADED: "Video uploaded and processed successfully.",
} as const;
