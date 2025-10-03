# Payment System Setup Guide

## 🚀 Complete Payment System Setup

Your expense tracker now has a complete payment system integrated with Cashfree. Follow these steps to set it up:

## 📋 Prerequisites

1. **Cashfree Account**: Sign up at https://merchant.cashfree.com/
2. **Database**: PostgreSQL database running
3. **Node.js**: Version 18 or higher

## 🔧 Setup Steps

### Step 1: Create .env File

Create a `.env` file in your project root with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Session Secret
SESSION_SECRET=your-session-secret-change-in-production

# Cashfree Payment Gateway Configuration
CASHFREE_ENV=SANDBOX
CASHFREE_CLIENT_ID=your_cashfree_client_id_here
CASHFREE_CLIENT_SECRET=your_cashfree_client_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 2: Get Cashfree API Credentials

1. Go to https://merchant.cashfree.com/
2. Sign up/Login to your account
3. Navigate to **Settings → API Keys**
4. Copy your **Client ID** and **Client Secret**
5. Update the `.env` file with your actual credentials

### Step 3: Setup Payment Tables

Run the payment setup script:

```bash
node setup_payment.js
```

This will:
- Create all payment-related database tables
- Setup model associations
- Test the payment services

### Step 4: Start Your Server

```bash
npm start
```

## 🎯 Payment Features

### Available Payment Routes

- **GET /payment** - Payment page
- **POST /payment-api/create-order** - Create payment order
- **GET /payment-api/status/:orderId** - Check payment status
- **GET /payment-api/order/:orderId** - Get order details
- **POST /payment-api/callback** - Handle payment callbacks
- **GET /payment-success** - Payment success page

### Payment Flow

1. User clicks "Upgrade to Premium" on dashboard
2. Redirects to `/payment` page
3. User fills payment form
4. Creates order via `/payment-api/create-order`
5. Redirects to Cashfree payment gateway
6. User completes payment
7. Returns to `/payment-success` page
8. User is upgraded to premium

## 🗄️ Database Tables

The payment system creates these tables:

- `payments` - Main payment records
- `payment_gateway_details` - Gateway-specific data
- `payment_method_details` - Payment method details (UPI, cards, etc.)
- `payment_surcharge_details` - Surcharge information
- `payment_offers` - Applied offers/discounts
- `international_payment_details` - International payment data
- `payment_error_details` - Error information

## 🔍 Testing

### Test Payment Flow

1. Login to your app
2. Go to dashboard
3. Click "Upgrade to Premium"
4. Fill payment form
5. Complete payment on Cashfree gateway
6. Verify premium upgrade

### Debug Information

The system includes comprehensive logging:
- Payment service initialization
- API request/response logging
- Error handling and reporting

## 🛠️ Troubleshooting

### Common Issues

1. **401 Authentication Error**
   - Check your Cashfree API credentials
   - Ensure `.env` file is properly configured
   - Verify credentials in Cashfree dashboard

2. **Database Connection Error**
   - Check database configuration
   - Ensure PostgreSQL is running
   - Verify database credentials

3. **Payment Tables Not Created**
   - Run `node setup_payment.js`
   - Check database permissions
   - Verify model associations

### Debug Commands

```bash
# Test database connection
node -e "require('./config/db').sequelize.authenticate().then(() => console.log('DB OK')).catch(console.error)"

# Test payment service
node -e "console.log(require('./service/paymentService'))"

# Check environment variables
node -e "console.log(process.env.CASHFREE_CLIENT_ID ? 'SET' : 'NOT_SET')"
```

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure Cashfree credentials are correct
4. Check database connection and tables

## 🎉 Success!

Once everything is set up, your expense tracker will have:
- ✅ Complete payment processing
- ✅ Premium user management
- ✅ Secure payment gateway integration
- ✅ Comprehensive payment tracking
- ✅ Modern payment UI

Happy coding! 🚀
