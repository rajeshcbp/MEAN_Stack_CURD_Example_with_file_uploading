var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var Product = require('./../../schemas/Products');
var request = require('request');

//CREATE===========================================================================================================

module.exports.createProduct = function (req, res) {
	console.log("Product body in routs==================", req.params);

	var bodyData = req.params;

	var formData = {
		"productName": bodyData.productName,
		"quantity": bodyData.quantity,
		"productPrice": bodyData.productPrice,
		"totalPrice": bodyData.totalPrice,
		"image": "./images/productImages/" + req.file.filename
	}
	console.log("formData", formData);

	Product.create(formData, function (err, result) {
		if (err) {
			console.log("DBERROR in creating account", err.message);
			res.status(500).json({
				"error": err.message
			});
			return;
		}
		console.log("Product created==================", result);
		res.statusCode = 302;
		res.setHeader("Location", "/");
		res.end();
		
	})

}

//GET ALL ProductS===========================================================================================================
module.exports.getAllProductDetails = function (req, res) {
	Product.find({}, function (err, result) {

		if (err) {
			res.send({
				"code": 500,
				"failed": "error ocurred"
			})
			console.log(" error", err.message);
		}
		console.log("  Product details fetched succesfully ", result);
		//   log.info( "  Product details fetched succesfully  " );
		res.status(200).json(result);

	})
}

//GET Single ProductS===========================================================================================================
module.exports.getProductDetails = function (req, res) {
	Product.findOne({
		_id: req.params.Id
	}, function (err, result) {

		if (err) {
			res.send({
				"code": 500,
				"failed": "error ocurred"
			})
			console.log(" error", err.message);
		}
		console.log("  Product details fetched succesfully ", result);
		//   log.info( "  Product details fetched succesfully  " );
		res.status(200).json(result);

	})
}
