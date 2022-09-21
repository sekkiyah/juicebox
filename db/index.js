const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  port: 5433,
  database: 'juicebox-dev',
  user: 'postgres',
  password: process.env.PGPASSWORD,
});

module.exports = {
  client,
};
