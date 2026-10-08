// Dictionnaire de mots-clés associés à chaque TYPE de réclamation
const motsClesType = {
  'Internet': ['internet', 'wifi', 'wi-fi', 'connexion', 'adsl', 'fibre', 'débit', 'navigation'],
  'Ligne fixe': ['ligne fixe', 'téléphone fixe', 'tonalité', 'standard téléphonique', 'fixe'],
  'Mobile': ['mobile', 'réseau mobile', '4g', '5g', 'appel', 'sms', 'signal', 'couverture'],
  'Facturation': ['facture', 'facturation', 'prélèvement', 'paiement', 'montant', 'frais', 'abonnement payé']
};

// Dictionnaire de mots-clés associés à chaque PRIORITÉ
const motsClesPriorite = {
  'Urgente': ['urgent', 'urgence', 'aucun service', 'panne totale', 'coupure totale', 'plus de réseau', 'rien ne fonctionne', 'critique'],
  'Haute': ['important', 'rapidement', 'bloqué', 'ne fonctionne pas', 'en panne', 'hors service'],
  'Basse': ['léger', 'parfois', 'occasionnel', 'mineur', 'petit problème', 'de temps en temps']
};

// Cherche si un des mots-clés d'une catégorie apparaît dans le texte
function trouverCategorie(texte, dictionnaire, valeurParDefaut) {
  const texteMinuscule = texte.toLowerCase();

  for (const categorie in dictionnaire) {
    const motsClesDeCetteCategorie = dictionnaire[categorie];

    for (const motCle of motsClesDeCetteCategorie) {
      if (texteMinuscule.includes(motCle)) {
        return categorie;
      }
    }
  }

  return valeurParDefaut;
}

const analyserDescription = (req, res) => {
  const { description } = req.body;

  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Description requise pour l\'analyse' });
  }

  const typeSuggere = trouverCategorie(description, motsClesType, 'Autre');
  const prioriteSuggeree = trouverCategorie(description, motsClesPriorite, 'Moyenne');

  res.json({
    type_reclamation: typeSuggere,
    priorite: prioriteSuggeree
  });
};

module.exports = { analyserDescription };