const express = require('express');

const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');

// get stores, home and /stores -> same location
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));

// get addstore page
router.get('/add', authController.isLoggedIn, storeController.addStore);

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

//  get register page for users
router.get('/register', userController.registerForm);

// get login for users
router.get('/login', userController.loginForm);

// post for login
router.post('/login', authController.login);

// post register from user
// 1. validate registration data - validateRegister
// 2.  register user - register
// 3. login user
router.post('/register', userController.validateRegister, userController.register, authController.login);

// log out
router.get('/logout', authController.logout);

// get user acct page
router.get('/account', authController.isLoggedIn, userController.account);

// update acct info
router.post('/account', catchErrors(userController.updateAccount));

// post when user forgets password
router.post('/account/forgot', catchErrors(authController.forgot));

// reset account
router.get('/account/reset/:token', catchErrors(authController.reset));

// update PW
router.post('/account/reset/:token', authController.confirmedPasswords, catchErrors(authController.update));

// get map page
router.get('/map', storeController.mapPage);

//  APIs
router.get('/api/search', catchErrors(storeController.searchStores));

// search stores near me using map
router.get('/api/stores/near', catchErrors(storeController.mapStores));

// post when user likes a heart
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

// view all hearts page
router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));

router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));

router.get('/top', catchErrors(storeController.getTopStores));

module.exports = router;
