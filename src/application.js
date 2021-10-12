require('dotenv').config();
const envalid = require('envalid');
const express = require('express');
const morgan = require('morgan');

envalid.cleanEnv(process.env, {
  DATABASE_URI: envalid.str()
});

const messagesRoutes = require('./routes/messages.route');

const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV == 'development') {
  application.use(morgan('tiny'));
}

application.use('/messages', messagesRoutes);

module.exports = application;

