const express = require('express');
const router = express.Router();
const db = require('../../models');

// GET /user

router.get('/user', (req, res)=>{
    res.end();
})

// POST /user

router.post('/user', (req, res, next)=>{
    db.User.create({username: req.body.user.name}).then((newUser)=>{
        res.json(newUser);
    }).catch((err)=>{
        console.log(err);
        next(err);
    })
})
module.exports = router;