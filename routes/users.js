var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
  	'title' : 'Register'
  });
});

router.post('/register', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	if (req.files.profileImage) {
		console.log("Uploading File...");

		var profileImageOriginalName = req.files.profileImage.originalname;
		var profileImageName = req.files.profileImage.name;
		var profileImageMime = req.files.profileImage.mimetype;
		var profileImagePath = req.files.profileImage.path;
		var profileImageExt = req.files.profileImage.extension;
		var profileImageSize = req.files.profileImage.size;
	} else {
		var profileImageName = 'noimage.png';
	}

	req.checkBody('name','Name field is required.').notEmpty();
	req.checkBody('email','Email field is required.').notEmpty();
	req.checkBody('email','Email not valid.').isEmail();
	req.checkBody('username','Username field is required.').notEmpty();
	req.checkBody('password','Password field is required.').notEmpty();
	req.checkBody('password2','Password do not match.').equals(password);

	// Check for errors
	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors : errors,
			name : name,
			email :email,
			username : username,
			password : password,
			password2 : password2
		});
	} else {
		var newUser = new User({
			name : name,
			email :email,
			username : username,
			password : password,
			profileImage : profileImageName
		});

		User.createUser(newUser, function(error, user) {
			if (error) throw error;
			console.log(user);
		});

		req.flash("success", " You're now registered for NodeAuth(:");

		res.location('/');
		res.redirect('/');
	}
});

router.get('/login', function(req, res, next) {
  res.render('login', {
  	'title' : 'Log In'
  });
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) throw err;
			if (!user) {
				console.log("Unknown User");
				return done(null, false, {message : "Unknown user"});
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) {throw err};
				if (isMatch) {
					return done(null, user);
				} else {
					console.log("Invalid Password");
					return done(null, false, {message : "Invalid Password"});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local', {failureRedirect : '/users/login', failureFlash : 'Invalid useranme or password'}), function(req, res){
	console.log('Authentication Successful');
	req.flash('success', 'You are successfully logged in');
	res.redirect('/');
});


module.exports = router;
