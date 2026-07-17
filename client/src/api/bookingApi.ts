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

// Mock Data
const MOCK_THERAPISTS: TherapistSummary[] = [
    {
        id: "T-001",
        name: "Dr. Lana Arisandi",
        specialty: "Spesialis Kebidanan & Akupunktur",
        rating: 4.9,
        availability: "Senin - Jumat"
    },
    {
        id: "T-002",
        name: "Prof. Budi Raharjo",
        specialty: "Herbalis & Terapi Meridian",
        rating: 4.8,
        availability: "Selasa & Kamis"
    },
    {
        id: "T-003",
        name: "Hendra Wijaya, L.Ac",
        specialty: "Ahli Jarum Tradisional (TCM)",
        rating: 4.7,
        availability: "Setiap Hari"
    },
    {
        id: "T-004",
        name: "Siti Nurhaliza",
        specialty: "Terapis Pijat Profesional",
        rating: 4.6,
        availability: "Senin - Sabtu"
    },
    {
        id: "T-005",
        name: "Ahmad Sutrisno",
        specialty: "Spesialis Refleksi Kaki",
        rating: 4.8,
        availability: "Setiap Hari"
    }
];

const MOCK_AVAILABILITY_SLOTS: AvailabilitySlot[] = [
    { id: "S-001", date: "2026-07-24", startTime: "08:00", endTime: "09:00", isAvailable: true },
    { id: "S-002", date: "2026-07-24", startTime: "09:00", endTime: "10:00", isAvailable: false },
    { id: "S-003", date: "2026-07-24", startTime: "10:00", endTime: "11:00", isAvailable: true },
    { id: "S-004", date: "2026-07-24", startTime: "11:00", endTime: "12:00", isAvailable: true },
    { id: "S-005", date: "2026-07-24", startTime: "14:00", endTime: "15:00", isAvailable: false },
    { id: "S-006", date: "2026-07-24", startTime: "15:00", endTime: "16:00", isAvailable: true },
];

let userBookingsStorage: Record<string, UserBooking[]> = {};

export const bookingApi = {
    async getAllTherapists(): Promise<TherapistSummary[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_THERAPISTS), 500);
        });
    },

    async getTherapistAvailability(therapistId: string, date?: string): Promise<TherapistAvailability | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const therapist = MOCK_THERAPISTS.find(t => t.id === therapistId);
                if (!therapist) {
                    resolve(null);
                    return;
                }
                resolve({
                    therapist: {
                        id: therapist.id,
                        fullName: therapist.name,
                        specialization: therapist.specialty
                    },
                    availability: MOCK_AVAILABILITY_SLOTS
                });
            }, 300);
        });
    },

    async createBooking(payload: BookingPayload): Promise<BookingResponse | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const therapist = MOCK_THERAPISTS.find(t => t.id === payload.therapistId);
                if (!therapist) {
                    resolve(null);
                    return;
                }

                const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const booking: BookingResponse = {
                    id: bookingId,
                    therapistName: therapist.name,
                    date: payload.date,
                    startTime: payload.startTime,
                    endTime: payload.endTime,
                    status: "Upcoming"
                };

                const userBooking: UserBooking = {
                    id: bookingId,
                    therapistName: therapist.name,
                    therapistSpecialization: therapist.specialty,
                    date: payload.date,
                    startTime: payload.startTime,
                    endTime: payload.endTime,
                    status: "Upcoming",
                    notes: payload.notes || null
                };

                if (!userBookingsStorage[payload.userId]) {
                    userBookingsStorage[payload.userId] = [];
                }
                userBookingsStorage[payload.userId].push(userBooking);

                resolve(booking);
            }, 400);
        });
    },

    async getUserBookings(userId: string): Promise<UserBooking[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(userBookingsStorage[userId] || []);
            }, 300);
        });
    },

    async cancelBooking(bookingId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                for (const userId in userBookingsStorage) {
                    const bookingIndex = userBookingsStorage[userId].findIndex(b => b.id === bookingId);
                    if (bookingIndex !== -1) {
                        userBookingsStorage[userId][bookingIndex].status = "Cancelled";
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            }, 300);
        });
    },

    async completeBooking(bookingId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                for (const userId in userBookingsStorage) {
                    const bookingIndex = userBookingsStorage[userId].findIndex(b => b.id === bookingId);
                    if (bookingIndex !== -1) {
                        userBookingsStorage[userId][bookingIndex].status = "Completed";
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            }, 300);
        });
    },

    async updateTherapistAvailability(therapistId: string, slots: Array<{ time: string; isAvailable: boolean }>): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 300);
        });
    },
};
