'use strict';
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
        isUnique: function (value, next) {
          const self = this;
          User.find({
              where: {
                email: value
              }
            })
            .then(function (user) {
              // reject if a different user wants to use the same email
              if (user && self.id !== user.id) {
                return next('Email already in use!');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
        }
      }
    },
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
    if (user.changed('password')) {
      let hash = bcrypt.hashSync(user.password, 10);
      user.password = hash;
    }
  });
  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  }
  return User;
};