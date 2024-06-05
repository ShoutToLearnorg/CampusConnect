const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

module.exports = (app) => {
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:8100',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
};
