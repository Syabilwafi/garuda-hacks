import { apiClient, delay } from "@/utils";
import { API_CONFIG } from "@/constants";

export interface PainPoint {
  location: string;
  painType: string;
  intensity?: number;
}

export interface ScreeningData {
  screeningQuestions: Record<string, string>;
  triageAnswers: Record<string, string>;
  triageStatus: string;
  painIntensity: number;
}

export interface ClinicalNoteRequest {
  appointmentId: string;
  patientId: string;
  patientName: string;
  therapistId?: string;
  painPoints: PainPoint[];
  painIntensity: number;
  patientDescription: string;
  screeningQuestions: Record<string, string>;
  triageStatus: string;
  triageAnswers: Record<string, string>;
}

export interface ClinicalNoteResponse {
  success: boolean;
  clinicalNote: {
    id: string;
    appointmentId: string;
    soapNote: string;
    triageStatus: string;
    generatedAt: string;
  };
  metadata: {
    model: string;
    validationStatus: string;
    tokenUsage: Record<string, unknown>;
  };
}

export interface ClinicalNoteDetail {
  success: boolean;
  clinicalNote: {
    id: string;
    appointmentId: string;
    patientId: string;
    therapistId?: string;
    soapNote: string;
    triageStatus: string;
    screeningData: ScreeningData;
    generatedAt: string;
    createdAt: string;
  };
}

export async function generateClinicalNote(
  payload: ClinicalNoteRequest
): Promise<ClinicalNoteResponse> {
  try {
    return await apiClient<ClinicalNoteResponse>(
      `${API_CONFIG.BASE_URL}/api/clinical/translate`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  } catch (error) {
    console.error("[clinicalApi] Failed to generate clinical note:", error);
    throw error;
  }
}

export async function getClinicalNote(
  appointmentId: string
): Promise<ClinicalNoteDetail> {
  try {
    return await apiClient<ClinicalNoteDetail>(
      `${API_CONFIG.BASE_URL}/api/clinical/appointment/${appointmentId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("[clinicalApi] Failed to fetch clinical note:", error);
    throw error;
  }
}

export async function getClinicalNotesByTherapist(
  therapistId: string
): Promise<{
  success: boolean;
  total: number;
  clinicalNotes: Array<{
    id: string;
    appointmentId: string;
    patientId: string;
    triageStatus: string;
    generatedAt: string;
    createdAt: string;
  }>;
}> {
  try {
    return await apiClient(
      `${API_CONFIG.BASE_URL}/api/clinical/therapist/${therapistId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error(
      "[clinicalApi] Failed to fetch therapist clinical notes:",
      error
    );
    throw error;
  }
}
