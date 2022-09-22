const {
  client,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  getAllPosts,
  getPostsByUser,
  createPost,
  updatePost,
} = require('./index');

async function dropTables() {
  try {
    console.log('Starting to drop tables...');
    await client.query(`
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
    `);
    console.log('Finished dropping tables!');
  } catch (error) {
    console.error('Error dropping tables!');
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Starting to build tables...');
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        location varchar(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);
    await client.query(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);
    console.log('Finished building tables!');
  } catch (error) {
    console.error('Error building tables!');
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log('Starting to create users...');

    await createUser({
      username: 'albert',
      password: 'bertie99',
      name: 'albert',
      location: 'chicago',
    });
    await createUser({
      username: 'sandra',
      password: '2sandy4me',
      name: 'sandra',
      location: 'seattle',
    });
    await createUser({
      username: 'glamgal',
      password: 'soglam',
      name: 'gloria',
      location: 'dallas',
    });

    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    console.error(error);
  }
}

async function testDB() {
  try {
    console.log('Starting to test database...');

    console.log('Calling getAllUsers');
    const users = await getAllUsers();
    console.log('Result:', users);

    console.log('Calling updateUser on users[0]');
    const updateUserResult = await updateUser(users[0].id, {
      name: 'Newname Sogood',
      location: 'las vegas',
    });
    console.log('Result:', updateUserResult);

    console.log('Finished database tests!');
  } catch (error) {
    console.error('Error testing database!');
    console.error(error);
  } finally {
    client.end();
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
