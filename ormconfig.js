module.exports = {
  type: 'sqlite',
  database: process.env.DB_PATH || './data/ibm.sqlite',
  synchronize: true,
  logging: false,
  entities: [__dirname + '/dist/**/*.entity.js', __dirname + '/src/**/*.entity.ts'],
};
