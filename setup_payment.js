const { sequelize } = require('./config/db');
const paymentMigration = require('./migrations/004_create_payment_tables');

const setupPaymentSystem = async () => {
    try {
        console.log('🚀 Setting up Payment System...\n');
        
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        
        // Create payment tables
        console.log('\n📊 Creating payment tables...');
        await paymentMigration.up();
        
        // Import and setup associations
        console.log('\n🔗 Setting up model associations...');
        require('./models/associations');
        console.log('✅ Model associations configured successfully.');
        
        // Test payment service
        console.log('\n💳 Testing payment service...');
        const paymentService = require('./service/paymentService');
        console.log('✅ Payment service loaded successfully.');
        
        // Test payment storage service
        console.log('\n💾 Testing payment storage service...');
        const paymentStorageService = require('./service/paymentStorageService');
        console.log('✅ Payment storage service loaded successfully.');
        
        console.log('\n🎉 Payment system setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Add your Cashfree API credentials to .env file');
        console.log('2. Restart your server');
        console.log('3. Test the payment flow');
        
        return true;
    } catch (error) {
        console.error('❌ Error setting up payment system:', error);
        return false;
    }
};

// Run setup if this file is executed directly
if (require.main === module) {
    setupPaymentSystem()
        .then((success) => {
            if (success) {
                console.log('\n✅ Setup completed successfully!');
                process.exit(0);
            } else {
                console.log('\n❌ Setup failed!');
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('❌ Setup error:', error);
            process.exit(1);
        });
}

module.exports = setupPaymentSystem;
