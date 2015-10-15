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

var queryString;
console.log(req.body[0]);
console.log(req.params[0]);
var paramName = req.params[0];
console.log(req.params.paramName);

// for (var param in req.query) {
//     if (req.query.hasOwnProperty(param)) {
//         Console.log(param);
//         Console.log(req.query.param);
//     }
// }

// var query = client.query("UPDATE ms_course_tbl SET where courseno=$1",[req.params.course_no]);
// query.on('end', function(result) { 
// console.log("Row successfully inserted");
	//client.end(); 
//});
}


