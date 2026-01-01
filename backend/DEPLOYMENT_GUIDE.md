# 🚀 Guide de Déploiement TubeScript Pro AI

Ce document détaille les étapes pour configurer, tester et déployer l'application TubeScript avec son backend proxy sécurisé.

---

## 1. Configuration Locale (Setup Local)

### Backend
1. Naviguez dans le dossier backend : `cd backend`
2. Installez les dépendances : `npm install`
3. Créez votre fichier d'environnement : `cp .env.example .env`
4. Éditez `.env` et ajoutez votre clé API :
   ```env
   GEMINI_API_KEY=votre_cle_api_google_aici
   PORT=3000
   NODE_ENV=development
   ```
5. Lancez le serveur en mode développement : `npm run dev`

### Frontend
1. Installez les dépendances à la racine du projet : `npm install`
2. Lancez le client : `npm run dev` (si applicable) ou ouvrez `index.html`.

---

## 2. Variables d'Environnement

Le backend utilise les variables suivantes dans son environnement de production :

| Variable | Description | Défaut |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Clé API Google AI Studio (Obligatoire) | - |
| `PORT` | Port d'écoute du serveur Express | `3000` |
| `NODE_ENV` | Mode d'exécution (`production` ou `development`) | `production` |
| `CORS_ORIGIN` | URL du frontend autorisé (ex: `https://mon-app.vercel.app`) | `*` |

---

## 3. Déploiement Backend (Railway / Render)

### Étapes Railway
1. Créez un nouveau projet sur [Railway](https://railway.app/).
2. Liez votre dépôt GitHub.
3. Railway détectera automatiquement le `package.json` dans le sous-dossier `backend/`. Configurez le **Root Directory** sur `backend` dans les paramètres.
4. **Build Command** : `npm install`
5. **Start Command** : `node server.js`
6. **Variables d'env** : Ajoutez `GEMINI_API_KEY` dans le tableau de bord Railway.
7. Notez l'URL générée (ex: `https://tubescript-api.up.railway.app`).

---

## 4. Configuration & Déploiement Frontend

### Liaison avec le Backend
Dans le fichier `services/geminiService.ts`, mettez à jour la constante `API_BASE` avec l'URL de votre backend déployé :

```typescript
// services/geminiService.ts
const API_BASE = 'https://votre-backend-railway.app/api'; 
```

### Déploiement (Vercel / Netlify)
1. Build du projet React : `npm run build`
2. Déployez le dossier `dist/` ou liez le repo GitHub à Vercel.
3. Assurez-vous que le backend autorise l'URL Vercel via CORS.

---

## 5. Tests de Fonctionnement

### Authentification
Testez la route de login avec `curl` ou Postman :
```bash
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
```
*Vérifiez que vous recevez un token et qu'il est stocké dans le `localStorage` du navigateur sous `ts_token`.*

### Génération & Rate Limit
1. Effectuez une génération de script.
2. Vérifiez que le header `Authorization: Bearer <token>` est bien envoyé.
3. Testez la limite : Si vous envoyez plus de 5 requêtes par minute, vous devez recevoir une erreur `429 Too Many Requests`.

---

## 6. Monitoring & Logs

- **Backend** : Utilisez `railway logs` ou la console Render pour surveiller les erreurs `500` ou les timeouts de Gemini.
- **Erreurs Gemini** : Le serveur loggue les erreurs avec un timestamp pour faciliter le debug.
- **Rate Limit** : Surveillez les logs pour voir si des IPs sont bloquées de manière répétitive.

---

## 7. Dépannage (Troubleshooting)

- **CORS Errors** : Si le frontend ne peut pas contacter le backend, vérifiez que `cors()` est configuré avec l'URL exacte de votre frontend.
- **Auth Fails (403)** : Vérifiez que le token dans le `localStorage` n'est pas corrompu. En cas de doute, videz le cache et reconnectez-vous.
- **Timeout (504)** : L'API Gemini peut être lente. Le backend inclut une logique de **Retry x2**. Si cela persiste, vérifiez le quota de votre clé API sur Google AI Studio.
