const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./User').sequelize; 

// Model ProfileUpdate
const ProfileUpdate = sequelize.define('ProfileUpdate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'id',
    },
    onDelete: 'CASCADE', 
  },
  field_updated: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  old_value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  new_value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW, 
  },
}, {
  tableName: 'profile_updates',  
  timestamps: false, 
});

module.exports = { ProfileUpdate };
