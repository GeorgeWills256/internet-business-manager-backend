module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL, // <- Use DATABASE_URL from Render
  synchronize: true,            // For dev; in production, consider migrations
  logging: false,
  entities: ['dist/**/*.entity.js'],
};
