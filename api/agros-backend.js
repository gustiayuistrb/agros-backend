require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const serverless = require('serverless-http');

const app = express();
const { sequelize } = require('./models/User');

// Cek koneksi
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports.handler = serverless(app);
