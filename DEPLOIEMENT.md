# Déployer Griot en dehors de Claude

## Ce que contient ce dossier
- `index.html` — l'appli Griot (front-end), déjà modifiée pour appeler `/api/generate` au lieu d'appeler Anthropic directement.
- `api/generate.js` — le backend : c'est lui qui garde la vraie clé API secrète et parle à Anthropic à ta place.
- `package.json` — fichier minimal requis par l'hébergeur.

## Étape 1 — Obtenir une vraie clé API Anthropic (séparée de Claude.ai)
1. Va sur console.anthropic.com et crée un compte "API" (différent de ton compte Claude.ai).
2. Ajoute un moyen de paiement et crée une clé API (elle commence par `sk-ant-...`).
3. Garde cette clé secrète — ne jamais la mettre dans `index.html`.

## Étape 2 — Héberger sur Vercel (gratuit pour démarrer)
1. Crée un compte sur vercel.com (tu peux te connecter avec GitHub).
2. Mets ce dossier `griot-app` dans un dépôt GitHub (ou utilise `vercel` en ligne de commande si tu es à l'aise avec le terminal).
3. Dans Vercel, clique "Add New Project" → sélectionne ce dépôt → Deploy.
4. Une fois déployé, va dans **Settings → Environment Variables** et ajoute :
   - Nom : `ANTHROPIC_API_KEY`
   - Valeur : ta clé `sk-ant-...` de l'étape 1
5. Redéploie le projet (Vercel te le proposera automatiquement).

## Étape 3 — Brancher le nom de domaine griot.ai
1. Achète `griot.ai` chez ton registrar (OVH, Namecheap, etc.) si ce n'est pas déjà fait.
2. Dans Vercel : **Settings → Domains** → ajoute `griot.ai`.
3. Vercel te donne 1 ou 2 enregistrements DNS à ajouter chez ton registrar (souvent un enregistrement A et/ou CNAME).
4. Va chez ton registrar, dans la gestion DNS du domaine, ajoute exactement ces enregistrements.
5. Attends entre 10 minutes et quelques heures que ça se propage. Vercel affichera "Valid Configuration" une fois que c'est bon.

## Ce qui marche déjà / ce qui reste
- ✅ Génération de titres, scripts, prompts image/vidéo — via le backend sécurisé.
- ✅ Historique — sauvegardé dans le navigateur de chaque visiteur (localStorage), pas encore partagé entre appareils.
- ⏳ Pas encore de compte utilisateur ni de paiement — pour l'instant, n'importe qui avec le lien peut utiliser l'outil et ça utilise ta clé API (donc ton argent). Étape suivante : ajouter un système de connexion + paiement (CinetPay/KKiaPay) avant de partager le lien publiquement.
