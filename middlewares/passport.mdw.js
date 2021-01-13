const userModel = require('../models/students.model');

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');

passport.serializeUser(function(user, done) {
    done(null, user.s_ID);
});

passport.deserializeUser(function(id, done) {
  userModel.single(id).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        console.log(err);
    })
});

passport.use(new LocalStrategy(
    function (username,password,done) {
      userModel.singleByUserName(username).then(function (user) {
            bcrypt.compare(password, user.s_Password, function (err,result) {
                if (err) { return done(err); }
                if(!result) {
                    return done(null, false, { message: 'Incorrect username and password' });
                }
                return done(null, user);
            })
        }).catch(function (err) {
            return done(err);
        })
    }
));

module.exports = {
    passport,
};