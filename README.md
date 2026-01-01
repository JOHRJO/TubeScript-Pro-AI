# 🎥 TubeScript Pro AI - Sécurisation API Gemini

Une solution complète de génération de scripts YouTube, désormais renforcée par une architecture backend sécurisée pour protéger vos ressources et votre clé API Google Gemini.

## 🔐 Résumé Exécutif

*   **Problématique initiale** : Clé API Gemini exposée directement dans le code frontend, vulnérable au vol et à l'usage abusif.
*   **Solution apportée** : Implémentation d'un **Proxy Backend** robuste servant de rempart entre le client et l'API Google.
*   **Impact** : Confidentialité totale de la clé API, contrôle des coûts via rate-limiting, et accès restreint aux utilisateurs authentifiés.

---

## 📁 Architecture du Projet

L'application est structurée pour séparer les responsabilités et maximiser la sécurité :

```text
TubeScript Pro AI/
├── backend/                # Serveur Node.js / Express (Proxy Sécurisé)
│   ├── server.js           # Logique proxy, Auth et Rate Limiting
│   ├── package.json        # Dépendances backend
│   └── DEPLOYMENT_GUIDE.md # Instructions de mise en ligne
├── services/               # Services frontend (Appels API)
│   └── geminiService.ts    # Client modifié pour pointer vers le backend
├── components/             # Composants UI (Script, SEO, Icons)
├── App.tsx                 # Logique principale (Auth + Génération)
├── SECURITY_IMPLEMENTATION_SUMMARY.md # Détails techniques de sécurité
└── README.md               # Ce document
```

---

## ✅ Ce Qui A Été Fait

1.  **Backend Node.js/Express** : Création d'un proxy serveur pour masquer la clé API.
2.  **Authentification Layer** : Système de session par email pour limiter l'accès aux utilisateurs réels.
3.  **Rate Limiting** : Restriction à **5 requêtes par minute par IP** pour prévenir le spam et les surcoûts.
4.  **Logic de Retry Automatique** : Gestion intelligente des timeouts de l'API Gemini (2 tentatives).
5.  **Error Handling Sécurisé** : Masquage des erreurs système Google pour éviter la fuite d'infos.
6.  **CORS & Security Headers** : Protection contre les attaques XSS et Clickjacking via `helmet` et restrictions d'origine.

---

## 🚀 Prêt à Déployer ?

Le projet est optimisé pour les plateformes cloud modernes :
*   **Backend** : Recommandé sur **Railway** ou **Render** (détection auto du `package.json`).
*   **Frontend** : Idéal sur **Vercel** ou **Netlify**.

> 💡 Consultez le fichier [backend/DEPLOYMENT_GUIDE.md](./backend/DEPLOYMENT_GUIDE.md) pour les instructions pas à pas.

---

## 📋 Fichiers Clefs

| Fichier | Rôle |
| :--- | :--- |
| `backend/server.js` | Le "cerveau" sécurisé qui gère les appels à Gemini. |
| `services/geminiService.ts` | Interface de communication entre le React et votre Proxy. |
| `SECURITY_IMPLEMENTATION_SUMMARY.md` | Rapport détaillé des vulnérabilités corrigées. |
| `backend/DEPLOYMENT_GUIDE.md` | Votre bible pour la mise en production. |

---

## 🌟 Quick Start Local

Pour lancer l'environnement de développement sécurisé :

1.  **Configurer le Backend** :
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Éditez .env et ajoutez votre GEMINI_API_KEY
    npm run dev
    ```
2.  **Configurer le Frontend** :
    *   Dans `services/geminiService.ts`, vérifiez que `API_BASE` pointe vers `http://localhost:3000/api`.
    *   Lancez votre serveur de développement habituel pour le frontend.

---

## 🛡️ Status de Sécurité

- [x] **API Key Sécurisée** : Inaccessible depuis le navigateur.
- [x] **Auth Implémentée** : Session utilisateur requise.
- [x] **Rate Limit Actif** : Protection contre les attaques par déni de service (DoS).
- [x] **Tests Effectués** : Validation des flux de données et d'erreurs.

---

## 📌 Contact & Support

Pour toute question technique relative à la sécurité ou au déploiement, veuillez consulter le document [SECURITY_IMPLEMENTATION_SUMMARY.md](./SECURITY_IMPLEMENTATION_SUMMARY.md).

---
*Développé avec expertise pour une création de contenu YouTube sereine et sécurisée.*