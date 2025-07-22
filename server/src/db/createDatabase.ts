import { Client } from 'pg';

const client = new Client({
  // host: "localhost",
  // port: 5432,
  // user: 'postgres',
  // password: 'victoria7',

  // host: process.env.POSTGRES_HOST,
  // port: parseInt(process.env.POSTGRES_PORT || '5432'),
  // user: process.env.POSTGRES_USER || 'postgres',
  // password: process.env.POSTGRES_PASSWORD?.toString() || 'postgres',

});

async function createDatabase() {
  try {
    await client.connect();
    const res = await client.query('CREATE DATABASE posts_db');
    console.log('Database created successfully', res);
  } catch (err) {
    console.error('Error creating database', err);
  } finally {
    await client.end();
  }
}

createDatabase();


//!exporting the current state of your database
//pg_dump -U postgres -h localhost -p 5432 -d kuejeriets_pgdata -F p -f src/db/seed.sql
//docker exec -it pg_posts psql -U postgres -c "CREATE DATABASE local_posts_db;"

