var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Account = new Schema({
	username: String,
	password: String,
	email: String,
	token: String,
	frequency: String,
	quantity: String,
	grind: String,
	fullName: String,
	address: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	deliveryDate: String,
	plan: String
});

module.exports = mongoose.model('Account', Account);