const API_URL = 'http://localhost:3000/api';

document.getElementById('login-form').addEventListener('submit', async (evenement) => {
  evenement.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const erreurEl = document.getElementById('login-erreur');

  erreurEl.textContent = '';

  try {
    const reponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const donnees = await reponse.json();

    if (!reponse.ok) {
      erreurEl.textContent = donnees.error || 'Erreur de connexion';
      return;
    }

    localStorage.setItem('token', donnees.token);
    window.location.href = 'index.html';

  } catch (erreur) {
    console.error('Erreur lors de la connexion :', erreur);
    erreurEl.textContent = 'Impossible de contacter le serveur.';
  }
});