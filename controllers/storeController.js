/* eslint-disable no-console */
const mongoose = require('mongoose');

const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
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
  // find and update store
  const store = await await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated ${store.name}.  <a href="/stores/${store.slug}">View Store -></a>`);
  // redirect and confirm success
  res.redirect(`/stores/${store._id}/edit`);
};
