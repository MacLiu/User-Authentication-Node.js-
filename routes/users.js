var express = require('express');
var router = express.Router();

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


module.exports = router;
