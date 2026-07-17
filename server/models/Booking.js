import { supabase } from '../config/supabase.js';

export const Booking = {
    async create(bookingData) {
        const {
            user_id,
            therapist_id,
            availability_id,
            date,
            start_time,
            end_time,
            status,
            notes
        } = bookingData;

        const { data, error } = await supabase
            .from('bookings')
            .insert({
                user_id,
                therapist_id,
                availability_id,
                date,
                start_time,
                end_time,
                status: status || 'CONFIRMED',
                notes: notes || null,
                created_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create booking: ${error.message}`);
        }

        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                therapist:therapist_id(id, full_name, email, specialization),
                user:user_id(id, full_name, email, phone_number)
            `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(`Failed to find booking: ${error.message}`);
        }

        return data;
    },

    async getByUserId(userId) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                therapist:therapist_id(id, full_name, email, specialization)
            `)
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .order('start_time', { ascending: false })
            ;

        if (error) {
            throw new Error(`Failed to fetch user bookings: ${error.message}`);
        }

        return data || [];
    },

    async getByTherapistId(therapistId) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                user:user_id(id, full_name, email, phone_number)
            `)
            .eq('therapist_id', therapistId)
            .order('date', { ascending: false })
            .order('start_time', { ascending: false })
            ;

        if (error) {
            throw new Error(`Failed to fetch therapist bookings: ${error.message}`);
        }

        return data || [];
    },

    async getByTherapistIdAndDate(therapistId, date) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                user:user_id(id, full_name, email, phone_number)
            `)
            .eq('therapist_id', therapistId)
            .eq('date', date)
            .neq('status', 'CANCELLED')
            .order('start_time', { ascending: true });

        if (error) {
            throw new Error(`Failed to fetch bookings for date: ${error.message}`);
        }

        return data || [];
    },

    async updateStatus(bookingId, status) {
        const { data, error } = await supabase
            .from('bookings')
            .update({
                status,
                updated_at: new Date(),
            })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update booking status: ${error.message}`);
        }

        return data;
    },

    async cancel(bookingId) {
        return this.updateStatus(bookingId, 'CANCELLED');
    },

    async complete(bookingId) {
        return this.updateStatus(bookingId, 'COMPLETED');
    },

    async delete(id) {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete booking: ${error.message}`);
        }
    }
};
