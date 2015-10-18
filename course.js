var pg = require('pg');
var connectionString = 'postgres://postgres:postgres@localhost:5433/infinity_course_db';
var client = new pg.Client(connectionString);
client.connect();

exports.addCourse = function(req)
{
console.log('Connected to database');
console.log(req.body.id);
console.log(req.query);
var query = client.query("insert into ms_course_tbl values($1, $2, $3, $4, $5)", [req.body.cid, req.body.courseno, req.body.prof, req.body.room, req.body.timings]);
query.on('end', function(result) { 
console.log("Row successfully inserted");
	//client.end(); 
});
}



exports.addStudentToCourse = function(req)
{

var lname = req.params.lname;
var courseno = req.params.courseno;

var query = client.query("insert into ms_course_student_tbl values($1, $2)", [courseno,lname]);
query.on('end', function(result) { 
console.log("Row successfully inserted");
	//client.end(); 
});
}

exports.getCourseDetails = function(req,res,callback)
{
console.log('Connected to database');
console.log(req.params.course_no);


var query = client.query("Select * from ms_course_tbl where courseno= $1", [req.params.course_no]);
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
var courseno = req.params.course_no;

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

	var courseno = req.params.courseno;

	var queryForCourseDatabase = 'Delete from ms_course_tbl where courseno = $1';

	var courseDeleteQuery = client.query(queryForCourseDatabase, [courseno]);
	query.on('end', function(result) { 
	console.log("Row successfully deleted");
	//client.end(); 
});
	//client.end(); 


}



exports.deleteStudentFromCourse = function(req)
{

var courseno = req.params.courseno;
var lname = req.params.lname;

var queryForStudentCourseDatabase = 'Delete from ms_course_student_tbl where lname = $1 and courseno = $2';

var studentFromCourseDeleteQuery = client.query(queryForStudentCourseDatabase, [courseno,lname]);
	query.on('end', function(result) { 
	console.log("Row successfully deleted");
	//client.end(); 
});

}





