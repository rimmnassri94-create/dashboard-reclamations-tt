const pool = require('../db');

const getAllReclamations = async (req, res) => {
  const { statut, type_reclamation, priorite, date_debut, date_fin, recherche } = req.query;

  let sql = 'SELECT * FROM reclamations WHERE 1=1';
  const params = [];

  if (statut) {
    params.push(statut);
    sql += ` AND statut = $${params.length}`;
  }

  if (type_reclamation) {
    params.push(type_reclamation);
    sql += ` AND type_reclamation = $${params.length}`;
  }

  if (priorite) {
    params.push(priorite);
    sql += ` AND priorite = $${params.length}`;
  }

  if (date_debut) {
    params.push(date_debut);
    sql += ` AND date_ouverture >= $${params.length}`;
  }

  if (date_fin) {
    params.push(date_fin);
    sql += ` AND date_ouverture <= $${params.length}`;
  }

  if (recherche) {
    params.push(`%${recherche}%`);
    sql += ` AND description ILIKE $${params.length}`;
  }

  sql += ' ORDER BY date_ouverture DESC';

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des réclamations' });
  }
};
const createReclamation = async (req, res) => {
  const { id_client, id_agence, type_reclamation, description, priorite } = req.body;

  if (!id_client || !description) {
    return res.status(400).json({ error: 'id_client et description sont obligatoires' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reclamations (id_client, id_agence, type_reclamation, description, priorite)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_client, id_agence, type_reclamation, description, priorite]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la réclamation' });
  }
};
const updateReclamation = async (req, res) => {
  const { id } = req.params;
  const { statut, priorite, date_cloture } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reclamations
       SET statut = COALESCE($1, statut),
           priorite = COALESCE($2, priorite),
           date_cloture = COALESCE($3, date_cloture)
       WHERE id_reclamation = $4
       RETURNING *`,
      [statut, priorite, date_cloture, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Réclamation non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la réclamation' });
  }
};
const deleteReclamation = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM reclamations WHERE id_reclamation = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Réclamation non trouvée' });
    }

    res.json({ message: 'Réclamation supprimée', reclamation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
  }
};
const { Parser } = require('json2csv');

const exportReclamationsCSV = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reclamations ORDER BY date_ouverture DESC');

    const parser = new Parser();
    const csv = parser.parse(result.rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('reclamations.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'export CSV' });
  }
};
module.exports = { getAllReclamations, createReclamation, updateReclamation, deleteReclamation, exportReclamationsCSV };