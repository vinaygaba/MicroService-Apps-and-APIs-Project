var pg = require('pg');
var connectionString = 'postgres://postgres:postgres@localhost:5432/infinity_course_db';
var client = new pg.Client(connectionString);
var redis = require('redis');
client.connect();


var subscriber = redis.createClient(6379, 'localhost' , {no_ready_check: true});
subscriber.on('connect', function() {
    console.log('Connected to Subscriber Redis');
});


var publisher = redis.createClient(6379, 'localhost' , {no_ready_check: true});
publisher.on('connect', function() {
    console.log('Connected to Publisher Redis');
});



exports.addCourse = function(req)
{
console.log('Connected to database');
console.log(req.body.cid);
var query = client.query("insert into ms_course_tbl values($1, $2, $3, $4, $5)", [req.body.cid, req.body.courseno, req.body.prof, req.body.room, req.body.timings]);
query.on('end', function(result) {
console.log("Row successfully inserted");
	//client.end();
});
}





exports.getCourseDetails = function(req,res,callback)
{
var lnames = [];
var responseJson;
console.log('Connected to database');
console.log(req.params.course_id);
var query = client.query("Select * from ms_course_tbl left outer join ms_student_course_tbl on (ms_course_tbl.courseno = ms_student_course_tbl.courseno) where ms_course_tbl.courseno= $1", [req.params.course_id]);
query.on('row', function(row) {
	console.log(row.courseno);
	//console.log(str);
	lnames.push(row.lname);
	responseJson = "{'cid':"+ row.cid + ", 'courseno':" + req.params.course_id + ", 'timings':"+ row.timings + ", 'prof' :" + row.prof + ", 'room':" + row.room + ", 'lnames': " + lnames + "}";
  });
query.on('end', function(result){
	console.log(responseJson);
	res.json(responseJson);
	callback(res);
});
}

exports.updateCourse = function(req)
{
var student_array=[];
var lname;
var lnames = req.body.lnames.split(',');
var courseno = req.params.course_id;
var prevCourse;


var queryToFetchPrevCourse = client.query("Select * from ms_course_tbl left outer join ms_student_course_tbl on (ms_course_tbl.courseno = ms_student_course_tbl.courseno) where ms_course_tbl.courseno= $1", [req.params.course_id]);
queryToFetchPrevCourse.on('row', function(row) {
	student_array.push(row.lname);
	prevCourse = "{'cid':"+ row.cid + ", 'courseno':" + req.params.course_id + ", 'timings':"+ row.timings + ", 'prof' :" + row.prof + ", 'room':" + row.room + ", 'lnames': " + lnames + "}";
  });
queryToFetchPrevCourse.on('end', function(result){

var queryForRelationshipDatabase =  'Delete from ms_student_course_tbl where courseno = $1';

	var query = client.query(queryForRelationshipDatabase, [courseno]);
	query.on('end', function(result) {
	console.log("Row successfully deleted");
 for (var i = 0; i < lnames.length; i++)
  {
		lname = lnames[i];
		console.log(lname);
		var insertRelationQuery =  'Insert into ms_student_course_tbl(lname,courseno) values($1, $2)';
		var executeRelationQuery = client.query(insertRelationQuery, [lname, courseno]);
		executeRelationQuery.on('end', function(result) {
		console.log("Row successfully inserted");
  });
 }
  var queryString= 'update ms_course_tbl set cid = $1, courseno = $2, room = $3, prof = $4, timings = $5 where courseno = $6';
  var executeQueryString = client.query(queryString, [req.body.cid, req.body.courseno, req.body.room, req.body.prof, req.body.timings, req.params.course_id]);
  executeQueryString.on('end', function(result) {
  console.log("Row successfully updated");

message =   {
										"origin":"course",
										"event":"course_updated",
										"prev_course" : prevCourse,
										"cur_course" : req.body
				};
			 console.log(typeof(message.origin));
			publisher.publish('RI', JSON.stringify(message));


});
});
});
}


exports.deleteCourse = function(req)
{

	console.log('Connected to database to delete course');
	var lnames = [];
	var i = 0;
	var courseno = req.params.course_id;

	var queryForFetchingStudentForCourses = 'Select * from ms_student_course_tbl where courseno = $1';

	var executedQuery = client.query(queryForFetchingStudentForCourses, [courseno]);

	executedQuery.on('row', function(row) {
    console.log('Row received');
    lnames.push(row.lname);    
	});
	executedQuery.on('end', function () {
	var queryForCourseDatabase = 'Delete from ms_course_tbl where courseno = $1';

	var queryForRelationshipDatabase =  'Delete from ms_student_course_tbl where courseno = $1';

	var query = client.query(queryForRelationshipDatabase, [courseno]);
	query.on('end', function(result) {
	console.log("Row successfully deleted");

	var relationshipDeleteQuery = client.query(queryForCourseDatabase, [courseno]);
	relationshipDeleteQuery.on('end', function(result) {
	message =   {
										"origin":"course",
										"event":"course_removed_from_all",
										"courseno" : courseno,
										"lnames" : lnames
				};
			 console.log(typeof(message.origin));
			publisher.publish('RI', JSON.stringify(message));
	console.log("Row successfully deleted");
});
});
});
}




