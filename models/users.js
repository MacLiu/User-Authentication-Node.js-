var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/nodeauth");
var db = mongoose.connection;

//User Schema
var UserSchema = new mongoose.Schema({
	username: {
		type : String,
		index : true
	},
	password : {
		type : String
	},
	email : {
		type : String
	},
	name : {
		type : String
	},
	profileImage : {
		type : String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

var hash = function (str) {
	var result = "";
	var charcode = 0;
	for (var i = 0; i < str.length; i++) {
        charcode = (str[i].charCodeAt()) + 3;
        result += String.fromCharCode(charcode);	
    }
	return result;
};

module.exports.comparePassword = function(candidatePassword, hashp, callback) {
	candidatePassword = hash(candidatePassword);
	if (candidatePassword == hashp) {
		callback(null, true);
	} else {
		callback(null, false);
	}
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
	var query = {username : username};
	User.findOne(query, callback);
}

module.exports.createUser = function(newUser, callback) {
	newUser.password = hash(newUser.password);
	newUser.save(callback);
}


