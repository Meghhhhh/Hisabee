import * as TransactionModel from '../models/transaction.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as UserModel from '../models/user.model.js';

export const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await TransactionModel.getAllTransactions();
  res.json(transactions);
});

export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await TransactionModel.getTransactionById(req.params.id);
  if (!transaction)
    return res.status(404).json({ message: 'Transaction not found' });
  res.json(transaction);
});

export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await TransactionModel.createTransaction(req.body);
  const { name } = await UserModel.getUserById(req.body.paid_by);
  res.status(201).json({ ...transaction, paid_by_user: name });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await TransactionModel.updateTransaction(
    req.params.id,
    req.body,
  );
  res.json(transaction);
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  await TransactionModel.deleteTransaction(req.params.id);
  res.status(204).end();
});

export const addContributor = asyncHandler(async (req, res) => {
  const { user_id, contributed_amount, mode_of_payment } = req.body;
  const contributor = await TransactionModel.addContributor(
    req.params.id,
    user_id,
    contributed_amount,
    mode_of_payment,
  );
  res.status(201).json(contributor);
});

export const removeContributor = asyncHandler(async (req, res) => {
  const { user_id } = req.body;
  const removed = await TransactionModel.removeContributor(
    req.params.id,
    user_id,
  );
  res.json(removed);
});
