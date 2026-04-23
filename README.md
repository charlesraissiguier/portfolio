# Portfolio · Charles Raissiguier

Site statique — designer web freelance, Lille.

## Stack

- HTML5 pur
- Tailwind CSS via CDN Play (config light inline dans `<head>`)
- CSS custom dans `css/style.css`
- JavaScript vanilla dans `js/main.js`
- Google Fonts : DM Sans · Instrument Serif · JetBrains Mono
- SVG inline (Lucide)
- Formspree pour le traitement du formulaire de contact

Pas de build, pas de `package.json`, pas de `node_modules`. Déploiement en drag & drop sur Netlify / Vercel / GitHub Pages / OVH mutualisé.

## Lancer en local

```bash
python -m http.server 5174
# puis http://localhost:5174
```

---

## ⚠️ Placeholders à remplir avant mise en ligne

Tous les placeholders sont marqués `[PLACEHOLDER]` dans le code pour être grepable.

### 1. URLs de services externes

| Où | Quoi | Ligne(s) |
|---|---|---|
| `index.html` → `<form id="contact-form" action="...">` | URL Formspree : remplacer `https://formspree.io/f/YOUR_FORM_ID` par l'URL obtenue après création d'un formulaire sur [formspree.io](https://formspree.io) | Section Contact |
| `index.html` → footer | URL LinkedIn : remplacer `https://www.linkedin.com/in/YOUR_LINKEDIN_HANDLE` par votre profil réel | Footer |
| `index.html` → footer | Lien mentions légales : `/mentions-legales.html` — créer la page ou supprimer le lien | Footer |

### 2. Infos de contact

| Où | Quoi | Valeur placeholder actuelle |
|---|---|---|
| `index.html` section Contact | Email | `charles@example.com` (2 occurrences : lien + fallback erreur) |
| `index.html` section Contact | Téléphone | `+33 6 00 00 00 00` (2 occurrences : attribut `href="tel:..."` + texte affiché) |

### 3. Images à fournir

Placer dans le dossier `images/` (à créer à la racine).

| Fichier | Dimensions recommandées | Usage | Fallback actuel |
|---|---|---|---|
| `images/osteria-marcello.webp` | 1600 × 1000 px (ratio 16:10), < 200 ko | Screenshot du site Osteria Marcello | Carte beige avec "Osteria Marcello" en serif |
| `images/projet-2.webp` | 1600 × 1000 px (16:10) | Screenshot projet 2 | Carte beige "Projet 2" |
| `images/projet-3.webp` | 1600 × 1000 px (16:10) | Screenshot projet 3 | Carte beige "Projet 3" |
| `images/projet-4.webp` | 1600 × 1000 px (16:10) | Screenshot projet 4 | Carte beige "Projet 4" |
| `images/portrait.webp` | 600 × 600 px (carré), < 100 ko | Photo de profil section À propos | Cercle beige avec "CR" en Instrument Serif italique terracotta |

Pour mettre à jour les sources : remplacer chaque `<img src="images/...webp">` ou ajouter l'attribut `srcset` pour du responsive.

**Conseil performance** : exporter les screenshots en WebP avec [Squoosh](https://squoosh.app/) ou `cwebp -q 80 input.png -o output.webp`.

### 4. Textes à personnaliser

#### Section `#hero`
Les textes du hero sont déjà fixés (nom, métier, accroche). Modifier seulement si nécessaire.

#### Section `#realisations`

**Projet 1 — Osteria Marcello** est déjà rempli (URL live pointant vers `https://marcello-elegance.lovable.app/`).

**Projets 2, 3, 4** — à compléter pour chacun :
- `<p>` metadata : `Secteur · Ville · Année` (ex : `Cabinet dentaire · Lille · 2026`)
- `<h3>` : nom du projet
- `<p>` description : 1-2 phrases racontant l'intention (pas la technique)
- `<a href>` : URL du site live
- Remplacer `onerror` fallback par la vraie image

#### Section `#about`

- **Paragraphe 1** `[PLACEHOLDER — PARAGRAPHE 1]` : votre approche, votre philosophie. 3-4 lignes. Éviter toute référence à des dates ou à une timeline.
- **Paragraphe 2** `[PLACEHOLDER — PARAGRAPHE 2]` : pourquoi Lille, ancrage local, relation client.
- **Mini-projets perso** (3 × `[PLACEHOLDER]`) : remplacer titre, description, URL (ou supprimer la sous-section entière si tu ne veux pas la garder — bloc `<div class="mt-24 md:mt-32">`).

### 5. SEO / meta

Dans `<head>` :
- `<meta name="description">` : adapter selon votre positionnement
- `<meta name="keywords">` : ajuster si besoin
- `<meta property="og:*">` : pour les partages réseaux sociaux
- Ajouter `<meta property="og:image" content="...">` pointant vers une image 1200×630 (à créer dans `images/og-image.jpg`)

### 6. Favicon

Actuellement : SVG inline avec "C" italique terracotta. Pour un favicon plus propre, générer un set complet (16, 32, 180) sur [realfavicongenerator.net](https://realfavicongenerator.net/).

---

## Arborescence finale attendue

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/              ← à créer, contient les 5 images listées plus haut
│   ├── osteria-marcello.webp
│   ├── projet-2.webp
│   ├── projet-3.webp
│   ├── projet-4.webp
│   └── portrait.webp
├── mentions-legales.html ← optionnel, à créer
├── README.md
└── .claude/launch.json   ← config preview Claude Code
```

---

## Déploiement

### Netlify (recommandé, gratuit, 1 clic)
1. Crée un compte sur [netlify.com](https://app.netlify.com/)
2. Glisser-déposer le dossier `portfolio/` sur la page d'accueil
3. Récupérer l'URL `.netlify.app` ou brancher un domaine custom (ex : `charles-raissiguier.fr`)

### Vercel
Idem, via [vercel.com/new](https://vercel.com/new), dossier statique détecté automatiquement.

### OVH mutualisé (FTP)
FileZilla → upload dans `/www/` → terminé.

---

## Note sur Tailwind en production

Le CDN Play affiche un avertissement en console (`cdn.tailwindcss.com should not be used in production`). Fonctionnellement c'est OK pour un site statique léger. Si tu veux le purger :

```bash
npm init -y
npm i -D tailwindcss
npx tailwindcss -i ./input.css -o ./css/tailwind.min.css --minify
```
Remplacer le `<script>` CDN par `<link rel="stylesheet" href="css/tailwind.min.css">`. Gain : ~250 ko → ~12 ko.
