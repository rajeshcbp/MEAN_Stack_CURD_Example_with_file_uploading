var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var Product = require('./../../schemas/Products');
var request = require('request');
var fs = require('fs');

//CREATE===========================================================================================================

module.exports.createProduct = function (req, res) {
	console.log("Product body in routs==================", req.params);

	var bodyData = req.params;
	var fileKeey2 = bodyData.productName.replace(/ /g, '').replace(/_/g, '');
	var fileToupload = req.file;
	console.log("fileToupload==================", fileToupload);
	if (fileToupload !== "undefined") {
		var formData = {
			"productName": fileKeey2,
			"quantity": bodyData.quantity,
			"productPrice": bodyData.productPrice,
			"totalPrice": bodyData.totalPrice,
			"description": bodyData.description,
			"remarks": bodyData.remarks,
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
	} else {
		var formData = {
			"productName": fileKeey2,
			"quantity": bodyData.quantity,
			"productPrice": bodyData.productPrice,
			"totalPrice": bodyData.totalPrice,
			"description": bodyData.description,
			"remarks": bodyData.remarks
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
//Update Single ProductS===========================================================================================================
module.exports.updateProduct = function (req, res) {
	var Id = req.params.Id;
	console.log("Product Id==================", Id);
	var bodyData = req.params;
	console.log("bodyData==================", bodyData);
	var fileToupload = req.file;
	console.log("fileToupload==================", fileToupload);
	var fileKeey2 = bodyData.productName.replace(/ /g, '-').replace(/_/g, '-');
	console.log("product name after replace==================", fileKeey2);

	if (typeof(fileToupload) == "undefined") {
		console.log("file does not uploded")
		Product.update({
			_id: Id
		}, {
			$set: {
				"productName": fileKeey2,
				"quantity": bodyData.quantity,
				"productPrice": bodyData.productPrice,
				"totalPrice": bodyData.totalPrice,
				"description": bodyData.description,
				"remarks": bodyData.remarks
			}
		}, {
			w: 1
		}, function (err, result) {

			if (err) {
				res.send({
					"code": 500,
					"failed": "error ocurred"
				})
				console.log(" error", err.message);
			}
			console.log("  Product details updated succesfully ");
			res.statusCode = 302;
			res.setHeader("Location", "/");
			res.end();
		})
	} else {
		console.log("file  uploded")
		Product.findOne({
			_id: req.params.Id
		}, function (err, productfound) {
	
			if (err) {
				res.send({
					"code": 500,
					"failed": "error ocurred"
				})
				console.log(" error", err.message);
			}
			if (productfound) {
				console.log("  Product details found to update ");
				var imagePathToDelete = productfound.image;
				var keey2 = imagePathToDelete.replace('./images/productImages/', 'public/images/productImages/');
				console.log('imagePathToDelete', keey2);
				fs.stat(keey2, function (err, stat) {
					if (err == null) {
						console.log('File exists ');
						fs.unlink(keey2, function (err) {
							if (err) {
								throw err;
								console.log('Old Image in local directory not deleted.');
							}
							console.log('Successfully deleted old image in local directory.');
							Product.update({
								_id: Id
							}, {
								$set: {
									"productName": fileKeey2,
									"quantity": bodyData.quantity,
									"productPrice": bodyData.productPrice,
									"totalPrice": bodyData.totalPrice,
									"description": bodyData.description,
									"remarks": bodyData.remarks,
									"image": "./images/productImages/" + req.file.filename
								}
							}, {
								w: 1
							}, function (err, result) {
		
								if (err) {
									res.send({
										"code": 500,
										"failed": "error ocurred"
									})
									console.log(" error", err.message);
								}
								console.log("  Product details updated succesfully ");
								res.statusCode = 302;
								res.setHeader("Location", "/");
								res.end();
							})
						});
					} else if (err.code == 'ENOENT') {
						console.log("file does not exist")
						Product.update({
							_id: Id
						}, {
							$set: {
								"productName": fileKeey2,
								"quantity": bodyData.quantity,
								"productPrice": bodyData.productPrice,
								"totalPrice": bodyData.totalPrice,
								"description": bodyData.description,
								"remarks": bodyData.remarks,
								"image": "./images/productImages/" + req.file.filename
							}
						}, {
							w: 1
						}, function (err, result) {
		
							if (err) {
								res.send({
									"code": 500,
									"failed": "error ocurred"
								})
								console.log(" error", err.message);
							}
							console.log("  Product details updated succesfully ");
							res.statusCode = 302;
							res.setHeader("Location", "/");
							res.end();
						})
					} else {
						console.log('Some other error: ', err.code);
						res.statusCode = 302;
						res.setHeader("Location", "/");
						res.end();
					}
				});
			} else {
				console.log("Product details not found to update ");
				res.statusCode = 302;
				res.setHeader("Location", "/");
				res.end();
			}
		})
	}
}

//Delete Single ProductS===========================================================================================================
module.exports.delete = function (req, res) {
	var Id = req.params.Id;
	console.log("Product Id==================", Id);
	Product.findOne({
		_id: req.params.Id
	}, function (err, productfound) {

		if (err) {
			res.send({
				"code": 500,
				"failed": "error ocurred"
			})
			console.log(" error", err.message);
		}
		if (productfound) {
			console.log("  Product details found to delete ");
			var imagePathToDelete = productfound.image;
			var keey2 = imagePathToDelete.replace('./images/productImages/', 'public/images/productImages/');
			console.log('imagePathToDelete', keey2);
			fs.unlink(keey2, function (err) {
				if (err) {
					throw err;
					console.log('Old Image in local directory not deleted.');
				}
				console.log('Successfully deleted old image in local directory.');
				Product.remove({
					_id: Id
				}, function (err, result) {

					if (err) {
						res.send({
							"code": 500,
							"failed": "error ocurred"
						})
						console.log(" error", err.message);
					}
					console.log("  Product deleted succesfully ");

					res.status(200).json({
						"message": "DELETED"
					});

				})
			});
		} else {
			console.log("Product details not found to update ");
		}
	})
}