var express = require('express');
var router = express.Router();
var mongoUrl = "mongodb://localhost:27017/coffee";
var mongoose = require('mongoose');
mongoose.connect(mongoUrl);

var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req,res,next){
	res.render('register', {page: 'register'});
});

router.post('/register', function(req,res,next){
	// var username = req.body.username;
	// var password = req.body.password;
	// var password2 = req.body.password2;
	// var email = req.body.email;

		if(req.body.password != req.body.password2){
			res.json({failure:'passwordMatch'});
		}else{
				var newAccount = new Account({
					username: req.body.username,
					password: bcrypt.hashSync(req.body.password),
					email: req.body.email
				})
				newAccount.save();
				req.session.username = req.body.username;
				res.json({
					success: 'added'
				})
	}
});

router.get('/options', function(req,res,next){
	res.render('options', {username: req.session.username, page: 'options'});
});

router.get('/login', function(req,res,next){
	res.render('login', {page: 'login'});
});

router.post('/login', function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;

	Account.findOne(
		{username: username},
		function(err, doc){
			var passwordsMatch = bcrypt.compareSync(password, doc.password);
			if(doc == null){
				res.json({failure:'noUser'});
			}else{
				if(passwordsMatch){
					req.session.username = req.body.username;
					res.json({
						success: 'found'
					});
				}else{
					res.json({
						failure: 'badPassword'
					});
				}
			}
		}
	)
});

module.exports = router;
