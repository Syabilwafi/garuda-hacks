import { supabase } from '../config/supabase.js';

export const ClinicalNote = {
  async create(noteData) {
    const {
      appointmentId,
      patientId,
      therapistId,
      soapNote,
      painPoints,
      patientDescription,
      screeningData,
      triageStatus
    } = noteData;

    const { data, error } = await supabase
      .from('clinical_notes')
      .insert({
        appointment_id: appointmentId,
        patient_id: patientId,
        therapist_id: therapistId,
        soap_note: soapNote,
        pain_points: painPoints,
        patient_description: patientDescription,
        screening_data: screeningData,
        triage_status: triageStatus,
        generated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create clinical note: ${error.message}`);
    }

    return data;
  },

  async findByAppointmentId(appointmentId) {
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find clinical note: ${error.message}`);
    }

    return data;
  },

  async findByPatientId(patientId) {
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find clinical notes: ${error.message}`);
    }

    return data || [];
  },

  async findByTherapistId(therapistId) {
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('therapist_id', therapistId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find clinical notes: ${error.message}`);
    }

    return data || [];
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find clinical note: ${error.message}`);
    }

    return data;
  },

  async updateNoteByAppointmentId(appointmentId, updates) {
    const { data, error } = await supabase
      .from('clinical_notes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('appointment_id', appointmentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update clinical note: ${error.message}`);
    }

    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('clinical_notes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete clinical note: ${error.message}`);
    }
  }
};
