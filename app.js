let express = require('express');
let mongoose = require('mongoose');
const FacebookStrategy  = require('passport-facebook').Strategy;
const passport = require('passport');
let bodyParser = require('body-parser');
let uri = 'mongodb://localhost:27017/webbanhang';
const expressSession       = require('express-session');
let app = express();
let cookieParser = require('cookie-parser');
let config = require('./constant/_config')

//ROUTE
const CUSTOMER_ROUTE = require('./routes/customer');
const CATEGORY_ROUTE = require('./routes/category');
const PRODUCT_ROUTE = require('./routes/product');
const USER_ROUTE = require('./routes/user');
const DASHBOARD_ROUTE = require('./routes/dashboard');
const PROMOTION_ROUTE = require('./routes/promotion');
const ORDER_ROUTE = require('./routes/order');

//MODEL

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.set('view engine','ejs');
app.set('views', './views/');
app.use(cookieParser());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
    clientID: "1613362775516910",
    clientSecret: "e7ecd0ae17a97da53211737810fc17d8" ,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(accessToken, refreshToken, profile, done);
            return done(null, profile);
        });
    }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
    secret: 'webbanang',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
}))

app.use('/customers', CUSTOMER_ROUTE);
app.use('/orders', ORDER_ROUTE);
app.use('/categorys', CATEGORY_ROUTE);
app.use('/promotions', PROMOTION_ROUTE);
app.use('/products', PRODUCT_ROUTE);
app.use('/users', USER_ROUTE);
app.use('/dashboards', DASHBOARD_ROUTE);
// app.use('/',HOME_ROUTE);
app.get('/',(req, res) => {
    res.json({message: 'connected'});
});

// mongoose.connect(uri);

mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
    if(err) {
        console.log('Error connecting to the database. ' + err);
    } else {
        console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
    }
});
mongoose.connection.once('open', () => {
    console.log(`mongodb connected`);
    app.listen(3000,() => 
        console.log(`sever connected at port 3000`)
    )
})