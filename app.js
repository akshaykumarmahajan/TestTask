'use strict';

var SwaggerExpress = require('swagger-express-mw');
var compression = require('compression');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var constant = require('./api/lib/constants.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');


global.reqlib = require('app-root-path').require;


var app = express();
module.exports = app; // for testing
//process.env.TZ = 'Australia/Sydney';

// compress all responses
app.use(compression());


// process.env.NODE_ENV = process.env.NODE_ENV || 'local'; //local
process.env.NODE_ENV = process.env.NODE_ENV || 'staging'; //staging
//process.env.NODE_ENV = process.env.NODE_ENV || 'live';    //live

const config = require('./config/config.js').get(process.env.NODE_ENV);


app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.png')));

//custom files
require('./config/db');
// require('./api/lib/scheduler.js');
var utils = require('./api/lib/util');
app.use('/images', express.static(path.join(__dirname, './images')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/users')));
app.use(express.static(path.join(__dirname, 'public/admin')));

var sess = {
    secret: 'bigSecretSDN_luxnow',
    resave: true,
    saveUninitialized: true
}
app.use(session(sess));

var SwaggerConfig = {
    appRoot: __dirname // required config
};

app.get('/', function (req, res, next) {
    //res.sendFile(path.join(__dirname, 'public/users/index.html'));
    res.render(path.join(__dirname, 'public/users/index.html'));
});

app.get('/admin', function(req, res, next) {
    res.render(path.join(__dirname, 'public/admin/index.html'));
});


SwaggerExpress.create(SwaggerConfig, function (err, swaggerExpress) {
    if (err) {
        throw err;
    }

    // All api requests
    app.use(function (req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization');

        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });


    // app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));

    app.use(bodyParser.json({
        limit: '50mb',
        type: 'application/json'
    }));

    //Check to call web services where token is not required//
    app.use('/api/*', function (req, res, next) {
        // console.log('req.baseUrl:- ',req.baseUrl)
        var freeAuthPath = [
            '/api/buy',
            '/api/successPayment',
            '/api/updateprofilepic_app',
            '/api/uploadImage',
            '/api/addUser',
            '/api/userRegister',
            '/api/userLogin',
            '/api/addMailingList',
            '/api/userForgotPassword',
            // '/api/adminLogin',
            '/api/loggedin',
            '/api/userLogOut',
            '/api/userActivation/*',
            '/api/images',
            '/api/getHomeList',
            '/api/getHomeItem',
            '/api/resetPassword',
            '/api/getInviteUser',
            '/api/updateCompleteRegister',
            //'/api/getTimezoneList',
            //'/api/contactus',
            '/api/addContactUs',
            '/api/getMailCategory',
            '/api/getAllProducts',
            '/api/viewProductDetailByProductId',
            '/api/getProductFilters',
            '/api/searchProduct',

            //Admin url
            '/api/adminLogin',
            '/api/adminLoggedin',
            '/api/adminForgotPassword',
            '/api/adminResetPassword',
            
        ];
        var available = false;
        for (var i = 0; i < freeAuthPath.length; i++) {
            if (freeAuthPath[i] == req.baseUrl) {
                available = true;
                break;
            }
        }
        if (!available) {
            utils.ensureAuthorized(req, res, next);
        } else {
            next();
        }
    });

    //Multer code for swagger multipart image file limit extend upto 50Mb
    let storage = multer.memoryStorage(); //you might need to change this, check multer docs
    let mult = multer({ //you might need to change this, check multer docs
        storage: storage,
        limits: {
            fileSize: 52428800
        }
    }).fields([{
        name: "file"
    }]);
    app.use(mult);


    // enable SwaggerUI
    app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

    // install middleware
    swaggerExpress.register(app);

    var port = process.env.PORT || config.port;
    app.listen(port).timeout = 1800000; //30 min

    if (swaggerExpress.runner.swagger.paths['/hello']) {
        console.log('try this:\ncurl http://127.0.0.1:' + port);
    }

    var authCtrl = require('./api/controllers/auth_ctrl');
    app.get('/auth/verify/:token', function (req, res, next) {
        authCtrl.userActivation(req, res);
    });

    // var authCtrl = require('./api/controllers/auth_ctrl');
    app.get('/auth/completeRegistraion/:token', function (req, res, next) {
        authCtrl.completeRegistraion(req, res);
    });
});
