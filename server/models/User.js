import { supabase } from '../config/supabase.js';

export const User = {
    async create(userData) {
        const { email, password, fullName, phoneNumber, dateOfBirth } = userData;

        const { data, error } = await supabase
            .from('users')
            .insert({
                email,
                password_hash: password,
                full_name: fullName,
                phone_number: phoneNumber,
                date_of_birth: dateOfBirth,
                role: 'CLIENT',
                created_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }

        return data;
    },

    async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(`Failed to find user: ${error.message}`);
        }

        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(`Failed to find user: ${error.message}`);
        }

        return data;
    },

    async updateLastLogin(id) {
        const { error } = await supabase
            .from('users')
            .update({ last_login: new Date() })
            .eq('id', id);

        if (error) {
            console.error('Failed to update last login:', error.message);
        }
    },

    async updateProfile(id, profileData) {
        const { full_name, phone_number, date_of_birth } = profileData;

        const { data, error } = await supabase
            .from('users')
            .update({
                full_name,
                phone_number,
                date_of_birth,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }

        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
};
