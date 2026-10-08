const pool = require('../db');

const getReclamationsParRegion = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.nom_region, COUNT(rec.id_reclamation) AS nb_reclamations
      FROM regions r
      JOIN agences a ON a.id_region = r.id_region
      JOIN reclamations rec ON rec.id_agence = a.id_agence
      GROUP BY r.nom_region
      ORDER BY nb_reclamations DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors du calcul des statistiques par région' });
  }
};

const getReclamationsParStatut = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT statut, COUNT(*) AS nombre
      FROM reclamations
      GROUP BY statut
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors du calcul des statistiques par statut' });
  }
};

const getReclamationsParType = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT type_reclamation, COUNT(*) AS nombre
      FROM reclamations
      GROUP BY type_reclamation
      ORDER BY nombre DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors du calcul des statistiques par type' });
  }
};

const getTempsMoyenParAgence = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.nom_agence,
             ROUND(AVG(EXTRACT(EPOCH FROM (rec.date_cloture - rec.date_ouverture)) / 3600), 1) AS temps_moyen_heures
      FROM reclamations rec
      JOIN agences a ON a.id_agence = rec.id_agence
      WHERE rec.date_cloture IS NOT NULL
      GROUP BY a.nom_agence
      ORDER BY temps_moyen_heures
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors du calcul du temps moyen de résolution' });
  }
};

const getTauxReussiteParTechnicien = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.nom, t.prenom,
             COUNT(*) AS total_interventions,
             SUM(CASE WHEN i.resultat = 'Réussie' THEN 1 ELSE 0 END) AS reussies,
             ROUND(100.0 * SUM(CASE WHEN i.resultat = 'Réussie' THEN 1 ELSE 0 END) / COUNT(*), 1) AS taux_reussite_pct
      FROM interventions i
      JOIN techniciens t ON t.id_technicien = i.id_technicien
      GROUP BY t.nom, t.prenom
      ORDER BY taux_reussite_pct DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors du calcul du taux de réussite' });
  }
};

const getReclamationsParPriorite = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT priorite, COUNT(*) AS nombre
      FROM reclamations
      GROUP BY priorite
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors du calcul par priorité' });
  }
};

const getEvolutionMensuelle = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE_TRUNC('month', date_ouverture)::DATE AS mois, COUNT(*) AS nombre
      FROM reclamations
      GROUP BY mois
      ORDER BY mois
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors du calcul de l\'évolution mensuelle' });
  }
};

module.exports = {
  getReclamationsParRegion,
  getReclamationsParStatut,
  getReclamationsParType,
  getTempsMoyenParAgence,
  getTauxReussiteParTechnicien,
  getReclamationsParPriorite,
  getEvolutionMensuelle
};