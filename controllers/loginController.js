const Signup = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
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
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
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
        totalexpense: user.totalexpene,
        ispremimumuser: user.ispremimumuser
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
