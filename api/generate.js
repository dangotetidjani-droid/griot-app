// Backend proxy — cette fonction tourne côté serveur (jamais dans le
// navigateur), donc la vraie clé API reste secrète. Le front-end
// (index.html) appelle "/api/generate" au lieu d'appeler Anthropic
// directement.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API manquante côté serveur (ANTHROPIC_API_KEY non configurée).' });
  }

  const { max_tokens, messages } = req.body || {};
  if (!messages) {
    return res.status(400).json({ error: 'Requête invalide : "messages" manquant.' });
  }

  // Sécurité simple : on plafonne max_tokens pour éviter les abus/coûts imprévus.
  const safeMaxTokens = Math.min(Number(max_tokens) || 4000, 20000);

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: safeMaxTokens,
        messages
      })
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur lors de l\'appel à l\'API.' });
  }
}
