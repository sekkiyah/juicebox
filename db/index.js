const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  port: 5433,
  database: 'juicebox-dev',
  user: 'postgres',
  password: process.env.PGPASSWORD,
});

const getAllUsers = async () => {
  const { rows } = await client.query(`
    SELECT id, username
    FROM users;
  `);

  return rows;
};

async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;`,
      [username, password]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
};
