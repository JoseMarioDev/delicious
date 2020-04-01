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
router.post('/add', catchErrors(storeController.createStore));
// editing current store
router.post('/add/:id', catchErrors(storeController.updateStore));

// route for edit store
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

module.exports = router;
