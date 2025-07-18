import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth);

router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

router.post('/:id/contributors', transactionController.addContributor);
router.delete('/:id/contributors', transactionController.removeContributor);

export default router;
