// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'shivam1234', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false, // Turn off SQL logs
});

// Optional connection test
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to PostgreSQL via Sequelize');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to PostgreSQL:', err);
  });

module.exports = { sequelize };
