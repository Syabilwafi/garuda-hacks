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
            const response = await apiClient<any>('/therapists', { method: 'GET' });
            return response.therapists || [];
        } catch (error) {
            console.error('Error fetching therapists:', error);
            return [];
        }
    },

    async getTherapistAvailability(therapistId: string, date?: string): Promise<TherapistAvailability | null> {
        try {
            const url = date
                ? `/therapists/${therapistId}/availability?date=${date}`
                : `/therapists/${therapistId}/availability`;

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
            const response = await apiClient<any>('/bookings', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            return response.booking;
        } catch (error) {
            console.error('Error creating booking:', error);
            return null;
        }
    },

    async getUserBookings(userId: string): Promise<UserBooking[]> {
        try {
            const response = await apiClient<any>(`/bookings/user/${userId}`, { method: 'GET' });
            return response.bookings || [];
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            return [];
        }
    },

    async cancelBooking(bookingId: string): Promise<boolean> {
        try {
            await apiClient<any>(`/bookings/${bookingId}/cancel`, {
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
            await apiClient<any>(`/bookings/${bookingId}/complete`, {
                method: 'PUT',
                body: JSON.stringify({}),
            });
            return true;
        } catch (error) {
            console.error('Error completing booking:', error);
            return false;
        }
    },
};
