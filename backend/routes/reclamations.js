const express = require('express');
const router = express.Router();
const { getAllReclamations, createReclamation, updateReclamation, deleteReclamation, exportReclamationsCSV } = require('../controllers/reclamationsController');
const verifierToken = require('../middleware/authMiddleware');

router.get('/export', verifierToken, exportReclamationsCSV);
router.get('/', verifierToken, getAllReclamations);
router.post('/', verifierToken, createReclamation);
router.put('/:id', verifierToken, updateReclamation);
router.delete('/:id', verifierToken, deleteReclamation);

module.exports = router;