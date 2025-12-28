const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => {
    console.log("SUCCESS — Connected to database!");
    client.end();
  })
  .catch((err) => {
    console.error("FAILED — Could not connect");
    console.error(err.message);
    client.end();
  });