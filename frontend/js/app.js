// Vérifie qu'un jeton existe ; sinon, retour à la page de connexion
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// URL de base de l'API
const API_URL = 'http://localhost:3000/api';

// Variables globales
let chartStatut = null;
let chartType = null;
let chartPriorite = null;
let chartEvolution = null;
let toutesLesReclamations = [];

// Fonction utilitaire : headers avec le jeton, pour toutes les requêtes protégées
function headersAvecToken() {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// ===== RÉCLAMATIONS =====

async function chargerReclamations() {
  try {
    const reponse = await fetch(`${API_URL}/reclamations`, {
      headers: headersAvecToken()
    });
    const reclamations = await reponse.json();

    afficherReclamations(reclamations);
    afficherStatsGenerales(reclamations);
  } catch (erreur) {
    console.error('Erreur lors du chargement des réclamations :', erreur);
  }
}

function afficherReclamations(reclamations) {
  toutesLesReclamations = reclamations;

  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';

  reclamations.forEach((reclamation) => {
    const ligne = document.createElement('tr');

    ligne.innerHTML = `
      <td>${reclamation.id_reclamation}</td>
      <td>${reclamation.id_client}</td>
      <td>${reclamation.type_reclamation}</td>
      <td>${reclamation.description}</td>
      <td>${reclamation.statut}</td>
      <td>${reclamation.priorite}</td>
      <td>${new Date(reclamation.date_ouverture).toLocaleDateString('fr-FR')}</td>
      <td>
        <button class="btn-action" data-id="${reclamation.id_reclamation}">Voir</button>
      </td>
    `;

    tbody.appendChild(ligne);
  });
}

function afficherStatsGenerales(reclamations) {
  const total = reclamations.length;
  const ouvertes = reclamations.filter(r => r.statut === 'Ouverte').length;
  const resolues = reclamations.filter(r => r.statut === 'Résolue').length;
  const urgentes = reclamations.filter(r => r.priorite === 'Urgente').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-ouvertes').textContent = ouvertes;
  document.getElementById('stat-resolues').textContent = resolues;
  document.getElementById('stat-urgentes').textContent = urgentes;
}

// ===== GRAPHIQUE : PAR STATUT =====

async function chargerChartStatut() {
  try {
    const reponse = await fetch(`${API_URL}/stats/par-statut`, {
      headers: headersAvecToken()
    });
    const donnees = await reponse.json();

    const labels = donnees.map(d => d.statut);
    const valeurs = donnees.map(d => d.nombre);

    const couleursParStatut = {
      'Ouverte': '#fb7185',
      'En cours': '#a78bfa',
      'Résolue': '#2dd4bf',
      'Fermée': '#64748b'
    };
    const couleurs = donnees.map(d => couleursParStatut[d.statut] || '#cbd5e1');

    const ctx = document.getElementById('chart-statut');

    chartStatut = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: valeurs,
          backgroundColor: couleurs
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e2e8f0' }
          }
        }
      }
    });
  } catch (erreur) {
    console.error('Erreur lors du chargement du graphique par statut :', erreur);
  }
}

// ===== GRAPHIQUE : PAR TYPE =====

async function chargerChartType() {
  try {
    const reponse = await fetch(`${API_URL}/stats/par-type`, {
      headers: headersAvecToken()
    });
    const donnees = await reponse.json();

    const labels = donnees.map(d => d.type_reclamation);
    const valeurs = donnees.map(d => d.nombre);

    const ctx = document.getElementById('chart-type');

    chartType = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de réclamations',
          data: valeurs,
          backgroundColor: '#22d3ee',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: '#94a3b8' },
            grid: { color: '#1e2540' }
          },
          x: {
            ticks: { color: '#94a3b8' },
            grid: { display: false }
          }
        }
      }
    });
  } catch (erreur) {
    console.error('Erreur lors du chargement du graphique par type :', erreur);
  }
}

// ===== GRAPHIQUE : PAR PRIORITÉ =====

