const mongoose = require('mongoose');

async function connect () {
  await mongoose.connect(process.env.DATABASE_URI);
}

async function disconnect () {
  await mongoose.connection.close();
}

module.exports = { connect, disconnect };

