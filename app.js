//bootstrap CDN <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

//Import
var express = require('express');
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
var mongoose = require('mongoose');
var credentials = require('./credentials');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sessions = require('express-session');
var md5 = require('md5');

//DB Scheme
//var Student = require('./models/grades.js');
//var seedDB = require('./models/seed.js');

//User DB SCHEME
var User = require('./models/users');
var userSeed = require('./models/userSeed');

var app = express();
var connectionString = 'mongodb+srv://zzhao:3057199ACS!@messageboard-f4x7n.gcp.mongodb.net/test?retryWrites=true';
//db connection
mongoose.connect(connectionString,{ useNewUrlParser: true });
//seedDB.seed(Student);
userSeed.seed(User);


//handlebars engine setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3039);

//body parser
app.use(require('body-parser').urlencoded({extended: true}));

//cookie and session
app.use(cookieParser(credentials.cookieSecret));
app.use(sessions({
    resave: true,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
    cookie: {maxAge: 3600000},
}));


//check login Fucntion

function checkLoginFinal(req,res){
    var errors = [];

    if(!req.body.userName){
        errors.push({text:'Please enter user name.'});
    }
    if(!req.body.userPassword){
        errors.push({text:'Please enter password'});
    }else{
        User.findOne({userName:req.body.userName},function(error,user){
            if(error){
                console.log("errors:"+error);
            }else if(!user){
                console.log('cant find user.');
                errors.push({text:'Cant find user.'});
                res.render('login',{errors});
            }else if(user.passWord == req.body.userPassword){
                console.log('password correct.');
                res.send('ready to go.');
            }else{
                console.log('wrong password.');
                errors.push({text:'wrong password.'});
                res.render('login',{errors});
            }
        });
    }
  }

//Rendering MessageBoard Page
app.get('/messageBoard',function(req,res){
    var errors = [];
    if(req.session.userName){
        User.find({},function(err,user){
            if(err){
                console.log(err);
            }else{
                res.render('messageBoard',{user});
            }
        });
    }else{
        errors.push({text:'Please log in to vist the content.'});
        res.render('login',{errors});
    }
});

//Process add message
app.post('/processAddMessage',function(req,res){
    console.log('Message Title:' + req.body.title);
    console.log('Message Content:' + req.body.content);
    console.log('User Name: ' + req.session.userName);
});

  //Display Login Page
app.get('/',function(req,res) {
    res.render('login');
});
//Process Login
/**
 * TO DO:
 *  1. md5 > SOLVED
 *  2. Sessions
 */
app.post('/processLogin',function(req,res) {
    var errors = [];
    if(!req.body.userName){
        errors.push({text:'Please enter user name.'});
    }
    if(!req.body.userPassword){
        errors.push({text:'Please enter password'});
    }else{
        User.findOne({userName:req.body.userName},function(error,user){
            if(error){
                console.log("errors:"+error);
            }else if(!user){
                console.log('cant find user.');
                errors.push({text:'Cant find user.'});
                res.render('login',{errors});
            }else if(user.passWord == md5(req.body.userPassword)){
                console.log('password correct.');
                req.session.userName = req.body.userName;
                res.redirect(303,'messageBoard');
            }else{
                console.log('wrong password.');
                errors.push({text:'wrong password.'});
                res.render('login',{errors});
            }
        });
    }
    console.log(req.body.buttonVar);
    console.log("errors vector:"+errors);
});


//Display Register page
app.get('/register',function(req,res) {
    res.render('register');
});

app.get('/afterReg',function(req,res){
    res.render('afterReg');
})

//Process Register page
/**
 * 1. check if user is alreday registed >> SOLVED
 * 2. if not, take user name and password >> SOLVED
 * 3. password md5 >> SOLVED
 * 4. save password and username into database >> SOLVED
 * 5. redirect
 */
app.post('/processRegister',function(req,res) {

    var errors = [];
    if(!req.body.userName){
        errors.push({text:'Please enter user name.'});
    }
    if(!req.body.userPassword){
        errors.push({text:'Please enter password'});
    }else{
        User.findOne({userName:req.body.userName},function(err,user){
            if(err){
                console.log(err);
            }else if(user){
                errors.push({text:'This user name is already registered, try login'});
                res.render('register',{errors});
            }else if(!user){
                var newUser = {
                    userName: req.body.userName,
                    passWord: md5(req.body.userPassword)
                }
                //save new user to database
                User.create(newUser);
                console.log('New user has been saved into the database.');
                res.send("ALL PASSED");
            }
        });
    }
});

//Log out
app.get('/logout',function(req,res){
    delete req.session.userName;
    res.redirect(303,'/');
});

//DB TEST CODE START


app.get('/testHome', function(req, res){
    var contextObj = {};
    User.find(function(err, user) {
        contextObj = {
            user: user,
        };
        res.render('home', contextObj);
    });
});

app.get('/testHome2',(req,res)=>{
    User.find({})
    .sort({userName:'desc'})
    .then(user => {
        res.render('home',{
            user:user
        });
    });
});



app.get('/testInput',function(req,res) {
    res.render('testInput');
});
var insertObj = {};
app.post('/processDBLogin',function(req,res) {
    console.log("Student Name:" + req.body.stuname);
    console.log("Student Number:" + req.body.snum);
    console.log("Final Percentage:" + req.body.fpercent);
    console.log("Final Grade:" + req.body.fgrade);

    insertObj = {
        name: req.body.stuname,
        snum: req.body.snum,
        finalPercentage: req.body.fpercent,
        finalGrade: req.body.fgrade
    };

    console.log("The new obj has been created");
    res.redirect(303, '/');
});


app.get('/dbInsertTest',function(req,res) {
    try{
        Student.create(insertObj);
        console.log("Data insert");
    }catch (err){
        console.log(err);
    }
});

app.get('/dbDisplayTest',function(req,res) {
   User.findOne({userName:req.query.uname},function(err,data) {
       if(err){
           console.log("Error finding student number:" + userName);
           console.log(err);
       }
       console.log(data);
       //console.log('password:'+data.passWord);
   });
});

app.get('/dbUpdateTest',function(req,res) {
    var newObj = {finalPercentage: 91};
    Student.findOneAndUpdate({snum: req.query.snum},newObj, function (err, data) {
        if(err){
            console.log("Error finding student number:"+snum);
        }
        console.log(data);
    });
});

app.get('/testEach',function(req,res){
    var errors = [{text:"Error 1"},{text:'Error 2'},{text:'Error 3'}];
    res.render('testEach',{errorst:errors});
});

app.get('/dbDisplayAllUser',function(req,res){
    User.find({},function(err,users){
        res.render('dbDisplayAllUser',{users});
    });
});

//DB TEST CODE END




//Error handle
app.use(function(req,res) {
    res.status(404);
    res.render('404');
});

app.use(function(req,res) {
    res.status(500);
    res.render('500');
});




app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});
