const Signup = require('../models/signup');
// const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const Signup = require('../models/signup');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const userController = {
  // User Registration
  signup: async (req, res) => {
    try {
      const { name, phone, email, password } = req.body;

      // Basic validation
      if (!name || !phone || !email || !password) {
        return res.render('signupView', { 
          title: 'Sign Up',
          error: "All fields are required" 
        });
      }

      // Check if user already exists (case insensitive)
      const existingUser = await Signup.findOne({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        return res.render('signupView', { 
          title: 'Sign Up',
          error: "User already exists with this email" 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user (store email in lowercase)
      const newUser = await Signup.create({
        name,
        phone,
        email: email.toLowerCase(),
        password: hashedPassword,
        created_at: new Date(),
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          name: newUser.name,
          ispremimumuser: newUser.ispremimumuser
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Store user data in session
      req.session.userId = newUser.id;
      req.session.userName = newUser.name;
      req.session.userEmail = newUser.email;
      req.session.isPremiumUser = newUser.ispremimumuser;
      req.session.token = token;

      // Render user dashboard
      return res.render('userView', { 
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          totalexpense: newUser.totalexpense,
          ispremimumuser: newUser.ispremimumuser,
          token: token
        }
      });
    } catch (error) {
      console.error("Error in signup:", error);
      return res.render('signupView', { 
        title: 'Sign Up',
        error: "Internal Server Error. Please try again." 
      });
    }
  },

  // User Login
  login: async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('loginView', { 
        title: 'Login',
        error: 'Email and password are required.' 
      });
    }
    
    try {
      console.log('Searching for user with email:', email);
      
      // Try both lowercase and original case
      let user = await Signup.findOne({ where: { email: email.toLowerCase() } });
      if (!user) {
        user = await Signup.findOne({ where: { email: email } });
      }
      
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        return res.render('loginView', { 
          title: 'Login',
          error: 'Invalid email or password.' 
        });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.render('loginView', { 
          title: 'Login',
          error: 'Invalid email or password.' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          name: user.name,
          ispremimumuser: user.ispremimumuser
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Store user data in session
      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userEmail = user.email;
      req.session.isPremiumUser = user.ispremimumuser;
      req.session.token = token;

      // Render user dashboard
      return res.render('userView', { 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          totalexpense: user.totalexpense,
          ispremimumuser: user.ispremimumuser,
          token: token
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.render('loginView', { 
        title: 'Login',
        error: 'Server error. Please try again.' 
      });
    }
  },

  // Get User Profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await Signup.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update User Profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, phone } = req.body;

      const user = await Signup.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.update({ name, phone });

      res.status(200).json({ 
        message: 'Profile updated successfully',
        user: { id: user.id, name: user.name, phone: user.phone, email: user.email }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete User Account
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await Signup.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.destroy();
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = userController;
