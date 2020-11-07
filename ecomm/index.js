const express = require('express');
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session');
const upload = require('multer');

const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/cart');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['9f3j32'],
  })
);
app.use(authRouter);
app.use(productsRouter)
app.use(adminProductsRouter);
app.use(cartsRouter);


const PORT = 8080

app.listen(PORT, () => {
  console.log('Listening on 8080');
});