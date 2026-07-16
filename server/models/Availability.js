import { supabase } from '../config/supabase.js';

export const Availability = {
    async create(availabilityData) {
        const { therapist_id, date, start_time, end_time, is_available } = availabilityData;

        const { data, error } = await supabase
            .from('availability')
            .insert({
                therapist_id,
                date,
                start_time,
                end_time,
                is_available: is_available !== undefined ? is_available : true,
                created_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create availability: ${error.message}`);
        }

        return data;
    },

    async getByTherapistId(therapistId) {
        const { data, error } = await supabase
            .from('availability')
            .select('*')
            .eq('therapist_id', therapistId)
            .eq('is_available', true)
            .order('date', { ascending: true })
            .order('start_time', { ascending: true });

        if (error) {
            throw new Error(`Failed to fetch availability: ${error.message}`);
        }

        return data || [];
    },

    async getByTherapistIdAndDate(therapistId, date) {
        const { data, error } = await supabase
            .from('availability')
            .select('*')
            .eq('therapist_id', therapistId)
            .eq('date', date)
            .eq('is_available', true)
            .order('start_time', { ascending: true });

        if (error) {
            throw new Error(`Failed to fetch availability for date: ${error.message}`);
        }

        return data || [];
    },

    async updateAvailability(id, availabilityData) {
        const { is_available } = availabilityData;

        const { data, error } = await supabase
            .from('availability')
            .update({
                is_available,
                updated_at: new Date(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update availability: ${error.message}`);
        }

        return data;
    },

    async deleteById(id) {
        const { error } = await supabase
            .from('availability')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete availability: ${error.message}`);
        }
    },

    async bulkCreate(availabilityArray) {
        const { data, error } = await supabase
            .from('availability')
            .insert(availabilityArray.map(av => ({
                ...av,
                created_at: new Date(),
            })))
            .select();

        if (error) {
            throw new Error(`Failed to bulk create availability: ${error.message}`);
        }

        return data || [];
    }
};
