# Quatuor

Un jeu de mots en pixel art : seize mots cachent quatre groupes de quatre. À toi de trouver ce qui les relie.

*English version: [README.en.md](README.en.md)*

## Grille du jour et grilles surprises (nouveau en 1.3.0)

**Grille du jour** : la même grille pour tout le monde, nouvelle chaque jour, avec sa série de jours réussis d'affilée. **Grille surprise** : une grille neuve à chaque clic, sans fin. Ces grilles piochent un groupe de chaque couleur (jaune le plus simple, violet le plus retors) dans une banque de près de 400 groupes : ceux des 80 grilles et 75 nouveaux (fromages, volcans, Molière, « avoir la frite », palindromes, mots qui cachent un nombre…). Deux groupes qui se ressemblent ne tombent jamais ensemble.

## Commandes

- **Clic** sur un mot, ou **flèches** puis **Espace** : choisir ou retirer un mot.
- **Entrée** ou **VALIDER** : proposer les quatre mots choisis.
- **M** ou **MÉLANGER** : mélanger les mots qui restent.
- **Retour** ou **EFFACER** : tout désélectionner.

## Comment ça marche

- Les groupes peuvent être simples (des planètes, des fromages) ou retors (des mots qui suivent « coup de », un pays caché dans un mot, des mots qui se lisent dans les deux sens).
- Chaque grille a des **pièges** : des mots qui semblent aller dans deux groupes. Un seul rangement marche pour les seize.
- Un groupe trouvé devient une bande de couleur : **jaune** pour le plus simple, puis vert, bleu, et **violet** pour le plus retors.
- **Quatre erreurs** permises. « À un près ! » quand trois mots sur quatre sont bons. Une même proposition ne compte jamais deux fois.
- Après quatre erreurs, les groupes manquants se dévoilent un par un.
- **Quatre-vingts grilles** écrites à la main. Le jeu propose toujours la prochaine grille pas encore réussie.

## Plein écran

Le bouton **Plein écran** agrandit la grille à tout l'écran (Échap pour en sortir). Hors plein écran, le jeu prend toute la hauteur que laisse la fenêtre.

## Statistiques

Le panneau Records garde le nombre de **grilles réussies**, de grilles **sans faute** et de **parties**.

## Données et synchronisation

Tes grilles réussies et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Quatuor → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
