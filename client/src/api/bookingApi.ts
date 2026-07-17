import { apiClient } from '@/utils/apiClient';

export interface TherapistSummary {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    availability: string;
}

export interface AvailabilitySlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface TherapistAvailability {
    therapist: {
        id: string;
        fullName: string;
        specialization: string;
    };
    availability: AvailabilitySlot[];
}

export interface BookingPayload {
    userId: string;
    therapistId: string;
    availabilityId?: string | null;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
}

export interface BookingResponse {
    id: string;
    therapistName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
}

export interface UserBooking {
    id: string;
    therapistName: string;
    therapistSpecialization: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    notes: string | null;
}

export const bookingApi = {
    async getAllTherapists(): Promise<TherapistSummary[]> {
        try {
            const response = await apiClient<any>('/api/therapists', { method: 'GET' });
            return response.therapists || [];
        } catch (error) {
            console.error('Error fetching therapists:', error);
            return [];
        }
    },

    async getTherapistAvailability(therapistId: string, date?: string): Promise<TherapistAvailability | null> {
        try {
            const url = date
                ? `/api/therapists/${therapistId}/availability?date=${date}`
                : `/api/therapists/${therapistId}/availability`;

            const response = await apiClient<any>(url, { method: 'GET' });
            return {
                therapist: response.therapist,
                availability: response.availability || [],
            };
        } catch (error) {
            console.error('Error fetching therapist availability:', error);
            return null;
        }
    },

    async createBooking(payload: BookingPayload): Promise<BookingResponse | null> {
        try {
            const cleanEndTime = payload.endTime.replace(" WIB", "");

            const cleanedPayload = {
                ...payload,
                endTime: cleanEndTime
            };

            const response = await apiClient<any>('/api/bookings', {
                method: 'POST',
                body: JSON.stringify(cleanedPayload),
            });

            return response.booking;
        } catch (error) {
            console.error('Error creating booking:', error);
            return null;
        }
    },

    async getUserBookings(userId: string): Promise<UserBooking[]> {
        try {
            const response = await apiClient<any>(`/api/bookings/user/${userId}`, { method: 'GET' });
            return response.bookings || [];
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            return [];
        }
    },

    async cancelBooking(bookingId: string): Promise<boolean> {
        try {
            await apiClient<any>(`/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                body: JSON.stringify({}),
            });
            return true;
        } catch (error) {
            console.error('Error cancelling booking:', error);
            return false;
        }
    },

    async completeBooking(bookingId: string): Promise<boolean> {
        try {
            await apiClient<any>(`/api/bookings/${bookingId}/complete`, {
                method: 'PUT',
                body: JSON.stringify({}),
            });
            return true;
        } catch (error) {
            console.error('Error completing booking:', error);
            return false;
        }
    },

    async updateTherapistAvailability(therapistId: string, slots: Array<{ time: string; isAvailable: boolean }>): Promise<boolean> {
        try {
            await apiClient<any>(`/api/therapists/${therapistId}/availability`, {
                method: 'PUT',
                body: JSON.stringify({ slots }),
            });
            return true;
        } catch (error) {
            console.error('Error updating therapist availability:', error);
            return false;
        }
    },
};
