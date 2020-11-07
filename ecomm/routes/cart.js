const express = require('express');
const cartsRepo = require('../repositories/carts');
const productRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router =  express.Router();

router.post('/cart/products', async (req, res) => {
  let cart;
  if(!req.session.cartId) {
    cart = cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    cart = cartsRepo.getOne(req.session.cartId);
  }

  const existingItem = cart.items.find(item => item.id === req.body.productId);

  if(existingItem) {
    existingItem.quanity++;
  } else {
    cart.item.push({ id: req.body.productId, quanity: 1});
  }

  await cartsRepo.update(card.id, {
    items: cart.items
  });

  res.redirect('/cart');
});

router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }
  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productRepo.getOne(item.id);

    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));

});

router.post('/cart/products/delete', async (req, res) => {
  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter(item => item.id !== req.body.itemId);

  await cartsRepo.update(req.session.cartId, { items });

  res.redirect('/cart');

});

module.exports = router;