var path = process.cwd();

module.exports = function(app,passport){
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(isLoggedIn,function(req,res){
			res.render('index',{id:req.user._id});
		});

	app.route('/login')
		.get(function (req, res) {
			res.render('login',{login:false});
		})
		.post(
			passport.authenticate('local'),function(req,res){
					res.redirect('/');
			});
}