/* eslint-disable no-console */
const mongoose = require('mongoose');

const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'that is not a supported filetype' }, false);
    }
  },
};

exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
  // check is file to resize or not
  if (!req.file) {
    next(); // skip to next middleware
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written photo to filesystem, keep going
  next();
};

// returns view of addstore page
exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

// actually creates store
exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();
  req.flash('success', `successfully created ${store.name}.  Please leave a review`);
  res.redirect(`/store/${store.slug}`);
};

// query db for all getStores
exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'stores', stores });
};

// edit store
exports.editStore = async (req, res) => {
  // 1. find store given ID
  const store = await Store.findOne({ _id: req.params.id });
  // 2. confirm they are owner of store
  // todo
  // 3. render out edit form to update store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // set location data to be a point
  req.body.location.type = 'Point';
  // find and update store
  const store = await await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated ${store.name}.  <a href="/stores/${store.slug}">View Store -></a>`);
  // redirect and confirm success
  res.redirect(`/stores/${store._id}/edit`);
};

//  get store by slug
exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) return next();
  res.render('store', { store, title: store.name });
};
