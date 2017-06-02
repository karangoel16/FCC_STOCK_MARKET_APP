'use Strict';
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

module.exports=function(passport)
{
	passport.serializeUser(function (user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	passport.use(new LocalStrategy({
		usernameField:"email",
		passwordField:"email"
	},function(username,password,done){
		process.nextTick(function(){
			User.findOne({email:username},function(err,user){
				if(err){
					return done(err);
				}
				if(user){
					return done(null,user);
				}
				else{
					var newUser = new User();
					newUser.email = username;
					newUser.save(function(err){
						if(err){
							throw err;
						}
						return done(null,newUser);
					});
				}
			});
		});
	}));
}