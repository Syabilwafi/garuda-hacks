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

// Mock storage for clinical notes
let clinicalNotesStorage: Record<string, ClinicalNoteDetail> = {};

const generateMockSOAPNote = (payload: ClinicalNoteRequest): string => {
  return `# SOAP Note - Clinical Assessment

## SUBJECTIVE
**Patient Name:** ${payload.patientName}
**Chief Complaint:** ${payload.patientDescription}
**Pain Intensity:** ${payload.painIntensity}/10

The patient reports pain in the following areas:
${payload.painPoints.map(p => `- ${p.location} (${p.painType})`).join('\n')}

## OBJECTIVE
**Vital Assessment:**
- Triage Status: ${payload.triageStatus}
- Pain Type Distribution: ${Array.from(new Set(payload.painPoints.map(p => p.painType))).join(', ')}
- Number of Affected Areas: ${payload.painPoints.length}

**Physical Examination Findings:**
- Range of motion: Within normal limits (with patient-reported pain)
- Muscle tension: Present in affected areas
- Palpation: Tenderness noted

## ASSESSMENT
**Medical Diagnosis:** Musculoskeletal pain syndrome with multiple affected areas
**Triage Classification:** ${payload.triageStatus}
**Affected Anatomical Regions:** ${payload.painPoints.map(p => p.location).join(', ')}

**Clinical Impression:**
Patient presents with ${payload.painIntensity >= 7 ? 'severe' : payload.painIntensity >= 4 ? 'moderate' : 'mild'} musculoskeletal pain affecting multiple body regions. Physical examination reveals muscle tension and tenderness in affected areas. Patient stability and vital signs appear stable for therapeutic intervention.

## PLAN
**Recommended Treatment Approach:**
1. Initial conservative management with appropriate massage therapy techniques
2. Focus on affected areas for pain relief and muscle relaxation
3. Patient education on posture and self-care strategies
4. Follow-up assessment after 2-3 sessions

**Therapeutic Recommendations:**
- Massage therapy focusing on affected regions
- Gentle stretching exercises
- Heat application to reduce muscle tension
- Lifestyle modifications to prevent symptom recurrence

**Safety Precautions:** As noted in triage screening, appropriate contraindications have been assessed.

---
*Generated: ${new Date().toLocaleString()}*
*Note: This is a clinical assessment based on patient-reported symptoms and initial screening. Further evaluation by qualified healthcare providers may be necessary for definitive diagnosis.*`;
};

export async function generateClinicalNote(
  payload: ClinicalNoteRequest
): Promise<ClinicalNoteResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const noteId = `CN-${Date.now()}`;
      const soapNote = generateMockSOAPNote(payload);

      const clinicalNote: ClinicalNoteDetail = {
        success: true,
        clinicalNote: {
          id: noteId,
          appointmentId: payload.appointmentId,
          patientId: payload.patientId,
          therapistId: payload.therapistId,
          soapNote: soapNote,
          triageStatus: payload.triageStatus,
          screeningData: {
            screeningQuestions: payload.screeningQuestions,
            triageAnswers: payload.triageAnswers,
            triageStatus: payload.triageStatus,
            painIntensity: payload.painIntensity
          },
          generatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      };

      clinicalNotesStorage[payload.appointmentId] = clinicalNote;

      resolve({
        success: true,
        clinicalNote: {
          id: noteId,
          appointmentId: payload.appointmentId,
          soapNote: soapNote,
          triageStatus: payload.triageStatus,
          generatedAt: new Date().toISOString()
        },
        metadata: {
          model: "mock-clinical-generator",
          validationStatus: "VALID",
          tokenUsage: { prompt_tokens: 0, completion_tokens: 0 }
        }
      });
    }, 1000);
  });
}

export async function getClinicalNote(
  appointmentId: string
): Promise<ClinicalNoteDetail> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (clinicalNotesStorage[appointmentId]) {
        resolve(clinicalNotesStorage[appointmentId]);
      } else {
        reject(new Error("Clinical note not found. Please submit an assessment first."));
      }
    }, 300);
  });
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
  return new Promise((resolve) => {
    setTimeout(() => {
      const notes = Object.values(clinicalNotesStorage)
        .filter(note => note.clinicalNote.therapistId === therapistId)
        .map(note => ({
          id: note.clinicalNote.id,
          appointmentId: note.clinicalNote.appointmentId,
          patientId: note.clinicalNote.patientId,
          triageStatus: note.clinicalNote.triageStatus,
          generatedAt: note.clinicalNote.generatedAt,
          createdAt: note.clinicalNote.createdAt
        }));

      resolve({
        success: true,
        total: notes.length,
        clinicalNotes: notes
      });
    }, 300);
  });
}
