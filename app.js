var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

var http = require('http');
var multer = require('multer');
var crypto = require('crypto');
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//=======================================================HTML Pages=====================================================
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});



//======================================================Connect to Mongoose================================================================

var promise = mongoose.connect('mongodb://localhost/your_db_name', {
    useMongoClient: true,
    /* other options */
});


//=======================================================Routs============================================================================

//Product routs
var Product = require('./routs/product/createNewProduct');


//=====================================================API'S===============================================================================

storage = multer.diskStorage({
    destination: 'public/images/productImages',
    filename: function (req, file, cb) {
        return crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                return cb(err);
            }
            var today2 = new Date().getTime();
          console.log("Am in file upload multer storage function", req.params.productName)
          var fileKeey2 = req.params.productName.replace(/ /g, '-').replace(/_/g, '-');
          console.log("product name after replace==================", fileKeey2);
            return cb(null,  fileKeey2 + "-" + today2+ "-" + file.originalname);
        });
    }
});



app.post("/AddProduct/:productName/:quantity/:productPrice/:totalPrice/:description/:remarks", multer({ storage : storage}).single('images'), Product.createProduct);
app.get("/GetAllProductDetails", Product.getAllProductDetails);
app.get("/GetProductDetails/:Id", Product.getProductDetails);
app.post("/UpdateProductDetails/:productName/:quantity/:productPrice/:totalPrice/:description/:remarks/:Id" , multer({ storage : storage}).single('images'), Product.updateProduct);
app.delete("/DeleteProductDetails/:Id", Product.delete);


//=========================================================================================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("Server connected to port" + " " + PORT);