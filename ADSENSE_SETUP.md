# Configuration Google AdSense

## 📋 Présentation

Votre site FlashPrint est maintenant prêt pour la monétisation avec Google AdSense. Des emplacements publicitaires ont été intégrés aux endroits stratégiques suivants :

### Page d'accueil (Index)
- **Bannière supérieure** - Après la section héro
- **Rectangle milieu** - Entre les sections Services et Bibliothèque

### Page de visualisation des syllabus (SyllabusView)
- **Bannière horizontale** - Après les informations du cours
- **Rectangle milieu** - Avant les boutons de téléchargement

---

## 🚀 Étapes de configuration

### 1. Créer un compte Google AdSense

1. Rendez-vous sur [https://www.google.com/adsense](https://www.google.com/adsense)
2. Cliquez sur "Commencer"
3. Connectez-vous avec votre compte Google
4. Remplissez les informations de votre site web : `https://votre-domaine.com`
5. Complétez vos informations de paiement

⏳ **Temps d'approbation** : Généralement 1-2 semaines pour l'examen de votre site

---

### 2. Récupérer votre ID éditeur

Une fois votre compte approuvé :

1. Connectez-vous à [AdSense](https://www.google.com/adsense)
2. Allez dans **Compte** → **Paramètres**
3. Notez votre **ID éditeur** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

---

### 3. Remplacer l'ID dans le code

Vous devez remplacer `ca-pub-XXXXXXXXXX` par votre vrai ID éditeur dans **2 fichiers** :

#### Fichier 1 : `index.html`
```html
<!-- Ligne ~62 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-VOTRE_ID_ICI"
        crossorigin="anonymous"></script>
```

#### Fichier 2 : `src/components/AdSense.tsx`
```tsx
// Ligne ~22
data-ad-client="ca-pub-VOTRE_ID_ICI"
```

---

### 4. Créer vos emplacements publicitaires (Slots)

1. Dans AdSense, allez à **Annonces** → **Par unité d'annonce**
2. Cliquez sur "**Créer une unité d'annonce**"
3. Créez **4 unités** avec ces paramètres :

| Nom de l'unité | Type | Emplacement dans le code | Fichier |
|----------------|------|--------------------------|---------|
| Homepage Top Banner | Bannière horizontale | `slot="1234567890"` | `src/pages/Index.tsx` ligne ~22 |
| Homepage Mid Rectangle | Rectangle | `slot="2345678901"` | `src/pages/Index.tsx` ligne ~27 |
| Syllabus Top Banner | Bannière horizontale | `slot="3456789012"` | `src/pages/SyllabusView.tsx` ligne ~231 |
| Syllabus Mid Rectangle | Rectangle | `slot="4567890123"` | `src/pages/SyllabusView.tsx` ligne ~281 |

4. Pour chaque unité créée, copiez l'**ID de l'emplacement** (ex: `1234567890`)
5. Remplacez les numéros de slots dans les fichiers correspondants

---

## 📊 Exemple de remplacement de slot

**Avant** (dans `Index.tsx`) :
```tsx
<AdSense slot="1234567890" format="horizontal" />
```

**Après** (avec votre vrai slot ID) :
```tsx
<AdSense slot="9876543210" format="horizontal" />
```

---

## ✅ Vérification

Une fois configuré :

1. Déployez votre site
2. Attendez quelques heures (AdSense peut prendre jusqu'à 24h pour afficher les annonces)
3. Visitez votre site pour vérifier que les annonces apparaissent
4. Les annonces peuvent montrer "Annonces de test" au début

---

## 💡 Conseils d'optimisation

### Placement des annonces
✅ **Actuellement configuré** (positions optimales) :
- Au-dessus du contenu principal (haute visibilité)
- Entre les sections de contenu (naturel)
- Avant les actions importantes (taux de clic élevé)

### Taille et formats
- **Horizontal** : Idéal pour les bannières en haut de page
- **Rectangle** : Parfait pour le milieu de contenu
- **Responsive** : Activé automatiquement (s'adapte à tous les écrans)

### Politique AdSense
⚠️ **Important** :
- Ne cliquez jamais sur vos propres annonces
- Ne demandez pas aux autres de cliquer
- Assurez-vous que votre contenu respecte les [politiques AdSense](https://support.google.com/adsense/answer/48182)

---

## 🆘 Dépannage

### Les annonces ne s'affichent pas
1. Vérifiez que votre ID éditeur est correct
2. Assurez-vous que les slots sont bien créés dans AdSense
3. Attendez 24-48h après la configuration
4. Vérifiez la console du navigateur pour les erreurs

### Message "AdSense error"
- Vérifiez que le script AdSense est bien chargé dans `index.html`
- Désactivez les bloqueurs de publicités pour tester
- Consultez la [documentation AdSense](https://support.google.com/adsense)

---

## 📈 Suivi des performances

1. Connectez-vous à [AdSense](https://www.google.com/adsense)
2. Allez dans **Rapports** pour voir :
   - Impressions publicitaires
   - Taux de clics (CTR)
   - Revenus estimés
   - Performance par emplacement

---

## 🔗 Ressources utiles

- [Centre d'aide AdSense](https://support.google.com/adsense)
- [Politiques du programme](https://support.google.com/adsense/answer/48182)
- [Optimisation des annonces](https://support.google.com/adsense/answer/9274019)
- [Formats d'annonces](https://support.google.com/adsense/answer/9183549)

---

## ⚙️ Fichiers modifiés

Les fichiers suivants contiennent des annonces AdSense :

- ✅ `index.html` - Script AdSense dans le `<head>`
- ✅ `src/components/AdSense.tsx` - Composant réutilisable
- ✅ `src/pages/Index.tsx` - 2 emplacements publicitaires
- ✅ `src/pages/SyllabusView.tsx` - 2 emplacements publicitaires

---

**Bon courage avec votre monétisation ! 💰**
