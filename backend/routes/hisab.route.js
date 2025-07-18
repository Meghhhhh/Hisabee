import express from 'express';
import * as hisabController from '../controllers/hisab.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth);

router.get('/', hisabController.getAllHisabs);
router.get('/:id', hisabController.getHisabById);
router.post('/', hisabController.createHisab);
router.put('/:id', hisabController.updateHisab);
router.delete('/:id', hisabController.deleteHisab);

router.post('/:id/participants', hisabController.addParticipant);
router.delete('/:id/participants', hisabController.removeParticipant);

export default router;
