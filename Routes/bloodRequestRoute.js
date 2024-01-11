// bloodRequestRoutes.js
import express from 'express';
const router = express.Router();
import * as bloodRequestController from '../Controllers/bloodRequestController.js';

// API endpoint for requesting blood
router.post('/blood-requests', bloodRequestController.requestBlood);
router.get('/blood-request-list', bloodRequestController.getBloodRequests);

export default router;
