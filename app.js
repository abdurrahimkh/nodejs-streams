const express = require('express');
require('dotenv').config();
const routes = require('./routes/routes.js');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3002;

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));

app.use('/', routes);

app.listen(PORT, () => {
  console.log('Server Connected on port ' + PORT);
});
