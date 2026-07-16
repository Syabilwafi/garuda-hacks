export const SCREENING_STAGES = {
  STAGE_1_EMERGENCY: "EMERGENCY",
  STAGE_2_URGENT: "URGENT",
  STAGE_3_YELLOW: "YELLOW",
} as const;

export const TRIAGE_STATUS = {
  GREEN: "HIJAU",
  YELLOW: "KUNING",
  RED_URGENT: "MERAH_MENDESAK",
  RED_EMERGENCY: "MERAH_DARURAT",
} as const;

export const TAHAP_1_EMERGENCY = [
  { id: "t1_1", label: "Apakah Anda mengalami nyeri dada atau sesak napas?" },
  { id: "t1_2", label: "Apakah Anda tiba-tiba kehilangan kekuatan pada tangan atau kaki?" },
  { id: "t1_3", label: "Apakah Anda kehilangan kontrol buang air kecil atau besar?" },
  { id: "t1_4", label: "Apakah Anda mengalami mati rasa di sekitar genital, bokong, atau paha dalam?" },
  { id: "t1_5", label: "Apakah nyeri muncul setelah kecelakaan atau benturan berat?" },
  { id: "t1_6", label: "Apakah salah satu kaki tiba-tiba bengkak, merah, hangat, dan nyeri?" },
] as const;

export const TAHAP_2_URGENT = [
  { id: "t2_1", label: "Apakah Anda demam atau menggigil?" },
  { id: "t2_2", label: "Apakah area nyeri merah, panas, atau membengkak?" },
  { id: "t2_3", label: "Apakah terdapat luka terbuka atau infeksi?" },
  { id: "t2_4", label: "Apakah berat badan turun tanpa direncanakan?" },
  { id: "t2_5", label: "Apakah Anda memiliki riwayat kanker dan sekarang mengalami nyeri baru?" },
  { id: "t2_6", label: "Apakah nyeri terus memburuk atau membangunkan Anda setiap malam?" },
  { id: "t2_7", label: "Apakah Anda tidak dapat berjalan atau menggunakan bagian tubuh tersebut?" },
] as const;

export const TAHAP_3_YELLOW = [
  { id: "t3_1", label: "Apakah Anda sedang hamil?" },
  { id: "t3_2", label: "Apakah Anda memiliki osteoporosis?" },
  { id: "t3_3", label: "Apakah Anda menggunakan pengencer darah?" },
  { id: "t3_4", label: "Apakah Anda baru menjalani operasi?" },
  { id: "t3_5", label: "Apakah Anda mengalami kesemutan atau mati rasa ringan?" },
  { id: "t3_6", label: "Apakah Anda memiliki diabetes atau gangguan sensasi?" },
  { id: "t3_7", label: "Apakah Anda memiliki implan pada area keluhan?" },
] as const;

export const SCREENING_INTENSITY_THRESHOLD = 7;
export const SCREENING_DEBOUNCE_MS = 300;
