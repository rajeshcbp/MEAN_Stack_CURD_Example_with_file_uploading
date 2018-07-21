var mongoose = require('mongoose');

// stellar account details 
var productSchema = mongoose.Schema({
	productName: { //body
		type: String,
		index: true
	},
	quantity: { //body
		type: String,
		index: true
	},
	productPrice: { //body
		type: String,
		index: true
	},
	totalPrice: { //body
		type: String,
		index: true
	},
	image: { //body
		type: String,
		default: ""
	}
});



//------------------------------------------Model---------------------------------------------------------------------------
var product = module.exports = mongoose.model('product', productSchema);