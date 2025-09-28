const { sequelize } = require('./config/db');
const migration = require('./migrations/003_fix_totalexpense_column');

async function runMigration() {
  try {
    console.log('Starting migration...');
    await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
