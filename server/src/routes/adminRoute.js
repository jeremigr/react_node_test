// server/src/routes/adminRoute.js
const express = require('express');
const router = express.Router();

const { listLogs, removeLog, clearLogs } = require('../models/userLogsStore');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Démo: dashboard admin (protégé)
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

// Lister tous les logs (protégé admin)
router.get('/logs', protect, adminOnly, (req, res) => {
  res.json(listLogs());
});

// Supprimer un log par id (protégé admin)
router.delete('/logs/:id', protect, adminOnly, (req, res) => {
  const ok = removeLog(req.params.id);
  res.status(ok ? 200 : 404).json({ success: ok });
});

// (Optionnel) vider tous les logs (protégé admin)
router.delete('/logs', protect, adminOnly, (req, res) => {
  clearLogs();
  res.json({ success: true });
});

module.exports = router;
