const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//model
const User = require('../models/User')
const passport = require('passport');


router.get('/login', (req,res) => {
    res.render('loginPage');
});


router.get('/register', (req,res) => {
    res.render('registerPage');
});


router.post('/register', (req,res) => {
    const {name,email,password,password2} = req.body;
    let error = [];

    if(!name || !email || !password || !password2){
        error.push({ msg :" Please fillup  all fields"});
    }

    if(password !== password2){
        error.push({ msg : " Password do not match"});
    }
    if(password.length < 8){
        error.push({msg : "Password atleast 8 charachter"});
    }

    if(error.length > 0){
        res.render('registerPage',{
            error,
            name,
            email,  
            password,
            password2});
    }
    else
    {
        //validation pass
        User.findOne({ email : email }).
        then(user => {
            if(user){
                error.push({msg : "Email already exists"})
                res.render('registerPage',{
                    error,
                    name,
                    email,  
                    password,
                    password2});
        }
        else{
            const newUser = new User({
                name,
                email,
                password
            });
            //hase
            bcrypt.hash(newUser.password,10,function (err, hash){
                if(!err){
                    newUser.password = hash;
                    newUser.save()
                    .then( user => {
                        req.flash('success_msg', 'You r now Register an go login ');
                        res.redirect('/user/login');
                    })
                    .catch( err => console.log("err" + err));
                }
            });
        }
        });
    }    
});


//Login Handle
router.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true

    })(req, res, next);
});

module.exports = router;