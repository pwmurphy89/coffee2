var express = require('express');
var router = express.Router();
var mongoUrl = "mongodb://localhost:27017/coffee";
var mongoose = require('mongoose');
mongoose.connect(mongoUrl);

var Account = require('../models/accounts');
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');
/* GET home page. */
router.get('/getUserData', function(req,res,next){
	if(req.query.token == undefined){
		res.json({'failure': 'noToken'});
	}else{
		Account.findOne(
			{token: req.query.token},
			function(err,doc){
				if(doc == null){
					res.json({'failure': 'badToken'});
				}else{
					res.json(doc);
				}
			}
		);

	}
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req,res,next){
	res.render('login', {page: 'login'});
});

router.get('/register', function(req,res,next){
	res.render('register', {page: 'register'});
});

router.get('/options', function(req,res,next){
	res.render('options', {username: req.session.username, page: 'options'});
});

router.get('/delivery', function(req,res,next){
	res.render('delivery', {page: 'delivery'});
});

router.get('/checkout', function(req,res,next){
	res.render('checkout', {page: 'checkout'});
});

router.post('/login', function(req,res,next){
	console.log("got to post/login");
	var username = req.body.username;
	var password = req.body.password;

	Account.findOne(
		{username: username},
		function(err, doc){
			if(doc == null){
				res.json({failure:'noUser'});
			}else{
				var passwordsMatch = bcrypt.compareSync(password, doc.password);
				if(passwordsMatch){
					res.json({
						success: 'found',
						token: doc.token
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

router.post('/register', function(req,res,next){
	if(req.body.password != req.body.password2){
		res.json({failure:'passwordMatch'});
	}else{
		var token = randToken.generate(32);
		var newAccount = new Account({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
			email: req.body.email,
			token: token
		})
		newAccount.save();
		res.json({
			success: 'added',
			token: token
		})
	}
});

router.post('/options',function(req,res,next){
	Account.findOneAndUpdate(
		{token: req.body.token},
		{
		plan: req.body.plan,
		grind: req.body.grind,
		quantity: req.body.quantity,
		frequency: req.body.frequency,
		upsert: true
		},
		function(err, account){
			if(account == null){
				//no response
				res.json({'failure': 'nomatch'});
			}else{
				//we got record and updated it
				account.save();
				res.json({'success': 'update'})
			}
		}
	)
});

router.post('/delivery',function(req,res,next){
	Account.findOneAndUpdate(
		{token: req.body.token},
		{fullName: req.body.fullName,
		address: req.body.address,
		address2: req.body.address2,
		city: req.body.city,
		state: req.body.state,
		zip: req.body.zip,
		deliveryDate: req.body.deliveryDate,
		upsert: true},
		function(err, account){
			if(account == null){
				//no response
				res.json({'failure': 'nomatch'});
			}else{
				//we got record and updated it
				account.save();
				res.json({'success': 'update'})
			}
		}
	)
});

module.exports = router;

