const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 15]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  totalexpense: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ispremimumuser: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

// Instance methods
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

// Class methods
User.findByEmail = async function(email) {
  return await this.findOne({ where: { email: email.toLowerCase() } });
};

User.createUser = async function(userData) {
  const hashedPassword = await require('bcrypt').hash(userData.password, 10);
  return await this.create({
    ...userData,
    password: hashedPassword,
    email: userData.email.toLowerCase()
  });
};

module.exports = User;
