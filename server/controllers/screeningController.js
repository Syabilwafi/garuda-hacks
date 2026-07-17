import { Booking } from '../models/Booking.js';

export const submitScreening = async (req, res) => {
    try {
        const {
            userId,
            bookingId,
            triageStatus,
            triageAnswers,
            selectedIntensity,
            paintedPoints,
            healthDescription
        } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                error: 'Missing required field: bookingId'
            });
        }

        // Update booking with screening data
        await Booking.updateTriageData(bookingId, {
            triage_status: triageStatus,
            triage_answers: triageAnswers,
            pain_intensity: selectedIntensity,
            notes: healthDescription
        });

        return res.status(200).json({
            success: true,
            message: 'Screening data submitted successfully',
            bookingId
        });
    } catch (error) {
        console.error('Screening submission error:', error);
        return res.status(500).json({
            error: 'Failed to submit screening data',
            details: error.message
        });
    }
};
