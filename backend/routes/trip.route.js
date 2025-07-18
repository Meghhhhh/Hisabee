import express from 'express';
import * as tripController from '../controllers/trip.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth);

router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

router.post('/:id/participants', tripController.addParticipant);
router.delete('/:id/participants', tripController.removeParticipant);

export default router;
