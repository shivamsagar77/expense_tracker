const { sequelize } = require('../config/db');

const createPaymentTables = async () => {
    try {
        console.log('Creating payment tables...');
        
        // Import all payment models to ensure they're registered
        require('../models/Payment');
        require('../models/PaymentGatewayDetail');
        require('../models/PaymentMethodDetail');
         require('../models/PaymentSurchargeDetail');
        require('../models/PaymentOffer');
        require('../models/InternationalPaymentDetail');
        require('../models/PaymentErrorDetail');
        
        // Sync all models with database
        await sequelize.sync({ force: false });
        
        console.log('✅ Payment tables created successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error creating payment tables:', error);
        return false;
    }
};

const rollbackPaymentTables = async () => {
    try {
        console.log('Rolling back payment tables...');
        
        // Drop payment tables in reverse order
        await sequelize.query('DROP TABLE IF EXISTS payment_error_details CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS payment_offers CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS international_payment_details CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS payment_surcharge_details CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS payment_method_details CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS payment_gateway_details CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS payments CASCADE;');
        
        console.log('✅ Payment tables rolled back successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error rolling back payment tables:', error);
        return false;
    }
};

module.exports = {
    up: createPaymentTables,
    down: rollbackPaymentTables
};
