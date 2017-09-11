const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const db = require('./../models');
const config = require('./../config/env.js');
module.exports = {
    initialize: function () {
        const opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = config.secretKey;
        passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
            db.User.findOne({
                where: {
                    id: jwt_payload.id
                },
                raw: true,
                attributes: {
                    exclude: ['password']
                }
            }).then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }).catch(err => {
                done(null, false);
            })
        }));
        return passport.initialize();
    }
}