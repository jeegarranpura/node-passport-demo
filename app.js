const express = require('express');
const app = express();
const expressEjsLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require("passport");
const session = require('express-session');
const { ensureAuthenticated } = require('./config/auth')

//Passport Config
require('./config/passport')(passport);


//public files
const staticPath = path.join(__dirname, 'public')
app.use(express.static(staticPath));

app.set('view engine', 'ejs');

//database connection
mongoose.connect("mongodb://localhost:27017/nodeDemo",{
    useNewUrlParser : true,
    useUnifiedTopology : true })
    .then(() => console.log("Mongo is on"))
    .catch((err) => console.log('err'+ err));

//Bodyparser
app.use(express.urlencoded({
    extended : false
}));

//Express session midelware
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized :true
}));


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());


//global veriable
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


app.use('/user',require('./routes/user'));

app.get('/dashboard',ensureAuthenticated ,(req,res) =>{
    res.render('index' , {
        name : req.user.name
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => { 
    console.log(`your port is running ${port}`);
});