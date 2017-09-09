const db = require('./../models');
const config = require('./../config/env.js');
var jwt = require('jwt-simple');
function signup(req, res, next){
    const {username, password} = req.body.user;
    db.User.create({username, password}).then((newUser)=>{
        res.json({
            success: true,
            message: 'User have created'
        });
    }).catch((err)=>{
        next(err);
    })
}
function signin(req, res, next){
    const { username, password} = req.body.user;
    db.User.findOne({where:{username}}).then( (user)=>{
        if (!user){
            res.status('401');
            res.json({success: false, message: 'User not fount'});
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