let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let uri = 'mongodb://localhost:27017/webbanhang';
const expressSession       = require('express-session');
let app = express();
let cookieParser = require('cookie-parser');

//ROUTE
const CUSTOMER_ROUTE = require('./routes/customer');
const CATEGORY_ROUTE = require('./routes/category');
const PRODUCT_ROUTE = require('./routes/product');
const USER_ROUTE = require('./routes/user');
const DASHBOARD_ROUTE = require('./routes/dashboard');
const PROMOTION_ROUTE = require('./routes//promotion');

//MODEL


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.set('view engine','ejs');
app.set('views', './views/');
app.use(cookieParser());

app.use(expressSession({
    secret: 'shopCaffe',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
}))

app.use('/customers', CUSTOMER_ROUTE);
app.use('/categorys', CATEGORY_ROUTE);
app.use('/promotions', PROMOTION_ROUTE);
app.use('/products', PRODUCT_ROUTE);
app.use('/users', USER_ROUTE);
app.use('/dashboards', DASHBOARD_ROUTE);
// app.use('/',HOME_ROUTE);
app.get('/',(req, res) => {
    res.json({message: 'connected'});
});


mongoose.connect(uri);
mongoose.connection.once('open', () => {
console.log(`mongodb connected`);
app.listen(3000,() => console.log(`sever connected at port 3000`)
)
})