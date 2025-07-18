import * as TripModel from '../models/trip.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllTrips = asyncHandler(async (req, res) => {
  const trips = await TripModel.getAllTrips();
  res.json(trips);
});

export const getTripById = asyncHandler(async (req, res) => {
  const trip = await TripModel.getTripById(req.params.id);
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.json(trip);
});

export const createTrip = asyncHandler(async (req, res) => {
  const trip = await TripModel.createTrip({
    ...req.body,
    created_by: req.user.user_id,
  });
  res.status(201).json(trip);
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await TripModel.updateTrip(req.params.id, req.body);
  res.json(trip);
});

export const deleteTrip = asyncHandler(async (req, res) => {
  await TripModel.deleteTrip(req.params.id);
  res.status(204).end();
});

export const addParticipant = asyncHandler(async (req, res) => {
  const { user_id, budget_contribution } = req.body;
  const participant = await TripModel.addParticipant(
    req.params.id,
    user_id,
    budget_contribution,
  );
  res.status(201).json(participant);
});

export const removeParticipant = asyncHandler(async (req, res) => {
  const { user_id } = req.body;
  const removed = await TripModel.removeParticipant(req.params.id, user_id);
  res.json(removed);
});
