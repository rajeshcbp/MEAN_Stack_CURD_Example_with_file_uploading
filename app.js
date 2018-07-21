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

//MULTER for file uploading
storage = multer.diskStorage({
    destination: 'public/images/productImages',
    filename: function (req, file, cb) {
        return crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                return cb(err);
            }
            var today2 = new Date().getTime();
          
            return cb(null, today2 + "-" + file.originalname);
        });
    }
});

app.post("/AddProduct/:productName/:quantity/:productPrice/:totalPrice", multer({ storage : storage}).single('images'), Product.createProduct);
app.get("/GetAllProductDetails", Product.getAllProductDetails);
app.get("/GetProductDetails/:Id", Product.getProductDetails);



//=========================================================================================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("Server connected to port" + " " + PORT);