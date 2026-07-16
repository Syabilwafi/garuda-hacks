// server/routes/api.js
import { Router } from 'express';
import { generateAssessmentController } from '../controllers/painMapController.js';
import {
    registerClient,
    registerTherapist,
    loginClient,
    loginTherapist,
    getClientProfile,
    getTherapistProfile,
    updateClientProfile,
    updateTherapistProfile,
} from '../controllers/authController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes - Client
router.post('/auth/register-client', registerClient);
router.post('/auth/login-client', loginClient);
router.get('/auth/client/profile', verifyToken, verifyRole(['CLIENT']), getClientProfile);
router.put('/auth/client/profile', verifyToken, verifyRole(['CLIENT']), updateClientProfile);

// Auth routes - Therapist
router.post('/auth/register-therapist', registerTherapist);
router.post('/auth/login-therapist', loginTherapist);
router.get('/auth/therapist/profile', verifyToken, verifyRole(['THERAPIST']), getTherapistProfile);
router.put('/auth/therapist/profile', verifyToken, verifyRole(['THERAPIST']), updateTherapistProfile);

// Pain mapping route
router.post('/assessment/generate', generateAssessmentController);

export default router;