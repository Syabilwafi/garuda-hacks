import type { PainType } from "@/components/ui/PainTypeSelector";
import { apiClient, delay } from "@/utils";
import { API_CONFIG, ERROR_MESSAGES } from "@/constants";

export interface Coordinate3D {
  x: number;
  y: number;
  z: number;
}

export interface PainMark {
  coordinate3D: Coordinate3D;
  painType: PainType;
  intensity?: number;
}

export interface MedicalAssessment {
  complaint: string;
  indication: string;
  affectedAreas: string[];
}

export interface HighlightedNode {
  id: string;
  label: string;
  coordinate3D: Coordinate3D;
}

export interface TraditionalAssessment {
  highlightedNodes: HighlightedNode[];
  instructions: string;
  contraindications: string[];
}

export interface AssessmentResponse {
  medical: MedicalAssessment;
  traditional: TraditionalAssessment;
}

const MOCK_RESPONSES: Record<string, AssessmentResponse> = {
  DULL_ACHE: {
    medical: {
      complaint: "Dull pain in Cervical & Right Trapezius area",
      indication: "Cervical muscle tension — likely due to poor posture or excessive fatigue",
      affectedAreas: ["Cervical", "Trapezius Dextra", "Levator Scapulae"],
    },
    traditional: {
      highlightedNodes: [
        { id: "shoulder-back-01", label: "Shoulder Back Point (Jianjing)", coordinate3D: { x: 0.15, y: 1.4, z: -0.05 } },
        { id: "thumb-base-01", label: "Thumb Base Point (Hegu)", coordinate3D: { x: 0.35, y: 0.7, z: 0.1 } },
        { id: "neck-side-01", label: "Neck Side Point (Fengchi)", coordinate3D: { x: 0.08, y: 1.62, z: -0.12 } },
      ],
      instructions: "Massage gently in circular motions on the back shoulder area for 3-5 minutes. Press the thumb base point with the opposite hand's thumb. Avoid hard pressure.",
      contraindications: [
        "Do not massage directly on the neck spine.",
        "Avoid strong massage if there is numbness or tingling.",
        "Consult a doctor if pain persists for more than 3 days.",
      ],
    },
  },
  SHARP: {
    medical: {
      complaint: "Sharp pain in lumbar and lower back area",
      indication: "Possible strain of erector spinae muscle or facet joint irritation",
      affectedAreas: ["Lumbar L4-L5", "Erector Spinae", "Quadratus Lumborum"],
    },
    traditional: {
      highlightedNodes: [
        { id: "lower-back-01", label: "Lower Back Point (Shenshu)", coordinate3D: { x: 0.08, y: 0.9, z: -0.15 } },
        { id: "foot-sole-01", label: "Foot Sole Point (Yongquan)", coordinate3D: { x: 0.1, y: 0.05, z: 0.05 } },
      ],
      instructions: "Apply warm compress on the lower back area for 15 minutes. Gently massage the Shenshu point on both sides of the lumbar spine.",
      contraindications: [
        "Do not massage if pain is accompanied by weakness in the legs.",
        "Avoid sudden bending movements.",
        "See a doctor immediately if pain radiates to the limbs.",
      ],
    },
  },
  BURNING: {
    medical: {
      complaint: "Sensation of heat and burning in shoulder and upper arm area",
      indication: "Possible peripheral nerve irritation (neuralgia) or rotator cuff tendinitis",
      affectedAreas: ["Deltoid", "Rotator Cuff", "Supraspinatus"],
    },
    traditional: {
      highlightedNodes: [
        { id: "shoulder-front-01", label: "Front Shoulder Point (Jianyu)", coordinate3D: { x: 0.18, y: 1.3, z: 0.1 } },
        { id: "elbow-01", label: "Elbow Point (Quchi)", coordinate3D: { x: 0.3, y: 1.1, z: 0.05 } },
      ],
      instructions: "Apply cold compress on the hot shoulder area for 10-15 minutes. Perform light stretching with circular movements of the shoulder joint.",
      contraindications: [
        "Do not massage areas that feel very hot or swollen.",
        "Avoid activities involving lifting heavy loads.",
      ],
    },
  },
  THROBBING: {
    medical: {
      complaint: "Throbbing pain in head and neck area",
      indication: "Possible tension headache or migraine related to cervical muscle tension",
      affectedAreas: ["Temporalis", "Occipitalis", "Sternocleidomastoid"],
    },
    traditional: {
      highlightedNodes: [
        { id: "temple-01", label: "Temple Point (Taiyang)", coordinate3D: { x: 0.1, y: 1.7, z: 0.1 } },
        { id: "crown-01", label: "Crown Point (Baihui)", coordinate3D: { x: 0, y: 1.8, z: 0 } },
        { id: "between-eyes-01", label: "Between Eyebrows Point (Yintang)", coordinate3D: { x: 0, y: 1.68, z: 0.1 } },
      ],
      instructions: "Gently press the Taiyang points on both sides of the temples simultaneously. Massage in circular motions on the crown. Rest in a dimly lit room.",
      contraindications: [
        "Do not press too hard on the head area.",
        "Avoid massage if headache is severe or sudden.",
        "Go to the ER immediately if this is the worst headache you have ever experienced.",
      ],
    },
  },
  PRESSURE: {
    medical: {
      complaint: "Sensation of pressure and tightness in upper chest and mid-back area",
      indication: "Possible intercostal muscle tension or kyphotic posture",
      affectedAreas: ["Pectoralis Minor", "Rhomboids", "Thoracic T4-T6"],
    },
    traditional: {
      highlightedNodes: [
        { id: "chest-center-01", label: "Center Chest Point (Shanzhong)", coordinate3D: { x: 0, y: 1.25, z: 0.12 } },
        { id: "upper-back-01", label: "Mid-Back Point (Feishu)", coordinate3D: { x: 0.06, y: 1.2, z: -0.13 } },
      ],
      instructions: "Take deep and slow breaths. Gently massage the center chest point with your index finger. Perform chest stretching by opening both arms to the sides.",
      contraindications: [
        "SEE A DOCTOR IMMEDIATELY if accompanied by severe shortness of breath, cold sweat, or pain radiating to the left arm.",
        "Do not ignore chest pain that does not go away.",
      ],
    },
  },
};

function getMockResponse(painType: string): AssessmentResponse {
  return MOCK_RESPONSES[painType] ?? MOCK_RESPONSES.DULL_ACHE;
}

export async function generateAssessment(
  patientId: string,
  painMarks: PainMark[]
): Promise<AssessmentResponse> {
  try {
    return await apiClient<AssessmentResponse>(
      API_CONFIG.ASSESSMENT_ENDPOINT,
      {
        method: "POST",
        body: JSON.stringify({ patientId, painMarks }),
      }
    );
  } catch (error) {
    console.warn("[assessmentApi] Using fallback mock response:", error);
    const primaryPainType = painMarks[0]?.painType ?? "DULL_ACHE";
    const mockData = getMockResponse(primaryPainType);
    await delay(API_CONFIG.MOCK_DELAY_MS);
    return mockData;
  }
}
