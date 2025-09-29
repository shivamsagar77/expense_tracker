const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME || 'shapnerdatabase'; // Match your RDS database
const dbUser = process.env.DB_USER || 'admin'; // Match your RDS master username
const dbPassword = process.env.DB_PASSWORD || ''; // No default; must be set in .env
const dbHost = process.env.DB_HOST || 'localhost'; // Must be RDS endpoint
const dbPort = Number(process.env.DB_PORT) || 5432;
const dbDialect = process.env.DB_DIALECT || 'postgres';
const dbLogging = process.env.DB_LOGGING === 'true' ? console.log : false; // Fix logging deprecation

let sequelize;

if (process.env.DATABASE_URL) {
  // Heroku-style single DATABASE_URL with SSL
  const sslRequired = (process.env.DB_SSL || 'true').toLowerCase() === 'true';
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: dbLogging,
    dialectOptions: sslRequired
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false, // For testing; secure later
          },
        }
      : {},
  });
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    port: dbPort,
    logging: dbLogging,
    dialectOptions: {
      ssl: {
        require: true,              // Enforce SSL for RDS
        rejectUnauthorized: false,  // Allow self-signed for testing
      },
    },
  });
}

// Export the sequelize instance
module.exports = { sequelize };

// Optional: Move connection test to app or make it a method
// For now, keep it for debugging
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to PostgreSQL via Sequelize');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to PostgreSQL via Sequelize:', err.message);
  });