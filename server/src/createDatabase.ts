import { Client } from 'pg';

const client = new Client({
  host: "localhost",
  port: 5432,
  user: 'postgres',
  password: 'victoria7',

});

async function createDatabase() {
  try {
    await client.connect();
    const res = await client.query('CREATE DATABASE kuejeriets');
    console.log('Database created successfully', res);
  } catch (err) {
    console.error('Error creating database', err);
  } finally {
    await client.end();
  }
}

createDatabase();