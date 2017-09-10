'use strict';
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: { 
      type: DataTypes.STRING,
      validate: { 
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Listing);
      }
    }
  });
  User.beforeSave((user, options) => { 
    if ( user.changed('password') ){
      let hash = bcrypt.hashSync(user.password, 10);
      user.password = hash;
    }
  });
  User.prototype.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password); 
  }
  return User;
};