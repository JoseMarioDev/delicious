const express = require('express');

const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// get stores, home and /stores -> same location
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

// get addstore page
router.get('/add', storeController.addStore);

// route for when you submit new store
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
// editing current store
router.post(
  '/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

// route for edit store
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

// get individual store by slug
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// get page of all tags
router.get('/tags', catchErrors(storeController.getStoresByTag));

// get individual tag
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

module.exports = router;
