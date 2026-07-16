import type { PainType } from "@/components/ui/PainTypeSelector";
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
      complaint: "Nyeri tumpul di area Cervical & Trapezius dekstra",
      indication: "Ketegangan otot servikal — kemungkinan akibat postur buruk atau kelelahan berlebih",
      affectedAreas: ["Cervical", "Trapezius Dextra", "Levator Scapulae"],
    },
    traditional: {
      highlightedNodes: [
        { id: "shoulder-back-01", label: "Titik Pundak Belakang (Jianjing)", coordinate3D: { x: 0.15, y: 1.4, z: -0.05 } },
        { id: "thumb-base-01", label: "Pangkal Ibu Jari (Hegu)", coordinate3D: { x: 0.35, y: 0.7, z: 0.1 } },
        { id: "neck-side-01", label: "Titik Leher Samping (Fengchi)", coordinate3D: { x: 0.08, y: 1.62, z: -0.12 } },
      ],
      instructions: "Pijat ringan secara melingkar pada area pundak belakang selama 3-5 menit. Tekan titik pangkal ibu jari dengan ibu jari tangan berlawanan. Hindari tekanan keras.",
      contraindications: [
        "Jangan pijat langsung di area tulang belakang bagian leher.",
        "Hindari pijatan kuat jika terdapat rasa kebas atau kesemutan.",
        "Konsultasikan ke dokter jika nyeri berlangsung lebih dari 3 hari.",
      ],
    },
  },
  SHARP: {
    medical: {
      complaint: "Nyeri tajam di area lumbar dan punggung bawah",
      indication: "Kemungkinan strain otot erector spinae atau iritasi sendi facet",
      affectedAreas: ["Lumbar L4-L5", "Erector Spinae", "Quadratus Lumborum"],
    },
    traditional: {
      highlightedNodes: [
        { id: "lower-back-01", label: "Titik Punggung Bawah (Shenshu)", coordinate3D: { x: 0.08, y: 0.9, z: -0.15 } },
        { id: "foot-sole-01", label: "Telapak Kaki (Yongquan)", coordinate3D: { x: 0.1, y: 0.05, z: 0.05 } },
      ],
      instructions: "Kompres hangat pada area punggung bawah selama 15 menit. Pijat lembut titik Shenshu di kedua sisi tulang belakang pinggang.",
      contraindications: [
        "Jangan dipijat jika nyeri disertai rasa lemah pada kaki.",
        "Hindari gerakan membungkuk mendadak.",
        "Segera ke dokter jika nyeri menjalar ke tungkai.",
      ],
    },
  },
  BURNING: {
    medical: {
      complaint: "Sensasi panas dan terbakar di area bahu dan lengan atas",
      indication: "Kemungkinan iritasi saraf perifer (neuralgia) atau tendinitis rotator cuff",
      affectedAreas: ["Deltoid", "Rotator Cuff", "Supraspinatus"],
    },
    traditional: {
      highlightedNodes: [
        { id: "shoulder-front-01", label: "Titik Bahu Depan (Jianyu)", coordinate3D: { x: 0.18, y: 1.3, z: 0.1 } },
        { id: "elbow-01", label: "Titik Siku (Quchi)", coordinate3D: { x: 0.3, y: 1.1, z: 0.05 } },
      ],
      instructions: "Kompres dingin pada area bahu yang panas selama 10-15 menit. Lakukan peregangan ringan dengan gerakan melingkar pada sendi bahu.",
      contraindications: [
        "Jangan lakukan pijatan pada area yang terasa sangat panas atau bengkak.",
        "Hindari aktivitas mengangkat beban berat.",
      ],
    },
  },
  THROBBING: {
    medical: {
      complaint: "Nyeri berdenyut di area kepala dan leher",
      indication: "Kemungkinan tension headache atau migrain yang terkait ketegangan otot servikal",
      affectedAreas: ["Temporalis", "Occipitalis", "Sternocleidomastoid"],
    },
    traditional: {
      highlightedNodes: [
        { id: "temple-01", label: "Titik Pelipis (Taiyang)", coordinate3D: { x: 0.1, y: 1.7, z: 0.1 } },
        { id: "crown-01", label: "Titik Puncak Kepala (Baihui)", coordinate3D: { x: 0, y: 1.8, z: 0 } },
        { id: "between-eyes-01", label: "Titik Diantara Alis (Yintang)", coordinate3D: { x: 0, y: 1.68, z: 0.1 } },
      ],
      instructions: "Tekan lembut titik Taiyang di kedua sisi pelipis secara bersamaan. Pijat melingkar pada puncak kepala. Istirahat di ruangan dengan pencahayaan redup.",
      contraindications: [
        "Jangan tekan terlalu keras pada area kepala.",
        "Hindari pijatan jika sakit kepala sangat parah atau mendadak.",
        "Segera ke IGD jika sakit kepala terburuk yang pernah dirasakan.",
      ],
    },
  },
  PRESSURE: {
    medical: {
      complaint: "Rasa tekanan dan sesak di area dada atas dan punggung tengah",
      indication: "Kemungkinan ketegangan otot intercostal atau postur kyphosis",
      affectedAreas: ["Pectoralis Minor", "Rhomboids", "Thoracic T4-T6"],
    },
    traditional: {
      highlightedNodes: [
        { id: "chest-center-01", label: "Titik Tengah Dada (Shanzhong)", coordinate3D: { x: 0, y: 1.25, z: 0.12 } },
        { id: "upper-back-01", label: "Titik Punggung Tengah (Feishu)", coordinate3D: { x: 0.06, y: 1.2, z: -0.13 } },
      ],
      instructions: "Tarik napas dalam dan perlahan. Pijat lembut titik tengah dada dengan jari telunjuk. Lakukan peregangan dada dengan membuka kedua lengan ke samping.",
      contraindications: [
        "SEGERA ke dokter jika disertai sesak napas berat, keringat dingin, atau nyeri menjalar ke lengan kiri.",
        "Jangan abaikan nyeri dada yang tidak kunjung hilang.",
      ],
    },
  },
};
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
export async function generateAssessment(
  patientId: string,
  painMarks: PainMark[]
): Promise<AssessmentResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/assessment/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, painMarks }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(
      "[assessmentApi] Backend tidak tersedia, menggunakan fallback mock:",
      error
    );
    const primaryPainType = painMarks[0]?.painType ?? "DULL_ACHE";
    const mockData = MOCK_RESPONSES[primaryPainType] ?? MOCK_RESPONSES.DULL_ACHE;
    await new Promise((r) => setTimeout(r, 1800));
    return mockData;
  }
}
