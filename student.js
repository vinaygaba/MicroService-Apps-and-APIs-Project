var pg = require('pg');
var connectionString = 'postgres://postgres:postgres@localhost:5433/infinity_student_db';
var client = new pg.Client(connectionString);
client.connect();

exports.addStudent = function(req)
{
console.log('Connected to database');
console.log(req.body.id);
var query = client.query("insert into ms_student_tbl values($1, $2, $3, $4, $5, $6, $7)", [req.body.sid, req.body.fname, req.body.lname, req.body.phno, req.body.degree, req.body.year, req.body.address]);
query.on('end', function(result) { 
console.log("Row successfully inserted");
	//client.end(); 
});
}


exports.getStudentDetails = function(req,res,callback)
{
console.log('Connected to database');
console.log(req.params.student_id);
var query = client.query("Select * from ms_student_tbl where lname= $1", [req.params.student_id]);
query.on('row', function(row) {
console.log('Row received') ;
res.json({fname:row.fname, lname:row.lname, sid:row.id, phno:row.phno, degree:row.degree, year:row.year, address:row.address});
	callback(res);
	//client.end();
	 });
}
