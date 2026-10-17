# Portfolio — Daniel Gracy Razafinjaka Rabary

Le site s'ouvre par défaut en version 2D (`static/index.html`). Un bouton « Voir en 3D » mène à la scène WebGL (Three.js), disponible sur `/3d/`, dans laquelle l'écran de l'ordinateur affiche ce même site.
Sur mobile ou sans WebGL, la scène 3D renvoie vers la version 2D et le bouton n'apparaît pas.

## Développement

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
```

Le site généré se trouve dans `public/`.

## Contenu du site

Le contenu du site se modifie à la racine de `static/` (`index.html`, `styles.css`, `script.js`, `pic/`).

## Crédits

Scène 3D, modèles, sons et code de base : [henryheffernan/portfolio-website](https://github.com/henryjeff/portfolio-website) de Henry Heffernan, sous licence MIT (voir `LICENSE.md`).