async function chargerChartPriorite() {
  try {
    const reponse = await fetch(`${API_URL}/stats/par-priorite`, {
      headers: headersAvecToken()
    });
    const donnees = await reponse.json();

    const labels = donnees.map(d => d.priorite);
    const valeurs = donnees.map(d => d.nombre);

    const couleursParPriorite = {
      'Basse': '#2dd4bf',
      'Moyenne': '#64748b',
      'Haute': '#a78bfa',
      'Urgente': '#fb7185'
    };
    const couleurs = donnees.map(d => couleursParPriorite[d.priorite] || '#cbd5e1');

    const ctx = document.getElementById('chart-priorite');

    chartPriorite = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de réclamations',
          data: valeurs,
          backgroundColor: couleurs,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: '#94a3b8' },
            grid: { color: '#1e2540' }
          },
          y: {
            ticks: { color: '#94a3b8' },
            grid: { display: false }
          }
        }
      }
    });
  } catch (erreur) {
    console.error('Erreur lors du chargement du graphique par priorité :', erreur);
  }
}

// ===== GRAPHIQUE : ÉVOLUTION DANS LE TEMPS =====

async function chargerChartEvolution() {
  try {
    const reponse = await fetch(`${API_URL}/stats/evolution`, {
      headers: headersAvecToken()
    });
    const donnees = await reponse.json();

    const labels = donnees.map(d => {
      const date = new Date(d.mois);
      return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    });
    const valeurs = donnees.map(d => d.nombre);

    const ctx = document.getElementById('chart-evolution');

    chartEvolution = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Réclamations',
          data: valeurs,
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34, 211, 238, 0.1)',
          pointBackgroundColor: '#22d3ee',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: '#94a3b8' },
            grid: { color: '#1e2540' }
          },
          x: {
            ticks: { color: '#94a3b8' },
            grid: { display: false }
          }
        }
      }
    });
  } catch (erreur) {
    console.error('Erreur lors du chargement du graphique d\'évolution :', erreur);
  }
}

// ===== FILTRES =====

function appliquerFiltres() {
  const statut = document.getElementById('filter-statut').value;
  const type = document.getElementById('filter-type').value;
  const priorite = document.getElementById('filter-priorite').value;
  const dateDebut = document.getElementById('filter-date-debut').value;
  const dateFin = document.getElementById('filter-date-fin').value;
  const recherche = document.getElementById('filter-recherche').value;

  const params = new URLSearchParams();

  if (statut) params.append('statut', statut);
  if (type) params.append('type_reclamation', type);
  if (priorite) params.append('priorite', priorite);
  if (dateDebut) params.append('date_debut', dateDebut);
  if (dateFin) params.append('date_fin', dateFin);
  if (recherche) params.append('recherche', recherche);

  chargerReclamationsFiltrees(params);
}

async function chargerReclamationsFiltrees(params) {
  try {
    const reponse = await fetch(`${API_URL}/reclamations?${params.toString()}`, {
      headers: headersAvecToken()
    });
    const reclamations = await reponse.json();

    afficherReclamations(reclamations);
    afficherStatsGenerales(reclamations);
  } catch (erreur) {
    console.error('Erreur lors du filtrage des réclamations :', erreur);
  }
}

function reinitialiserFiltres() {
  document.getElementById('filter-statut').value = '';
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-priorite').value = '';
  document.getElementById('filter-date-debut').value = '';
  document.getElementById('filter-date-fin').value = '';
  document.getElementById('filter-recherche').value = '';

  chargerReclamations();
}

// ===== MODAL : VOIR / MODIFIER / SUPPRIMER =====

