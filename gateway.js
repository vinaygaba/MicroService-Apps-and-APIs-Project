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

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!!' });   
});

// more routes for our API will happen here


/************************************************************
*
* Student API Endpoints
*
*************************************************************/


//API endpoint to add student to the students table
router.route('/student')

    // create a new student (accessed at POST http://localhost:8080/api/student)
    .post(function(req, res) {
        
        res.json({ message: 'Student created!' });
        //Logic to save the student to db
        
    });



//API end point to get student details (accessed at POST http://localhost:8080/api/student/id)
router.route('/student/:student_id')

    // get the student with that id (accessed at GET http://localhost:8080/api/student/:student_id)
    .get(function(req, res) {

        res.json({ message: 'Student details!' });
    })


	// update the student with this id (accessed at PUT http://localhost:8080/api/student/:student_id)
    .put(function(req, res) {

    	res.json({ message: 'Student updated!' });

    });




/************************************************************
*
* Course API Endpoints
*
*************************************************************/

//API endpoint to add student to the students table
router.route('/course')

    // create a new course (accessed at POST http://localhost:8080/api/course)
    .post(function(req, res) {
        
        res.json({ message: 'Course created!' });
        //Logic to save the student to db
        
    });



//API end point to get course details (accessed at POST http://localhost:8080/api/course/id)
router.route('/course/:course_id')

    // get the course with that id (accessed at GET http://localhost:8080/api/course/:course_id)
    .get(function(req, res) {
        res.json({ message: 'Course details!' });
    })


	// update the course with this id (accessed at PUT http://localhost:8080/api/course/:course_id)
    .put(function(req, res) {

    	res.json({ message: 'Course updated!' });

    });



/************************************************************
*
* Course - Student API Endpoints
*
*************************************************************/

//API endpoint to add student to a course
router.route('/course/:course_name/:student_name')

    // create a new course (accessed at POST http://localhost:8080/api/course/:course_id/:student_name)
    .post(function(req, res) {
        
        res.json({ message: 'Student added to course!' });
        //Logic to save the student to db
        
    });

 //API endpoint to add course to a student
router.route('/student/:student_name/:course_name')

    // create a new course (accessed at POST http://localhost:8080/api/course/:student_name/:course_id/)
    .post(function(req, res) {
        
        res.json({ message: 'Course added to Student!' });
        //Logic to save the student to db
        
    })

    // deletes a course(accessed at POST http://localhost:8080/api/course/:student_name/:course_id/)
   .delete(function(req, res) {
        
        res.json({ message: 'Course dropped by Student!'});
        //Logic to save the student to db
        
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);