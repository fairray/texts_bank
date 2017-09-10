const db = require('./../models');
const config = require('./../config/env.js');
const validator = require('validator');
var jwt = require('jwt-simple');
function validateUser(user){
    if ( user && user.username && user.password ){
        return !validator.isEmpty(user.username) && !validator.isEmpty(user.password);
    }else{
        return false;
    } 
}
function signup(req, res, next){
    if (!validateUser(req.body)){
        res.status(401);
        res.json({success: false, message: 'username, password is required'});
    }; 
    const {username, password} = req.body;
    db.User.create({username, password}).then((newUser)=>{
        res.json({
            success: true,
            message: 'User has created'
        });
    }).catch((err)=>{
        next(err);
    })
}
function signin(req, res, next){
    if (!validateUser(req.body)){
        res.status(401);
        res.json({success: false, message: 'username & password is required'});
    };
    const { username, password} = req.body;
    db.User.findOne({where:{username}}).then( (user)=>{
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