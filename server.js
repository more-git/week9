var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/w7-demo');

const {parse, stringify} = require('flatted');
var jsonParser = bodyParser.json()

var itemSchema = require('./item_schema.js').itemSchema;
var Items = mongoose.model('Items', itemSchema);

mongoose.connection.once('open', function(){
    app.use(bodyParser.urlencoded({extended: true}));
	app.use(express.static('front-end/dist/front-end'))

	app.use('/', express.query());
    
	app.get('/todo-list', function(request, response) {
        response.redirect('/');
    })

	app.get('/', function(request, response) {
	})


    app.get('/list', function (request, response) {
        var query = Items.find();
        query.exec(function (err, docs){
            response.status(200);
		 	response.json({docs});
        });
    })

 	app.post("/addtask", jsonParser, (request, response) => {
		var newItem = new Items({
            item: request.body.item
        });
        newItem.save(function (err, doc) {
            response.status(200);
 			response.send(request.body);
        })
	})

    app.listen(8080, function () {
    })
});
