export const API_CONFIG = {
  TIMEOUT_MS: 15000,
  MOCK_DELAY_MS: 1800,
  ASSESSMENT_ENDPOINT: "/api/assessment/generate",
  TRAINING_EVALUATE_ENDPOINT: "/api/training/evaluate",
  VIDEO_PROCESS_TIMEOUT_MS: 30000,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Koneksi tidak tersedia. Menggunakan data tersimpan.",
  ASSESSMENT_FAILED: "Gagal membuat assessment. Silakan coba lagi.",
  VIDEO_UPLOAD_FAILED: "Gagal mengunggah video. Silakan coba lagi.",
  INVALID_INPUT: "Input tidak valid. Silakan periksa kembali data Anda.",
  SERVER_ERROR: "Server mengalami kesalahan. Silakan coba lagi nanti.",
} as const;

export const SUCCESS_MESSAGES = {
  ASSESSMENT_CREATED: "Assessment berhasil dibuat!",
  VIDEO_UPLOADED: "Video berhasil diunggah dan diproses.",
} as const;
