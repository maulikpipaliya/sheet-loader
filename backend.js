//endpost which will upload files and seperate

var express = require('express')
var flash = require('express-flash')
var bodyParser = require('body-parser')
var sessions = require('express-session')
var cookieParser = require('cookie-parser')
var csurf = require('csurf')
var path = require('path')
var md5 = require('md5')

const app = express();

var PORT = 5000;
//var base_url = `http://localhost:${PORT}/`;
var base_url = '';

var backendRoute = express.Router()
backendRoute.use(flash());
backendRoute.use(bodyParser.urlencoded({ extended: false }))
backendRoute.use(bodyParser.json())
backendRoute.use(sessions({
	secret: '@#$%@%^#^%&*SDFGS^%@DD$$%!@%!~~afsdfasdf)(*',
	resave: true,
	saveUninitialized: true
}));
backendRoute.use(cookieParser());
backendRoute.use(csurf({ cookie: true }));
backendRoute.get(base_url + '', function(req, res){
	res.render('backend/index',{
		"title": "S-Loader | Login",
		"base_url": base_url,
		"csurfToken": req.csrfToken()
	})
});	

backendRoute.post(base_url+'/auth', function(req, res){
	session = req.session;
	var username = req.body.username
	var password = req.body.password
	if (username != "" && password !=""){
			var fixusername = username.replace(/[^a-zA-Z0-9]/g,"")
			var fixpassword = md5(password)
			dbcon.crquery("SELECT * from users where username='"+fixusername+"' and password='"+fixpassword+"' limit 1", function(rows){
				//if (err) throw err;
				if (rows.length == ""){
					req.flash('message_login', 'Username or password maybe wrong!');
					res.redirect(base_url+'');
				}else{
					var addsession = fixpassword;
					session.uniqueID = addsession;
					session.userid = rows['0']['id'];
					session.username = rows['0']['username'];
					session.email = rows['0']['email'];
					res.redirect(base_url+'/dashboard');
				}
			});
	}else{
			req.flash('message_login', 'Field cannot be empty!');
			res.redirect(base_url+'');
	}
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.resolve('./public')));

app.use('/', backendRoute);

app.listen(PORT, () => {
	console.log(`App is listerning on 5000 ${PORT}`);
});