function afficherDetailReclamation(reclamation) {
  const contenu = document.getElementById('modal-contenu');

  contenu.innerHTML = `
    <p><strong>ID :</strong> ${reclamation.id_reclamation}</p>
    <p><strong>Client :</strong> ${reclamation.id_client}</p>
    <p><strong>Type :</strong> ${reclamation.type_reclamation}</p>
    <p><strong>Description :</strong> ${reclamation.description}</p>
    <p><strong>Date d'ouverture :</strong> ${new Date(reclamation.date_ouverture).toLocaleString('fr-FR')}</p>
    <p><strong>Date de clôture :</strong> ${reclamation.date_cloture ? new Date(reclamation.date_cloture).toLocaleString('fr-FR') : 'Non clôturée'}</p>

    <div class="modal-form">
      <div class="filter-group">
        <label for="modal-statut">Statut</label>
        <select id="modal-statut">
          <option value="Ouverte" ${reclamation.statut === 'Ouverte' ? 'selected' : ''}>Ouverte</option>
          <option value="En cours" ${reclamation.statut === 'En cours' ? 'selected' : ''}>En cours</option>
          <option value="Résolue" ${reclamation.statut === 'Résolue' ? 'selected' : ''}>Résolue</option>
          <option value="Fermée" ${reclamation.statut === 'Fermée' ? 'selected' : ''}>Fermée</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="modal-priorite">Priorité</label>
        <select id="modal-priorite">
          <option value="Basse" ${reclamation.priorite === 'Basse' ? 'selected' : ''}>Basse</option>
          <option value="Moyenne" ${reclamation.priorite === 'Moyenne' ? 'selected' : ''}>Moyenne</option>
          <option value="Haute" ${reclamation.priorite === 'Haute' ? 'selected' : ''}>Haute</option>
          <option value="Urgente" ${reclamation.priorite === 'Urgente' ? 'selected' : ''}>Urgente</option>
        </select>
      </div>

      <div class="modal-actions">
        <button id="modal-enregistrer" class="btn btn-primary" data-id="${reclamation.id_reclamation}">Enregistrer</button>
        <button id="modal-supprimer" class="btn btn-danger" data-id="${reclamation.id_reclamation}">Supprimer</button>
      </div>
    </div>
  `;

  document.getElementById('modal-overlay').style.display = 'flex';

  document.getElementById('modal-enregistrer').addEventListener('click', enregistrerModification);
  document.getElementById('modal-supprimer').addEventListener('click', supprimerReclamation);
}

function fermerModal() {
  document.getElementById('modal-overlay').style.display = 'none';
}

function ouvrirFormulaireAjout() {
  const contenu = document.getElementById('modal-contenu');

  contenu.innerHTML = `
    <div class="modal-form">
      <div class="filter-group">
        <label for="ajout-id-client">ID Client</label>
        <input type="number" id="ajout-id-client" placeholder="Ex: 3">
      </div>

      <div class="filter-group">
        <label for="ajout-id-agence">ID Agence</label>
        <input type="number" id="ajout-id-agence" placeholder="Ex: 1">
      </div>

      <div class="filter-group">
        <label for="ajout-description">Description</label>
        <input type="text" id="ajout-description" placeholder="Décrire la réclamation">
        <button type="button" id="ajout-analyser" class="btn btn-secondary btn-ia">Analyser </button>
      </div>

      <div class="filter-group">
        <label for="ajout-type">Type de réclamation</label>
        <select id="ajout-type">
          <option value="Internet">Internet</option>
          <option value="Ligne fixe">Ligne fixe</option>
          <option value="Mobile">Mobile</option>
          <option value="Facturation">Facturation</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="ajout-priorite">Priorité</label>
        <select id="ajout-priorite">
          <option value="Basse">Basse</option>
          <option value="Moyenne" selected>Moyenne</option>
          <option value="Haute">Haute</option>
          <option value="Urgente">Urgente</option>
        </select>
      </div>

      <div class="modal-actions">
        <button id="ajout-valider" class="btn btn-primary">Créer la réclamation</button>
      </div>
    </div>
  `;

  document.getElementById('modal-overlay').style.display = 'flex';

  document.getElementById('ajout-analyser').addEventListener('click', analyserAvecIA);
  document.getElementById('ajout-valider').addEventListener('click', creerReclamation);
}

