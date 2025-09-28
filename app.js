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

// View routes (for rendering EJS templates)
app.get("/login", (req, res) => {
  res.render('loginView', { title: 'Login' });
});

app.get("/signup", (req, res) => {
  res.render('signupView', { title: 'Sign Up' });
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
app.use("/payment", paymentRoutes);
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