/*
*
*
*/

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 16390;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// middle-ware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:16390/api)
router.get('/', function(req, res) {
   // Checking Course Instance
	 res.json({ message: 'Welcome to our Course api!!' }); 
});

// more routes for our API will happen here



/************************************************************
*
* Course API Endpoints
*
*************************************************************/

//API endpoint to add student to the students table
router.route('/course')

    // create a new course (accessed at POST http://localhost:16390/api/course)
    .post(function(req, res) {
        
        res.json({ message: 'Course created!' });
        //Logic to save the course to db
        
    });



//API end point to get course details (accessed at POST http://localhost:16390/api/course/id)
router.route('/course/:course_id')

    // get the student with that id (accessed at GET http://localhost:16390/api/course/:course_id)
    .get(function(req, res) {
    	// Logic to show course details
        res.json({ message: 'Course details!' });
    })


	// update the student with this id (accessed at PUT http://localhost:16390/api/course/:course_id)
    .put(function(req, res) {
    	//Logic to upadte student details
    	res.json({ message: 'Course updated!' });

    });





// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);