require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

// Import routes
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/category');
const expenseRoutes = require('./routes/expense');
const paymentRoutes = require('./routes/payment');
const forgotPasswordRoutes = require('./routes/forgotpassword');
const verifyRoutes = require('./routes/verify');

// Import controllers for view rendering
const userController = require('./controllers/userController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get("/", (req, res) => {
  res.render('loginView', { title: 'Expense Tracker - Login' });
});

// Test route to verify server is working
app.get("/test", (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// View routes (for rendering EJS templates)
app.get("/login", (req, res) => {
  res.render('loginView', { title: 'Login' });
});

app.get("/signup", (req, res) => {
  res.render('signupView', { title: 'Sign Up' });
});

// Add GET route for /users/signup to match the link in loginView
app.get("/users/signup", (req, res) => {
  res.render('signupView', { title: 'Sign Up' });
});

app.get("/users/login", (req, res) => {
  res.render('loginView', { title: 'Login' });
});

// Payment view route
app.get("/payment", (req, res) => {
  console.log('Payment route accessed');
  console.log('Session data:', req.session);
  
  // Check if user is logged in via session
  if (!req.session.userId) {
    console.log('User not logged in, redirecting to login');
    return res.redirect('/login');
  }
  
  // Check if we have real Cashfree credentials
  const hasRealCredentials = process.env.CASHFREE_CLIENT_ID && 
                           process.env.CASHFREE_CLIENT_ID !== 'YOUR_ACTUAL_CLIENT_ID' &&
                           process.env.CASHFREE_CLIENT_SECRET && 
                           process.env.CASHFREE_CLIENT_SECRET !== 'YOUR_ACTUAL_CLIENT_SECRET';
  
  if (!hasRealCredentials) {
    console.log('🔧 No real credentials found, showing mock payment view');
    return res.render('mockPaymentView');
  }
  
  // Get user data from session or database
  const user = {
    id: req.session.userId,
    name: req.session.userName,
    email: req.session.userEmail,
    ispremimumuser: req.session.isPremiumUser,
    token: req.session.token
  };
  
  console.log('Rendering payment view for user:', user);
  
  res.render('paymentView', { 
    title: 'Upgrade to Premium',
    user: user
  });
});

// Payment success route
app.get("/payment-success", (req, res) => {
  res.render('paymentSuccessView', { 
    title: 'Payment Successful',
    user: {
      id: req.session.userId,
      name: req.session.userName,
      email: req.session.userEmail,
      ispremimumuser: req.session.isPremiumUser,
      token: req.session.token
    }
  });
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  // Check if user is logged in via session
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  // Get user data from session
  const user = {
    id: req.session.userId,
    name: req.session.userName,
    email: req.session.userEmail,
    ispremimumuser: req.session.isPremiumUser,
    token: req.session.token,
    totalexpense: 0 // This should be fetched from database
  };
  
  res.render('userView', { 
    title: 'Dashboard',
    user: user
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.redirect('/login');
  });
});

// API routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/expenses", expenseRoutes);
app.use("/payment-api", paymentRoutes); // Changed from /payment to /payment-api to avoid conflict
app.use("/forgotpassword", forgotPasswordRoutes);
app.use("/verify", verifyRoutes);

// 404 handler
// app.use('/*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;