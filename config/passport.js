const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


module.exports = function(passport){
    passport.use(
        new localStrategy({ usernameField : 'email'},(email, password, done) =>{
            //match user
            User.findOne({ email : email})
            .then(user => {
                if(!user){
                    return done(null,false,{ messege : "that email is not register"});
                }

                //match pass
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) {
                        console.log("errore in bcrypt" + err);
                    }
                    if(isMatch){
                        return done(null, user);
                    }
                    else{
                        return done(null, false, { message : "Password incorrect"});
                    }

                });
            })
            .catch((err) => console.log("error" + err));

        })
    ); 


    passport.serializeUser((user,done) =>{
        done(null, user.id);
    });

    passport.deserializeUser((id,done) => {
        User.findById(id, (err, user) =>{
            done(err,user);
        });
    });

}
