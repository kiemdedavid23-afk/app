/**
 * API PUBLIQUE — Chez Tantie Pauline
 *
 * Responsabilités :
 * - Accès unique au GAS Public
 * - Cache local du catalogue
 * - Affichage rapide depuis le cache
 * - Rafraîchissement périodique
 * - Secours hors connexion / GAS indisponible
 *
 * Aucun secret ici.
 */

(function () {

  var GAS_PUBLIC_URL =
    'https://script.google.com/macros/s/AKfycbxJ_t4uQ2f0x4D-jy5L9oHtA8m9VnjQebLY4s_8gQpSiQJSZ5dD4M-witLu0x2fOB2GNg/exec';

  /* ==============================
     CONFIGURATION DU CACHE
     ============================== */

  var CACHE_KEY = 'tp_catalogue_cache_v1';
  var CACHE_MAX_AGE = 60 * 60 * 1000;
  var refreshPromise = null;

  function callGasPublic_(route, extraParams) {
    var url = new URL(GAS_PUBLIC_URL);
    url.searchParams.set('route', route);
    if (extraParams) {
      Object.keys(extraParams).forEach(function (key) {
        url.searchParams.set(key, extraParams[key]);
      });
    }
    return fetch(url.toString(), { method: 'GET', cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('Erreur HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
        if (!json.success) {
          var err = new Error((json.error && json.error.message) || 'Erreur inconnue.');
          err.code = json.error && json.error.code;
          throw err;
        }
        return json.data;
      });
  }

  function normalizeProduct_(p) {
    var photos = (p.photos && Array.isArray(p.photos)) ? p.photos.slice() : [];
    if (p.photoPrincipale && photos.indexOf(p.photoPrincipale) === -1) {
      photos.unshift(p.photoPrincipale);
    }
    return {
      id: p.id,
      nom: p.nom,
      prix: p.prix,
      categorie: p.categorie,
      disponibilite: p.disponibilite,
      description: p.description || '',
      descriptionCourte: '',
      imagePrincipale: p.photoPrincipale || (photos[0] || ''),
      photos: photos
    };
  }

  function readCache_() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var cache = JSON.parse(raw);
      if (!cache || !Array.isArray(cache.products) || !cache.savedAt) return null;
      return cache;
    } catch (err) {
      console.warn('[PublicAPI] Cache local illisible.', err);
      return null;
    }
  }

  function writeCache_(products) {
    try {
      var cache = { version: 1, savedAt: Date.now(), products: products };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (err) {
      console.warn('[PublicAPI] Impossible d\'enregistrer le cache.', err);
    }
  }

  function isCacheFresh_(cache) {
    if (!cache || !cache.savedAt) return false;
    return (Date.now() - cache.savedAt) < CACHE_MAX_AGE;
  }

  window.PublicAPI = {
    loadProducts: function () {
      var cache = readCache_();
      if (!cache) return Promise.resolve([]);
      return Promise.resolve(cache.products);
    },
    loadProductById: function (id) {
      var cache = readCache_();
      if (cache && Array.isArray(cache.products)) {
        var product = cache.products.find(function (p) { return String(p.id) === String(id); });
        if (product) return Promise.resolve(product);
      }
      return Promise.resolve(null);
    },
    clearCache: function () {
      try { localStorage.removeItem(CACHE_KEY); } catch (err) {}
    }
  };

})();
