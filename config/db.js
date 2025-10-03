// config/db.js
const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME || 'postgres';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'shivam1234';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 5432;
const dbDialect = process.env.DB_DIALECT || 'postgres';
const dbLogging = (process.env.DB_LOGGING || 'false').toLowerCase() === 'true';

// SSL flag from env, default true for RDS
const useSSL = (process.env.DB_SSL || 'true').toLowerCase() === 'true';

let sequelize;

if (process.env.DATABASE_URL) {
  // Heroku-style single DATABASE_URL with SSL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: dbLogging,
    dialectOptions: useSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false, // RDS ke liye temporary safe
          },
        }
      : {},
  });
} else {
  // Local or RDS connection
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    port: dbPort,
    logging: dbLogging,
    dialectOptions: useSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  });
}

// Optional: Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to PostgreSQL via Sequelize');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to PostgreSQL via Sequelize:', err);
  });

module.exports = { sequelize };
