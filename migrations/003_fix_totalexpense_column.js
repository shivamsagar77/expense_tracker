const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the column exists with the wrong name
      const tableDescription = await queryInterface.describeTable('signup');
      
      if (tableDescription.totalexpene) {
        // Rename the column from totalexpene to totalexpense
        await queryInterface.renameColumn('signup', 'totalexpene', 'totalexpense');
        console.log('Column renamed from totalexpene to totalexpense');
      } else if (!tableDescription.totalexpense) {
        // If neither column exists, add the correct one
        await queryInterface.addColumn('signup', 'totalexpense', {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0.00,
        });
        console.log('Added totalexpense column');
      } else {
        console.log('totalexpense column already exists');
      }
    } catch (error) {
      console.error('Error in migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Check if the column exists
      const tableDescription = await queryInterface.describeTable('signup');
      
      if (tableDescription.totalexpense) {
        // Rename back to the wrong name (for rollback)
        await queryInterface.renameColumn('signup', 'totalexpense', 'totalexpene');
        console.log('Column renamed back from totalexpense to totalexpene');
      }
    } catch (error) {
      console.error('Error in rollback:', error);
      throw error;
    }
  }
};
