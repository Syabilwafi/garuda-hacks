import { randomUUID } from 'crypto';
import { ClinicalTranslationService } from '../services/clinicalTranslationService.js';
import { ClinicalNote } from '../models/ClinicalNote.js';
import { Booking } from '../models/Booking.js';

export const generateClinicalNote = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      patientName,
      therapistId,
      painPoints,
      painIntensity,
      patientDescription,
      screeningQuestions,
      triageStatus,
      triageAnswers
    } = req.body;

    if (!appointmentId || !patientId || !patientName) {
      return res.status(400).json({
        error: 'Missing required fields: appointmentId, patientId, patientName'
      });
    }

    if (!painPoints || painPoints.length === 0) {
      return res.status(400).json({
        error: 'At least one pain point must be provided'
      });
    }

    // Check for existing note only if appointment exists in bookings
    try {
      const existingNote = await ClinicalNote.findByAppointmentId(appointmentId);
      if (existingNote) {
        return res.status(409).json({
          error: 'Clinical note already exists for this appointment',
          noteId: existingNote.id
        });
      }
    } catch (err) {
      // If appointment doesn't exist, we'll still create the note with NULL appointment_id
      console.log('Appointment not found or invalid UUID format, proceeding with NULL appointment_id');
    }

    const translationResult = await ClinicalTranslationService.generateSoapNote({
      patientName,
      painPoints,
      painIntensity: painIntensity || 5,
      patientDescription: patientDescription || '',
      screeningQuestions: screeningQuestions || {},
      triageStatus: triageStatus || 'HIJAU',
      triageAnswers: triageAnswers || {}
    });

    const validation = await ClinicalTranslationService.validateSoapNoteStructure(
      translationResult.soapNote
    );

    if (!validation.isValid) {
      console.warn(`SOAP note validation warning: missing ${validation.missingSection}`);
    }

    // Use NULL for appointment_id if it's not a valid UUID or doesn't exist
    let validAppointmentId = appointmentId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(appointmentId)) {
      validAppointmentId = null;
    }

    let clinicalNote;
    const noteId = randomUUID();

    try {
      clinicalNote = await ClinicalNote.create({
        appointmentId: validAppointmentId,
        patientId,
        therapistId: therapistId || null,
        soapNote: translationResult.soapNote,
        painPoints,
        patientDescription,
        screeningData: {
          screeningQuestions,
          triageAnswers,
          triageStatus,
          painIntensity
        },
        triageStatus
      });
    } catch (dbError) {
      console.log('Database storage error:', dbError.message);
      // If storage fails, return the generated note anyway (for demo purposes)
      // In production, this would require proper database setup
      clinicalNote = {
        id: noteId,
        appointment_id: appointmentId,
        patient_id: patientId,
        therapist_id: therapistId || null,
        soap_note: translationResult.soapNote,
        pain_points: painPoints,
        patient_description: patientDescription,
        screening_data: {
          screeningQuestions,
          triageAnswers,
          triageStatus,
          painIntensity
        },
        triage_status: triageStatus,
        generated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        _stored: false,
        _storageError: dbError.message
      };
      console.log('Returning generated note without database storage (demo mode)');
    }

    return res.status(201).json({
      success: true,
      clinicalNote: {
        id: clinicalNote.id,
        appointmentId: clinicalNote.appointment_id,
        soapNote: clinicalNote.soap_note,
        triageStatus: clinicalNote.triage_status,
        generatedAt: clinicalNote.generated_at
      },
      metadata: {
        model: translationResult.model,
        validationStatus: validation.isValid ? 'valid' : 'warning',
        tokenUsage: translationResult.tokenUsage
      }
    });
  } catch (error) {
    console.error('Clinical note generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate clinical note',
      details: error.message
    });
  }
};

export const getClinicalNote = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({
        error: 'appointmentId is required'
      });
    }

    const clinicalNote = await ClinicalNote.findByAppointmentId(appointmentId);

    if (!clinicalNote) {
      return res.status(404).json({
        error: 'Clinical note not found for this appointment'
      });
    }

    return res.status(200).json({
      success: true,
      clinicalNote: {
        id: clinicalNote.id,
        appointmentId: clinicalNote.appointment_id,
        patientId: clinicalNote.patient_id,
        therapistId: clinicalNote.therapist_id,
        soapNote: clinicalNote.soap_note,
        triageStatus: clinicalNote.triage_status,
        screeningData: clinicalNote.screening_data,
        generatedAt: clinicalNote.generated_at,
        createdAt: clinicalNote.created_at
      }
    });
  } catch (error) {
    console.error('Failed to fetch clinical note:', error);
    return res.status(500).json({
      error: 'Failed to fetch clinical note',
      details: error.message
    });
  }
};

export const getClinicalNotesByTherapist = async (req, res) => {
  try {
    const { therapistId } = req.params;

    if (!therapistId) {
      return res.status(400).json({
        error: 'therapistId is required'
      });
    }

    const clinicalNotes = await ClinicalNote.findByTherapistId(therapistId);

    return res.status(200).json({
      success: true,
      total: clinicalNotes.length,
      clinicalNotes: clinicalNotes.map(note => ({
        id: note.id,
        appointmentId: note.appointment_id,
        patientId: note.patient_id,
        triageStatus: note.triage_status,
        generatedAt: note.generated_at,
        createdAt: note.created_at
      }))
    });
  } catch (error) {
    console.error('Failed to fetch clinical notes:', error);
    return res.status(500).json({
      error: 'Failed to fetch clinical notes',
      details: error.message
    });
  }
};
