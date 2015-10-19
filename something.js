
router.route('/coursestudent')

//create a new student (accessed at POST http://localhost:16386/api/student)
.post(function(req, res) {
	request({ url : "http://localhost/16390/api/course/" + req.params.course_id,
   		method : "GET",
   	}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
    	invokeandProcessResponse(req , function(err, result){
    	    if(err){
    	      res.send(500, { error: 'something blew up' });
    	    } else {
    	      res.send(result);
    	    }
    	  });
        }
    else
    	{
    	res.json({message : "Course does not exist"});
    	}
 //Logic to save the student to DB
});
});
