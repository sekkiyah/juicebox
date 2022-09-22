const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  port: 5433,
  database: 'juicebox-dev',
  user: 'postgres',
  password: process.env.PGPASSWORD,
});

async function getAllUsers() {
  const { rows } = await client.query(`
    SELECT id, username, name, location, active FROM users;
  `);

  return rows;
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
        SELECT id, username, name, location, active FROM users
        WHERE "id"=${userId};
      `);
    const posts = await getPostsByUser(userId);

    if (user) {
      user.posts = posts;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;`,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  const { rows } = await client.query(`
    SELECT id, "authorId", title, content
    FROM posts;
  `);

  return rows;
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${userId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function createPost({ authorId, title, content }) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
      INSERT INTO posts("authorId", title, content)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [authorId, title, content]
    );

    return post;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = { title, content, active }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [post],
    } = await client.query(
      `
      UPDATE posts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return post;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  getAllPosts,
  createPost,
  updatePost,
};
