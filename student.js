var pg = require('pg');
var connectionString = 'postgres://postgres:postgres@localhost:5432/infinity_student_db';
var redis = require('redis');
var client = new pg.Client(connectionString);
client.connect();

var subscriber = redis.createClient(6379, 'localhost' , {no_ready_check: true});
subscriber.on('connect', function() {
    console.log('Connected to Subscriber Redis');
});

var publisher = redis.createClient(6379, 'localhost' , {no_ready_check: true});
publisher.on('connect', function() {
    console.log('Connected to Publisher Redis');
});


exports.addStudent = function(req)
{
console.log('Connected to database');
console.log(req.body.sid);
var query = client.query("insert into ms_student_tbl values($1, $2, $3, $4, $5, $6, $7)", [req.body.sid, req.body.fname, req.body.lname, req.body.phno, req.body.degree, req.body.year, req.body.address]);
query.on('end', function(result) {
console.log("Row successfully inserted");
});
}

exports.getStudentDetails = function(req,res,callback)
{
var course_nos = [];
var responseJson;
var course_array;
console.log('Connected to database');
console.log(req.params.student_id);
var query = client.query("Select * from ms_student_tbl left outer join ms_student_course_tbl on (ms_student_tbl.lname = ms_student_course_tbl.lname) where ms_student_tbl.lname= $1", [req.params.student_id]);
query.on('row', function(row) {
	console.log(row.courseno);
	course_nos.push(row.courseno);
  if(course_array == undefined)
  {
	course_array = row.courseno + ",";
  }
  else {
  course_array += row.courseno + ",";
  }
	responseJson = {fname: row.fname ,lname: req.params.student_id, sid: row.sid, phno :  row.phno,degree_level: row.degree_level,year : row.year,address: row.address};
  });
query.on('end', function(result){

  responseJson.course_nos = course_array.substring(0,course_array.length - 1);
	console.log(responseJson);
	res.json(JSON.stringify(responseJson));
	callback(res);
});
}


exports.updateStudent = function(req)
{

var course_array;
var course_no;
var coursenos = req.body.course_nos.split(',');
var student_lname = req.params.student_id;
var prevStudent;
var queryToFetchPrevStudent = client.query("Select * from ms_student_tbl left outer join ms_student_course_tbl on (ms_student_tbl.lname = ms_student_course_tbl.lname) where ms_student_tbl.lname= $1", [req.params.student_id]);
queryToFetchPrevStudent.on('row', function(row) {
  if(course_array == undefined)
  {
	course_array = row.courseno + ",";
  }
  else {
  course_array += row.courseno + ",";
  }
	prevStudent = {fname: row.fname ,lname: req.params.student_id, sid: row.sid, phno :  row.phno,degree_level: row.degree_level,year : row.year,address: row.address};
});
queryToFetchPrevStudent.on('end', function(result){

prevStudent.course_nos = course_array.substring(0,course_array.length - 1);
var queryForRelationshipDatabase =  'Delete from ms_student_course_tbl where lname = $1';

	var query = client.query(queryForRelationshipDatabase, [student_lname]);
	query.on('end', function(result) {
	console.log("Row successfully deleted");
 for (var i = 0; i < coursenos.length; i++)
  {
		course_no = coursenos[i];
		console.log(course_no);
		var insertRelationQuery =  'Insert into ms_student_course_tbl(lname,courseno) values($1, $2)';
		var executeRelationQuery = client.query(insertRelationQuery, [student_lname, course_no]);
		executeRelationQuery.on('end', function(result) {
		console.log("Row successfully inserted");
  });
 }
  var queryString= 'update ms_student_tbl set sid = $1, fname = $2, phno = $3, degree_level = $4, year = $5, address = $6 where lname = $7';
  var executeQueryString = client.query(queryString, [req.body.sid, req.body.fname, req.body.phno, req.body.degree_level, req.body.year, req.body.address, req.params.student_id]);
  executeQueryString.on('end', function(result) {
  console.log("Row successfully updated");

message =   {
										"origin":"student",
										"event":"student_updated",
										"prev_student" : prevStudent,
										"curr_student" : req.body
				};
			 console.log(typeof(message.origin));
			 publisher.publish('RI', JSON.stringify(message));


});
});
});
}



exports.deleteStudent = function(req)
{

	console.log('Connected to database to delete student');
	var coursenos = [];
	var i = 0;
	var student_lname = req.params.student_id;

	var queryForFetchingCoursesForStudent = 'Select * from ms_student_course_tbl where lname = $1';

	var executedQuery = client.query(queryForFetchingCoursesForStudent, [student_lname]);

	executedQuery.on('row', function(row) {
    console.log('Row received');
    coursenos.push(row.course_no);
	});
	executedQuery.on('end', function () {
	var queryForStudentDatabase = 'Delete from ms_student_tbl where lname = $1';

	var queryForRelationshipDatabase =  'Delete from ms_student_course_tbl where lname = $1';

	var query = client.query(queryForRelationshipDatabase, [student_lname]);
	query.on('end', function(result) {
	console.log("Row successfully deleted");

	var relationshipDeleteQuery = client.query(queryForStudentDatabase, [student_lname]);
	relationshipDeleteQuery.on('end', function(result) {
	message =   {
										"origin":"student",
										"event":"student_removed_from_all",
										"studentLname" : lname,
										"course_nos" : coursenos
				};
			 console.log(typeof(message.origin));
			 publisher.publish('RI', JSON.stringify(message));
	console.log("Row successfully deleted");
});
});
});
}
