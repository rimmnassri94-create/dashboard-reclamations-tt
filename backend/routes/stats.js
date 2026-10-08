const express = require('express');
const router = express.Router();
const {
  getReclamationsParRegion,
  getReclamationsParStatut,
  getReclamationsParType,
  getTempsMoyenParAgence,
  getTauxReussiteParTechnicien,
  getReclamationsParPriorite,
  getEvolutionMensuelle
} = require('../controllers/statsController');
const verifierToken = require('../middleware/authMiddleware');

router.get('/par-region', verifierToken, getReclamationsParRegion);
router.get('/par-statut', verifierToken, getReclamationsParStatut);
router.get('/par-type', verifierToken, getReclamationsParType);
router.get('/temps-moyen', verifierToken, getTempsMoyenParAgence);
router.get('/taux-reussite', verifierToken, getTauxReussiteParTechnicien);
router.get('/par-priorite', verifierToken, getReclamationsParPriorite);
router.get('/evolution', verifierToken, getEvolutionMensuelle);

module.exports = router;
