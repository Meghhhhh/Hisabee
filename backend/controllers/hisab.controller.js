import * as HisabModel from '../models/hisab.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllTrips = asyncHandler(async (req, res) => {
  const trips = await HisabModel.getAllHisabs();
  res.json(trips);
});

export const getTripById = asyncHandler(async (req, res) => {
  const hisab = await HisabModel.getHisabById(req.params.id);
  if (!hisab) return res.status(404).json({ message: 'hisab not found' });
  res.json(hisab);
});

export const createTrip = asyncHandler(async (req, res) => {
  const hisab = await HisabModel.createHisab({
    ...req.body,
    created_by: req.user.user_id,
  });
  res.status(201).json(hisab);
});

export const updateTrip = asyncHandler(async (req, res) => {
  const hisab = await HisabModel.updateHisab(req.params.id, req.body);
  res.json(hisab);
});

export const deleteTrip = asyncHandler(async (req, res) => {
  await HisabModel.deleteHisab(req.params.id);
  res.status(204).end();
});

export const addParticipant = asyncHandler(async (req, res) => {
  const { user_id, budget_contribution } = req.body;
  const participant = await HisabModel.addParticipant(
    req.params.id,
    user_id,
    budget_contribution,
  );
  res.status(201).json(participant);
});

export const removeParticipant = asyncHandler(async (req, res) => {
  const { user_id } = req.body;
  const removed = await HisabModel.removeParticipant(req.params.id, user_id);
  res.json(removed);
});