async function creerReclamation() {
  const id_client = document.getElementById('ajout-id-client').value;
  const id_agence = document.getElementById('ajout-id-agence').value;
  const type_reclamation = document.getElementById('ajout-type').value;
  const description = document.getElementById('ajout-description').value;
  const priorite = document.getElementById('ajout-priorite').value;

  if (!id_client || !description) {
    alert('ID client et description sont obligatoires.');
    return;
  }

  try {
    const reponse = await fetch(`${API_URL}/reclamations`, {
      method: 'POST',
      headers: headersAvecToken(),
      body: JSON.stringify({ id_client, id_agence, type_reclamation, description, priorite })
    });

    if (!reponse.ok) {
      throw new Error('Échec de la création');
    }

    fermerModal();
    chargerReclamations();
  } catch (erreur) {
    console.error('Erreur lors de la création :', erreur);
    alert('Une erreur est survenue lors de la création.');
  }
}
async function analyserAvecIA() {
  const description = document.getElementById('ajout-description').value;
  const boutonAnalyser = document.getElementById('ajout-analyser');

  if (!description || description.trim() === '') {
    alert('Écris d\'abord une description à analyser.');
    return;
  }

  boutonAnalyser.textContent = 'Analyse en cours...';
  boutonAnalyser.disabled = true;

  try {
    const reponse = await fetch(`${API_URL}/ia/analyser`, {
      method: 'POST',
      headers: headersAvecToken(),
      body: JSON.stringify({ description })
    });

    if (!reponse.ok) {
      throw new Error('Échec de l\'analyse');
    }

    const suggestion = await reponse.json();

    document.getElementById('ajout-type').value = suggestion.type_reclamation;
    document.getElementById('ajout-priorite').value = suggestion.priorite;

  } catch (erreur) {
    console.error('Erreur lors de l\'analyse IA :', erreur);
    alert('Impossible d\'analyser la description pour le moment.');
  } finally {
    boutonAnalyser.textContent = '🤖 Analyser avec l\'IA';
    boutonAnalyser.disabled = false;
  }
}

async function enregistrerModification(evenement) {
  const id = evenement.target.dataset.id;
  const statut = document.getElementById('modal-statut').value;
  const priorite = document.getElementById('modal-priorite').value;

  try {
    const reponse = await fetch(`${API_URL}/reclamations/${id}`, {
      method: 'PUT',
      headers: headersAvecToken(),
      body: JSON.stringify({ statut, priorite })
    });

    if (!reponse.ok) {
      throw new Error('Échec de la mise à jour');
    }

    fermerModal();
    chargerReclamations();
  } catch (erreur) {
    console.error('Erreur lors de la mise à jour :', erreur);
    alert('Une erreur est survenue lors de la mise à jour.');
  }
}

async function supprimerReclamation(evenement) {
  const id = evenement.target.dataset.id;

  const confirmation = confirm('Es-tu sûre de vouloir supprimer cette réclamation ?');
  if (!confirmation) return;

  try {
    const reponse = await fetch(`${API_URL}/reclamations/${id}`, {
      method: 'DELETE',
      headers: headersAvecToken()
    });

    if (!reponse.ok) {
      throw new Error('Échec de la suppression');
    }

    fermerModal();
    chargerReclamations();
  } catch (erreur) {
    console.error('Erreur lors de la suppression :', erreur);
    alert('Une erreur est survenue lors de la suppression.');
  }
}

// ===== EXPORT CSV =====
// window.location.href seul ne peut pas envoyer le header Authorization,
// donc on récupère le fichier via fetch, puis on déclenche le téléchargement nous-mêmes.
async function exporterCSV() {
  try {
    const reponse = await fetch(`${API_URL}/reclamations/export`, {
      headers: headersAvecToken()
    });

    if (!reponse.ok) {
      throw new Error('Échec de l\'export');
    }

    const blob = await reponse.blob();
    const url = window.URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = 'reclamations.csv';
    lien.click();
    window.URL.revokeObjectURL(url);
  } catch (erreur) {
    console.error('Erreur lors de l\'export CSV :', erreur);
    alert('Une erreur est survenue lors de l\'export.');
  }
}

// ===== INITIALISATION =====

document.addEventListener('DOMContentLoaded', () => {
  chargerReclamations();
  chargerChartStatut();
  chargerChartType();
  chargerChartPriorite();
  chargerChartEvolution();

  document.getElementById('btn-appliquer-filtres').addEventListener('click', appliquerFiltres);
  document.getElementById('btn-reinitialiser-filtres').addEventListener('click', reinitialiserFiltres);
  document.getElementById('modal-fermer').addEventListener('click', fermerModal);
  document.getElementById('btn-add-reclamation').addEventListener('click', ouvrirFormulaireAjout);
  document.getElementById('btn-export-csv').addEventListener('click', exporterCSV);

  document.getElementById('table-body').addEventListener('click', (evenement) => {
    if (evenement.target.classList.contains('btn-action')) {
      const id = evenement.target.dataset.id;
      const reclamation = toutesLesReclamations.find(r => r.id_reclamation == id);
      if (reclamation) {
        afficherDetailReclamation(reclamation);
      }
    }
  });
});