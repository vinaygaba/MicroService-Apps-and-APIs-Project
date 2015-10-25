var pg = require('pg');
var connectionString = 'postgres://postgres:postgres@localhost:5432/infinity_course_db';
var client = new pg.Client(connectionString);
var redis = require('redis');
client.connect();

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



exports.addStudentToCourse = function(req)
{

var lname = req.body.lname;
var courseno = req.body.courseno;


var queryForCheckingExistenceOfPair = client.query("select * from ms_student_course_tbl where courseno = $1 and lname = $2", [courseno, lname], function(err, result){
rowCount = result.rows.length;
if(rowCount == 0)
{
var query = client.query("insert into ms_student_course_tbl(courseno,lname) values($1, $2)", [courseno,lname]);
query.on('end', function(result) {

	message =   {
									"origin":"course" ,
									"event":"student_added_to_course",
									"studentLname" : lname,
									"courseNo" : courseno
							};
		 console.log(typeof(message.origin));
		 publisher.publish('RI', JSON.stringify(message));
console.log("Row successfully inserted");
	//client.end();
});
}
});
}

exports.getCourseDetails = function(req,res,callback)
{
console.log('Connected to database');
console.log(req.params.course_id);


var query = client.query("Select * from ms_course_tbl where courseno= $1", [req.params.course_id]);
query.on('row', function(row) {
console.log('Row received') ;
res.json({cid:row.cid, courseno:row.courseno, prof:row.prof, room:row.room, timings:row.timings});
	callback(res);
	//client.end();
	 });
}

exports.updateCourse = function(req)
{
console.log('Connected to database in update');

var queryString= 'update ms_course_tbl set ';
var courseno = req.params.course_id;

for (var key in req.body) {
  if (req.body.hasOwnProperty(key)) {
    console.log(key + " -> " + req.body[key]);
    queryString = queryString  + key + ' = ' + "'"+req.body[key] + "'" + ',';

  }
}
queryString = queryString.substring(0, queryString.length - 1);
queryString = queryString + ' where courseno = $1';

console.log(queryString);

var query = client.query(queryString, [courseno]);
query.on('end', function(result) {
console.log("Row successfully updated");
	//client.end();
});
}


exports.deleteCourse = function(req)
{

	console.log('Connected to database to delete student');

	var courseno = req.params.course_id;
	console.log(courseno);

	var queryForCourseDatabase = 'Delete from ms_course_tbl where courseno = $1';

	var queryForStudentCourseDatabase ='Delete from ms_student_course_tbl where courseno = $1';

	var query = client.query(queryForStudentCourseDatabase, [courseno]);
    query.on('end', function(result) {
	console.log("Row successfully deleted from relationship table");

	var queryForCourse = client.query(queryForCourseDatabase, [courseno]);
	queryForCourse.on('end', function(result) {
		console.log("Inside queryforCourse end")

		message =   {
										"origin":"course" ,
										"event":"student_removed_from_course",
										"studentLname" : "all",
										"courseNo" : courseno
								};
			 console.log(typeof(message.origin));
			 publisher.publish('RI', JSON.stringify(message));
	console.log("Row successfully deleted from course table");
	//client.end();
});
});
}



exports.deleteStudentFromCourse = function(req)
{

var courseno = req.params.course_id;
var lname = req.params.student_id;

var queryForStudentCourseDatabase;
var query;
var queryForCheckingExistenceOfPair;

if(courseno == 'all')
{
queryForStudentCourseDatabase = 'Delete from ms_student_course_tbl where lname = $1';
var query = client.query(queryForStudentCourseDatabase, [lname]);

queryForCheckingExistenceOfPair = client.query("select * from ms_student_course_tbl where lname = $1", [lname]);

}
else
{
queryForStudentCourseDatabase = 'Delete from ms_student_course_tbl where lname = $1 and courseno = $2';
var query = client.query(queryForStudentCourseDatabase, [lname,courseno]);

queryForCheckingExistenceOfPair = client.query("select * from ms_student_course_tbl where courseno = $1 and lname = $2", [courseno, lname]);
}

queryForCheckingExistenceOfPair.on('row', function(row){

	query.on('end', function(result) {

		message =   {
										"origin":"course" ,
										"event":"student_removed_from_course",
										"studentLname" : lname,
										"courseNo" : courseno
								};
			 console.log(typeof(message.origin));
			 publisher.publish('RI', JSON.stringify(message));
	console.log("Row successfully deleted from course-student relationship table");
	//client.end();
});
});

}
