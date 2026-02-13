

## Refonte Levels + NFTs : noms, avatars, dernier niveau "Infinity"

### Changements de noms

La progression passe a 8 niveaux. "Legende" descend au niveau 6, et un nouveau niveau ultime "Infinity" remplace l'ancien "Legende" au sommet :

| Niveau | Nom | Avatar | Palier | NFT |
|--------|-----|--------|--------|-----|
| 0 | Explorateur | 🌰 | 0 | - |
| 1 | Graine | 🌱 | 10 | Graine Originelle (Common) |
| 2 | Pousse | 🌿 | 100 | Premiere Pousse (Uncommon) |
| 3 | Racines | 🌾 | 1 000 | Gardien des Racines (Rare) |
| 4 | Canopee | 🌳 | 10 000 | Esprit de la Canopee (Epic) |
| 5 | Foret | 🌲 | 100 000 | Sentinelle de la Foret (Legendary) |
| 6 | Legende | 🌍 | 1 000 000 | Legende Vivante (Mythic) |
| 7 | Infinity | ♾️ | 10 000 000 | Infinity (Eternal) |

### Affichage du niveau actuel

- Seul le niveau actuel est affiche en "hero" (grand avatar + nom + barre de progression vers le suivant)
- Les autres niveaux ne sont visibles QUE dans la timeline fleche compacte en bas (emoji uniquement, pas de texte sauf le niveau courant)
- Chaque niveau a un "avatar" (emoji agrandi dans un cercle gradient) qui sert d'identite visuelle

### NFT Gallery

- Meme logique : seuls les NFT debloques apparaissent en grille cliquable
- Les NFT verrouilles sont en liste compacte avec barre de progression
- Le dernier NFT "Infinity" a un style special (gradient arc-en-ciel / cosmique, rarity "Eternal")

### Details techniques

**`src/components/impact/CurrentLevel.tsx`** :
- Mettre a jour le tableau LEVELS avec les 7 niveaux + le nouveau "Infinity" (level 7, emoji ♾️, target 10M)
- Renommer level 6 de "Legende" a... on garde "Legende" mais avec emoji 🌍 (ancien Biosphere)
- Le level 7 devient "Infinity" avec emoji ♾️
- L'avatar du niveau actuel utilise un cercle plus grand (w-20 h-20) avec un gradient specifique par niveau
- Le texte "Niveau maximum atteint" devient "Statut Infinity atteint"

**`src/components/impact/NftGallery.tsx`** :
- Renommer le dernier certificat : "Legende Originelle" devient le certificat du niveau 6 ("Legende Vivante", Mythic)
- Ajouter un 7e certificat : "Infinity" (10M, rarity "Eternal", gradient cosmique arc-en-ciel)
- Style special pour Infinity : gradient `from-violet-400 via-fuchsia-500 to-cyan-400`, glow plus intense

**`src/pages/Impact.tsx`** : Aucun changement necessaire, les composants sont deja integres.

