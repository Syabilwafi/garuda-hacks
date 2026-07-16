import { supabase } from '../config/supabase.js';

export const Therapist = {
    async create(therapistData) {
        const { email, password, fullName, phoneNumber, specialization, licenseNumber, yearsOfExperience } = therapistData;

        const { data, error } = await supabase
            .from('therapists')
            .insert({
                email,
                password_hash: password,
                full_name: fullName,
                phone_number: phoneNumber,
                specialization,
                license_number: licenseNumber,
                years_of_experience: yearsOfExperience,
                role: 'THERAPIST',
                created_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create therapist: ${error.message}`);
        }

        return data;
    },

    async findByEmail(email) {
        const { data, error } = await supabase
            .from('therapists')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(`Failed to find therapist: ${error.message}`);
        }

        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('therapists')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(`Failed to find therapist: ${error.message}`);
        }

        return data;
    },

    async updateLastLogin(id) {
        const { error } = await supabase
            .from('therapists')
            .update({ last_login: new Date() })
            .eq('id', id);

        if (error) {
            console.error('Failed to update last login:', error.message);
        }
    },

    async updateProfile(id, profileData) {
        const { full_name, phone_number, specialization, yearsOfExperience } = profileData;

        const { data, error } = await supabase
            .from('therapists')
            .update({
                full_name,
                phone_number,
                specialization,
                years_of_experience: yearsOfExperience,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }

        return data;
    },

    async getAllTherapists() {
        const { data, error } = await supabase
            .from('therapists')
            .select('id, full_name, email, specialization, years_of_experience, license_number');

        if (error) {
            throw new Error(`Failed to fetch therapists: ${error.message}`);
        }

        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('therapists')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete therapist: ${error.message}`);
        }
    }
};
