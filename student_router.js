/*
*
*
*/

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request = require('request');
var http = require('http');
var redis = require('redis');
var config = require('./config_student.json');
var arr = Object.keys(config).map(function(k) { return config[k] });

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 16385;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// middle-ware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {

	invokeandProcessResponse(req , function(err, result){
	    if(err){
	      res.send(500, { error: 'something blew up' });
	    } else {
	      res.send(result);
	    }
	  });
});
var invokeandProcessResponse = function(req, callback){
	var instanceToRouteTo;
  var requestCount = 1;
	console.log(req.method);
	var firstCharacterString, firstCharacter;
	var reqMethod;
	var bodyParameters;
	reqMethod = req.method;
	bodyParameters = req.body;
//   if(req.url.split('/')[3] == "all")
//   {
//     requestCount = 3;
//     var instancesArray = ['http://localhost:16386/api','http://localhost:16387/api','http://localhost:16388/api'];
//     for (var i in instancesArray)
//     {
//       console.log(req.url);
//     console.log('Sending ' +req.method+ ' request to ' + instancesArray[i]);
//       request({ url : instancesArray[i] + req.url,
//         method : reqMethod,
//         json : bodyParameters
//       }, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//        callback(null, response.body);
//       } else {
//         callback(error);
//       }
//     });
//   }
// }
  //else {

    if(req.method == "POST" )
      {
        firstCharacterString = req.body.lname ;
      }
    else if (req.method == "GET" || req.method == "PUT" || req.method == "DELETE")
      {
        firstCharacterString = req.url.split('/')[2];

      }


    firstCharacter = firstCharacterString[0];
    console.log(firstCharacter);
    if(firstCharacter >= 'A' && firstCharacter <= 'F')
      {
        instanceToRouteTo = 'http://localhost:16386/api';
        instanceToRouteTo += req.url;
      }
    else if (firstCharacter >= "G" && firstCharacter <= 'Q')
      {
        instanceToRouteTo = 'http://localhost:16387/api';
        instanceToRouteTo += req.url;
      }
    else if (firstCharacter >= 'R' && firstCharacter <= 'Z')
    {
      instanceToRouteTo = 'http://localhost:16388/api';
      instanceToRouteTo += req.url;
    }
    console.log('Sending ' +req.method+ ' request to ' + instanceToRouteTo);
      request({ url : instanceToRouteTo,
        method : reqMethod,
        json : bodyParameters
      }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
       callback(null, response.body);
      } else {
        callback(error);
      }
    });


//  }

}
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
    	invokeandProcessResponse(req , function(err, result){
    	    if(err){
    	      res.send(500, { error: 'something blew up' });
    	    } else {
    	      res.send(result);
    	    }
    	  });

   //     res.json({ message: 'Student created!' });
        //Logic to save the student to db

    });



//API end point to get student details (accessed at POST http://localhost:8080/api/student/id)
router.route('/student/:student_id')

    // get the student with that id (accessed at GET http://localhost:8080/api/student/:student_id)
    .get(function(req, res) {
    	invokeandProcessResponse(req , function(err, result){
    	    if(err){
    	      res.send(500, { error: 'something blew up' });
    	    } else {
    	      res.send(result);
    	    }
    	  });

      //  res.json({ message: 'Student details!' });
    })


	// update the student with this id (accessed at PUT http://localhost:8080/api/student/:student_id)
    .put(function(req, res) {
    	console.log("here" + req.method);
    	invokeandProcessResponse(req , function(err, result){
    	    if(err){
    	      res.send(500, { error: 'something blew up' });
    	    } else {
    	      res.send(result);
    	    }
    	  });
    })

    //	res.json({ message: 'Student updated!' });
    .delete(function(req, res) {

    	    	invokeandProcessResponse(req , function(err, result){
    	    	    if(err){
    	    	      res.send(500, { error: 'something blew up' });
    	    	    } else {
    	    	      res.send(result);
    	    	    }
    	    	  });

    	    });


router.route('/coursestudent')

//create a new student (accessed at POST http://localhost:16386/api/student)
.post(function(req, res) {
	invokeandProcessResponse(req , function(err, result){
	    if(err){
	      res.send(500, { error: 'something blew up' });
	    } else {
	      res.send(result);
	    }
	  });
 //Logic to save the student to DB

});


router.route('/coursestudent/:courseid/:studentid')

//create a new student (accessed at POST http://localhost:16386/api/student)
.delete(function(req, res) {
	invokeandProcessResponse(req , function(err, result){
	    if(err){
	      res.send(500, { error: 'something blew up' });
	    } else {
	      res.send(result);
	    }
	  });
    res.json({ message: "Course added to student" });
//Logic to save the student to DB

});

var subscriber = redis.createClient(6379, 'localhost' , {no_ready_check: true});
subscriber.on('connect', function() {
    console.log('Connected to Subscriber Redis');
});

var publisher = redis.createClient(6379, 'localhost' , {no_ready_check: true});
publisher.on('connect', function() {
    console.log('Connected to Publisher Redis');
});

subscriber.on("message", function(channel, message) {
  console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
  var parsedMessage = JSON.parse(message);
  console.log(parsedMessage);
  //message event, origin, studentname and coursename
  var messageEvent = parsedMessage.event;
  var messageOrigin = parsedMessage.origin;
  var lname = parsedMessage.lname;
  var courseno = parsedMessage.courseno;
  var url;
  for(var key in arr){
		if(messageEvent == arr[key].event){
      console.log("Event:" + arr[key].event);
      if (arr[key].req_method == "DELETE") {
        console.log(arr[key].req_method);
        url = arr[key].publicurl + "/" + courseno + "/" + lname;
      }
      else {
        url = arr[key].publicurl;
      }
      console.log("URL we are going to hit:" + url);
      request({ url : url,
   		   method : arr[key].req_method,
         json : parsedMessage
   	}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(response.statusCode);
    } else {
        console.log(response.statusCode);
    }
  });
}
}
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

subscriber.subscribe("student");
