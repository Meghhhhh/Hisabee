import express from 'express';
import * as hisabController from '../controllers/hisab.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth);

router.get('/', hisabController.getAllTrips);
router.get('/:id', hisabController.getTripById);
router.post('/', hisabController.createTrip);
router.put('/:id', hisabController.updateTrip);
router.delete('/:id', hisabController.deleteTrip);

router.post('/:id/participants', hisabController.addParticipant);
router.delete('/:id/participants', hisabController.removeParticipant);

export default router;
