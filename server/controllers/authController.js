import { User } from '../models/User.js';
import { Therapist } from '../models/Therapist.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/tokenUtils.js';

export const registerClient = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber, dateOfBirth } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ error: 'Email, password, dan nama lengkap wajib diisi' });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email sudah terdaftar' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            fullName,
            phoneNumber,
            dateOfBirth,
        });

        const token = generateToken(newUser.id, newUser.email, 'CLIENT');

        return res.status(201).json({
            message: 'Akun klien berhasil dibuat',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                fullName: newUser.full_name,
                role: 'CLIENT',
            },
        });
    } catch (error) {
        console.error('Error in registerClient:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal membuat akun klien' });
    }
};

export const registerTherapist = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber, specialization, licenseNumber, yearsOfExperience } = req.body;

        if (!email || !password || !fullName || !specialization || !licenseNumber) {
            return res.status(400).json({ error: 'Email, password, nama lengkap, spesialisasi, dan nomor lisensi wajib diisi' });
        }

        const existingTherapist = await Therapist.findByEmail(email);
        if (existingTherapist) {
            return res.status(409).json({ error: 'Email sudah terdaftar' });
        }

        const hashedPassword = await hashPassword(password);

        const newTherapist = await Therapist.create({
            email,
            password: hashedPassword,
            fullName,
            phoneNumber,
            specialization,
            licenseNumber,
            yearsOfExperience,
        });

        const token = generateToken(newTherapist.id, newTherapist.email, 'THERAPIST');

        return res.status(201).json({
            message: 'Akun terapis berhasil dibuat',
            token,
            user: {
                id: newTherapist.id,
                email: newTherapist.email,
                fullName: newTherapist.full_name,
                specialization: newTherapist.specialization,
                role: 'THERAPIST',
            },
        });
    } catch (error) {
        console.error('Error in registerTherapist:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal membuat akun terapis' });
    }
};

export const loginClient = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email dan password wajib diisi' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        await User.updateLastLogin(user.id);

        const token = generateToken(user.id, user.email, 'CLIENT');

        return res.status(200).json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: 'CLIENT',
            },
        });
    } catch (error) {
        console.error('Error in loginClient:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal login' });
    }
};

export const loginTherapist = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email dan password wajib diisi' });
        }

        const therapist = await Therapist.findByEmail(email);
        if (!therapist) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        const isPasswordValid = await comparePassword(password, therapist.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        await Therapist.updateLastLogin(therapist.id);

        const token = generateToken(therapist.id, therapist.email, 'THERAPIST');

        return res.status(200).json({
            message: 'Login berhasil',
            token,
            user: {
                id: therapist.id,
                email: therapist.email,
                fullName: therapist.full_name,
                specialization: therapist.specialization,
                role: 'THERAPIST',
            },
        });
    } catch (error) {
        console.error('Error in loginTherapist:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal login' });
    }
};

export const getClientProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                phoneNumber: user.phone_number,
                dateOfBirth: user.date_of_birth,
                role: 'CLIENT',
            },
        });
    } catch (error) {
        console.error('Error in getClientProfile:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal mengambil profil' });
    }
};

export const getTherapistProfile = async (req, res) => {
    try {
        const therapistId = req.user.id;

        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            return res.status(404).json({ error: 'Terapis tidak ditemukan' });
        }

        return res.status(200).json({
            user: {
                id: therapist.id,
                email: therapist.email,
                fullName: therapist.full_name,
                phoneNumber: therapist.phone_number,
                specialization: therapist.specialization,
                licenseNumber: therapist.license_number,
                yearsOfExperience: therapist.years_of_experience,
                role: 'THERAPIST',
            },
        });
    } catch (error) {
        console.error('Error in getTherapistProfile:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal mengambil profil' });
    }
};

export const updateClientProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phoneNumber, dateOfBirth } = req.body;

        const updatedUser = await User.updateProfile(userId, {
            full_name: fullName,
            phone_number: phoneNumber,
            date_of_birth: dateOfBirth,
        });

        return res.status(200).json({
            message: 'Profil berhasil diperbarui',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                fullName: updatedUser.full_name,
                phoneNumber: updatedUser.phone_number,
                dateOfBirth: updatedUser.date_of_birth,
            },
        });
    } catch (error) {
        console.error('Error in updateClientProfile:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal memperbarui profil' });
    }
};

export const updateTherapistProfile = async (req, res) => {
    try {
        const therapistId = req.user.id;
        const { fullName, phoneNumber, specialization, yearsOfExperience } = req.body;

        const updatedTherapist = await Therapist.updateProfile(therapistId, {
            full_name: fullName,
            phone_number: phoneNumber,
            specialization,
            yearsOfExperience,
        });

        return res.status(200).json({
            message: 'Profil berhasil diperbarui',
            user: {
                id: updatedTherapist.id,
                email: updatedTherapist.email,
                fullName: updatedTherapist.full_name,
                phoneNumber: updatedTherapist.phone_number,
                specialization: updatedTherapist.specialization,
                yearsOfExperience: updatedTherapist.years_of_experience,
            },
        });
    } catch (error) {
        console.error('Error in updateTherapistProfile:', error.message);
        return res.status(500).json({ error: error.message || 'Gagal memperbarui profil' });
    }
};
