import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId, email, role) => {
    return jwt.sign(
        { id: userId, email, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyTokenExpiry = (token) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
};
