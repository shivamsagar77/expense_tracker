# Expense Tracker - MVC Architecture

## 🏗️ Project Structure

Your backend now follows proper **MVC (Model-View-Controller)** architecture:

```
backend/
├── controllers/          # Business Logic Layer
│   ├── userController.js
│   ├── categoryController.js
│   ├── expenseController.js
│   ├── paymentController.js
│   └── forgotpasswordController.js
├── models/              # Data Layer
│   ├── userModel.js
│   ├── Category.js
│   ├── Expense.js
│   ├── ForgotPassword.js
│   └── [other models...]
├── views/               # Presentation Layer (EJS Templates)
│   ├── userView.ejs
│   ├── loginView.ejs
│   └── signupView.ejs
├── routes/              # Route Definitions
│   ├── userRoutes.js
│   ├── category.js
│   ├── expense.js
│   ├── payment.js
│   └── forgotpassword.js
├── middleware/          # Custom Middleware
│   └── auth.js
├── config/              # Configuration Files
│   └── db.js
├── service/             # Business Services
│   ├── paymentService.js
│   ├── paymentStorageService.js
│   └── nodemailer.js
├── app.js               # Express App Configuration
├── server.js            # Server Entry Point
└── package.json
```

## 🚀 How to Run

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
DB_HOST=localhost
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail
FRONTEND_BASE_URL=http://localhost:5173
```

### 3. Start the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 📋 API Endpoints

### User Management
- `POST /users/signup` - User registration
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile (Auth required)
- `PUT /users/profile` - Update user profile (Auth required)
- `DELETE /users/account` - Delete user account (Auth required)

### Expense Management
- `POST /expenses` - Add expense (Auth required)
- `GET /expenses` - Get user expenses (Auth required)
- `DELETE /expenses/:id` - Delete expense (Auth required)
- `GET /expenses/leaderboard` - Get leaderboard (Premium only)

### Category Management
- `GET /categories` - Get all categories (Auth required)
- `POST /categories` - Add new category (Auth required)

### Payment Management
- `POST /payment/create-order` - Create payment order (Auth required)
- `GET /payment/status/:orderId` - Check payment status (Auth required)
- `POST /payment/callback` - Payment callback handler
- `GET /payment/user-payments` - Get user payments (Auth required)

### Password Reset
- `POST /forgotpassword` - Send reset link
- `POST /forgotpassword/resetpassword/:id` - Reset password

## 🎨 Frontend Integration

Your React frontend in `sign_up/` folder works perfectly with this MVC backend:

### API Configuration
The frontend uses the API configuration in `sign_up/src/utils/api.js` which points to:
```javascript
baseURL: 'http://localhost:5000'
```

### Key Features Supported:
- ✅ User Registration & Login
- ✅ Expense Tracking
- ✅ Income Tracking (Premium users)
- ✅ Category Management
- ✅ Payment Integration
- ✅ Password Reset
- ✅ Leaderboard (Premium users)
- ✅ Data Download (Premium users)

## 🔧 MVC Components Explained

### Controllers (`/controllers`)
Handle business logic and HTTP requests:
- **userController.js**: User authentication, profile management
- **expenseController.js**: Expense CRUD operations, leaderboard
- **categoryController.js**: Category management
- **paymentController.js**: Payment processing
- **forgotpasswordController.js**: Password reset functionality

### Models (`/models`)
Define database schemas and data relationships:
- **userModel.js**: User data model with validation
- **Category.js**: Expense categories
- **Expense.js**: Expense/income records
- **ForgotPassword.js**: Password reset tokens

### Views (`/views`)
EJS templates for server-side rendering (optional):
- **loginView.ejs**: Login page template
- **signupView.ejs**: Registration page template
- **userView.ejs**: User dashboard template

### Routes (`/routes`)
Define API endpoints and middleware:
- **userRoutes.js**: User-related endpoints
- **expense.js**: Expense management endpoints
- **category.js**: Category endpoints
- **payment.js**: Payment endpoints
- **forgotpassword.js**: Password reset endpoints

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. **Login/Signup**: Returns JWT token
2. **Protected Routes**: Require `Authorization: Bearer <token>` header
3. **Middleware**: `auth.js` validates tokens

## 💳 Payment Integration

Integrated with Cashfree payment gateway:
- Order creation
- Payment status tracking
- Callback handling
- Premium user upgrades

## 🎯 Premium Features

Premium users get access to:
- Income tracking
- Leaderboard
- Data download
- Advanced analytics

## 🚀 Deployment Ready

The MVC structure is optimized for deployment:

1. **Environment Variables**: All sensitive data in `.env`
2. **Database Migrations**: Ready for production database
3. **Error Handling**: Comprehensive error management
4. **Logging**: Console logging for debugging
5. **Security**: JWT authentication, input validation

## 📱 Frontend Compatibility

Your React frontend (`sign_up/`) is fully compatible:
- All API endpoints match frontend expectations
- Authentication flow works seamlessly
- Premium features properly integrated
- Responsive design maintained

## 🔄 Development Workflow

1. **Backend Changes**: Modify controllers, models, or routes
2. **Database Changes**: Update models and run migrations
3. **API Testing**: Use the existing frontend or API tools
4. **Deployment**: Use `npm start` for production

## 📊 Database Schema

The system uses Sequelize ORM with the following main tables:
- `users` - User accounts
- `expenses` - Expense/income records
- `categories` - Expense categories
- `forgot_passwords` - Password reset tokens
- Payment-related tables for Cashfree integration

## 🛠️ Troubleshooting

### Common Issues:
1. **Database Connection**: Check `.env` database credentials
2. **JWT Errors**: Verify `JWT_SECRET` in `.env`
3. **Email Issues**: Check email service configuration
4. **Payment Issues**: Verify Cashfree credentials

### Logs:
- Server logs: Console output
- Database logs: Sequelize debug mode
- Payment logs: Cashfree webhook logs

---

## 🎉 Your MVC Architecture is Complete!

Your backend now follows industry-standard MVC architecture and is ready for:
- ✅ EC2 deployment
- ✅ Production scaling
- ✅ Team collaboration
- ✅ Feature expansion

The structure is clean, maintainable, and follows Node.js best practices!
