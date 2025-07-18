import * as HisabModel from '../models/hisab.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import pool from '../config/postgres-db.js';

export const getAllHisabs = asyncHandler(async (req, res) => {
  const query = `SELECT 
  h.hisab_id AS id,
  h.title,
  h.total_budget,
  h.created_at,
  u.name AS created_by,

  (
    SELECT json_agg(json_build_object(
      'user_id', u2.user_id,
      'name', u2.name
    )
      )
    FROM hisab_contributors hc
    JOIN users u2 ON hc.user_id = u2.user_id
    WHERE hc.hisab_id = h.hisab_id
  ) AS contributors,

  (
    SELECT json_agg(json_build_object(
      'description', t.description,
      'amount', t.amount,
      'paid_by', u3.name,
      'date', t.date,
      'category', t.category
    ))
    FROM transactions t
    JOIN users u3 ON t.paid_by = u3.user_id
    WHERE t.hisab_id = h.hisab_id
  ) AS transactions

  FROM hisabs h
  JOIN users u ON h.created_by = u.user_id
  WHERE h.created_by = $1;
`;
  const hisabs = await pool.query(query, [req.user.user_id]);
  return res.json(hisabs.rows);
});

export const getHisabById = asyncHandler(async (req, res) => {
  const query = `SELECT 
  h.hisab_id AS id,
  h.title,
  h.total_budget,
  h.created_at,
  u.name AS created_by,

  (
    SELECT json_agg(json_build_object(
      'user_id', u2.user_id,
      'name', u2.name
    )
      )
    FROM hisab_contributors hc
    JOIN users u2 ON hc.user_id = u2.user_id
    WHERE hc.hisab_id = h.hisab_id
  ) AS contributors,

  (
    SELECT json_agg(json_build_object(
      'description', t.description,
      'amount', t.amount,
      'paid_by', u3.name,
      'date', t.date,
      'category', t.category
    ))
    FROM transactions t
    JOIN users u3 ON t.paid_by = u3.user_id
    WHERE t.hisab_id = h.hisab_id
  ) AS transactions

  FROM hisabs h
  JOIN users u ON h.created_by = u.user_id
  WHERE h.hisab_id = $1;
`;

  const hisab = await pool.query(query, [req.params.hisabId]);
  if (!hisab) return res.status(404).json({ message: 'hisab not found' });
  res.json(hisab.rows[0]);
});

export const createHisab = asyncHandler(async (req, res) => {
  const hisab = await HisabModel.createHisab({
    ...req.body,
    created_by: req.user.user_id,
  });
  res.status(201).json(hisab);
});

export const updateHisab = asyncHandler(async (req, res) => {
  const hisab = await HisabModel.updateHisab(req.params.id, req.body);
  res.json(hisab);
});

export const deleteHisab = asyncHandler(async (req, res) => {
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
