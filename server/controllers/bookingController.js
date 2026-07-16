import { Availability } from '../models/Availability.js';
import { Booking } from '../models/Booking.js';
import { Therapist } from '../models/Therapist.js';

export const getAllTherapists = async (req, res) => {
    try {
        const therapists = await Therapist.getAllTherapists();

        return res.status(200).json({
            message: 'Daftar terapis berhasil diambil',
            therapists: therapists.map(t => ({
                id: t.id,
                name: t.full_name,
                specialty: t.specialization,
                rating: 4.8,
                availability: 'Senin - Jumat',
            })),
        });
    } catch (error) {
        console.error('Error in getAllTherapists:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal mengambil daftar terapis' });
    }
};

export const getTherapistAvailability = async (req, res) => {
    try {
        const { therapistId } = req.params;
        const { date } = req.query;

        if (!therapistId) {
            return res.status(400).json({ error: 'ID terapis wajib diisi' });
        }

        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            return res.status(404).json({ error: 'Terapis tidak ditemukan' });
        }

        let availability;
        if (date) {
            availability = await Availability.getByTherapistIdAndDate(therapistId, date);
        } else {
            availability = await Availability.getByTherapistId(therapistId);
        }

        return res.status(200).json({
            message: 'Ketersediaan terapis berhasil diambil',
            therapist: {
                id: therapist.id,
                fullName: therapist.full_name,
                specialization: therapist.specialization,
            },
            availability: availability.map(av => ({
                id: av.id,
                date: av.date,
                startTime: av.start_time,
                endTime: av.end_time,
                isAvailable: av.is_available,
            })),
        });
    } catch (error) {
        console.error('Error in getTherapistAvailability:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal mengambil ketersediaan terapis' });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { userId, therapistId, availabilityId, date, startTime, endTime, notes } = req.body;

        if (!userId || !therapistId || !date || !startTime || !endTime) {
            return res.status(400).json({
                error: 'User ID, Therapist ID, tanggal, jam mulai, dan jam akhir wajib diisi'
            });
        }

        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            return res.status(404).json({ error: 'Terapis tidak ditemukan' });
        }

        const booking = await Booking.create({
            user_id: userId,
            therapist_id: therapistId,
            availability_id: availabilityId || null,
            date,
            start_time: startTime,
            end_time: endTime,
            status: 'CONFIRMED',
            notes: notes || null,
        });

        if (availabilityId) {
            await Availability.updateAvailability(availabilityId, { is_available: false });
        }

        return res.status(201).json({
            message: 'Janji temu berhasil dibuat',
            booking: {
                id: booking.id,
                therapistName: therapist.full_name,
                date: booking.date,
                startTime: booking.start_time,
                endTime: booking.end_time,
                status: booking.status,
            },
        });
    } catch (error) {
        console.error('Error in createBooking:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal membuat janji temu' });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'ID pengguna wajib diisi' });
        }

        const bookings = await Booking.getByUserId(userId);

        return res.status(200).json({
            message: 'Janji temu pengguna berhasil diambil',
            bookings: bookings.map(booking => ({
                id: booking.id,
                therapistName: booking.therapist?.full_name,
                therapistSpecialization: booking.therapist?.specialization,
                date: booking.date,
                startTime: booking.start_time,
                endTime: booking.end_time,
                status: booking.status,
                notes: booking.notes,
            })),
        });
    } catch (error) {
        console.error('Error in getUserBookings:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal mengambil janji temu pengguna' });
    }
};

export const getTherapistBookings = async (req, res) => {
    try {
        const { therapistId } = req.params;
        const { date } = req.query;

        if (!therapistId) {
            return res.status(400).json({ error: 'ID terapis wajib diisi' });
        }

        let bookings;
        if (date) {
            bookings = await Booking.getByTherapistIdAndDate(therapistId, date);
        } else {
            bookings = await Booking.getByTherapistId(therapistId);
        }

        return res.status(200).json({
            message: 'Janji temu terapis berhasil diambil',
            bookings: bookings.map(booking => ({
                id: booking.id,
                patientName: booking.user?.full_name,
                patientEmail: booking.user?.email,
                patientPhone: booking.user?.phone_number,
                date: booking.date,
                startTime: booking.start_time,
                endTime: booking.end_time,
                status: booking.status,
                notes: booking.notes,
            })),
        });
    } catch (error) {
        console.error('Error in getTherapistBookings:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal mengambil janji temu terapis' });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({ error: 'ID janji temu wajib diisi' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Janji temu tidak ditemukan' });
        }

        await Booking.cancel(bookingId);

        if (booking.availability_id) {
            await Availability.updateAvailability(booking.availability_id, { is_available: true });
        }

        return res.status(200).json({
            message: 'Janji temu berhasil dibatalkan',
            bookingId: bookingId,
        });
    } catch (error) {
        console.error('Error in cancelBooking:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal membatalkan janji temu' });
    }
};

export const completeBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({ error: 'ID janji temu wajib diisi' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Janji temu tidak ditemukan' });
        }

        await Booking.complete(bookingId);

        return res.status(200).json({
            message: 'Janji temu berhasil diselesaikan',
            bookingId: bookingId,
        });
    } catch (error) {
        console.error('Error in completeBooking:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal menyelesaikan janji temu' });
    }
};
