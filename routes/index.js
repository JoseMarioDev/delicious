const express = require('express');

const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

// get stores, home and /stores -> same location
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

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

module.exports = router;
