const db = require('./../models');
const config = require('./../config/env.js');
const validator = require('validator');
const jwt = require('jwt-simple');
const sequelize = require('sequelize');
function validateUser(user){
    if ( user && user.email && user.password ){
        return !validator.isEmpty(user.email) && !validator.isEmpty(user.password);
    }else{
        return false;
    } 
}
function signup(req, res, next){
    if (!validateUser(req.body)){
        res.status(422);
        res.json({success: false, message: 'email , password is required'});
    }; 
    const {email, password} = req.body;
    const getUserByEmail = db.User.findOne({where: {email}});
    const createUser = function({email, password}){
        db.User.create({email, password}).then((newUser)=>{
            res.json({
                success: true,
                message: 'User has created'
            });
        })
        .catch(sequelize.ValidationError, function (err) {
            // respond with validation errors
            res.status(422);
            res.json({success: false, message: err.message});
        })
        .catch((err)=>{
            next(err);
        })
    }
    createUser({email, password});
}
function signin(req, res, next){
    if (!validateUser(req.body)){
        res.status(401);
        res.json({success: false, message: 'email & password is required'});
    };
    const { email, password} = req.body;
    db.User.findOne({where:{email}}).then( (user)=>{
        if (!user){
            res.status('401');
            res.json({success: false, message: 'User not found'});
        }else{
            if ( user.comparePassword(password) ){
                const token = jwt.encode({ id: user.id }, config.secretKey);
                res.json({success:true, token: token});
            }else{
                res.status('401');
                res.json({success: false, message: 'Password did not match'});
            }
        }
    }).catch(err=>{
        next(err);
    })
}
module.exports = {
    signup,
    signin
}