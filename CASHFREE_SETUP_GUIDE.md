# 🚀 Cashfree Payment Gateway Setup Guide

## ❌ Current Issue
The payment is failing with **401 Unauthorized** because you're using placeholder credentials:
- `x-client-id: YOUR_ACTUAL_CLIENT_ID`
- `x-client-secret: YOUR_ACTUAL_CLIENT_SECRET`

## ✅ Solution: Get Real Cashfree Credentials

### Step 1: Create Cashfree Account
1. Go to: https://merchant.cashfree.com/
2. Sign up for a free account
3. Complete verification process

### Step 2: Get API Credentials
1. Login to your Cashfree merchant dashboard
2. Go to **Settings** → **API Keys**
3. Copy your **Client ID** and **Client Secret**

### Step 3: Create .env File
Create a `.env` file in your project root with:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=expense_tracker

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cashfree Payment Gateway Configuration
CASHFREE_CLIENT_ID=your_actual_client_id_from_cashfree
CASHFREE_CLIENT_SECRET=your_actual_client_secret_from_cashfree
CASHFREE_ENV=SANDBOX

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Step 4: Replace Placeholder Values
In `service/paymentService.js`, the current code has:
```javascript
const clientId = process.env.CASHFREE_CLIENT_ID || 'YOUR_ACTUAL_CLIENT_ID';
const clientSecret = process.env.CASHFREE_CLIENT_SECRET || 'YOUR_ACTUAL_CLIENT_SECRET';
```

Once you add the `.env` file with real credentials, these will be loaded automatically.

## 🧪 Test Credentials (For Development)
If you want to test immediately, you can use Cashfree's test credentials:

```env
CASHFREE_CLIENT_ID=TEST_CLIENT_ID
CASHFREE_CLIENT_SECRET=TEST_CLIENT_SECRET
CASHFREE_ENV=SANDBOX
```

## 🔧 Quick Fix for Testing
If you want to test the payment flow without real credentials, I can create a mock payment system. Let me know!

## 📋 Next Steps
1. Create `.env` file with real Cashfree credentials
2. Restart your server: `npm start`
3. Test payment flow
4. Payment should work! 🎉

## 🆘 Need Help?
- Cashfree Documentation: https://docs.cashfree.com/
- Support: https://support.cashfree.com/
