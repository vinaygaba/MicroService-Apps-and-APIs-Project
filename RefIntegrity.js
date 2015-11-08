var redis = require('redis');
var request = require('request');
var config = require('./config.json');
var _ = require('underscore');
//console.log(config);

var arr = Object.keys(config).map(function(k) { return config[k] });
//console.log(arr[0].listener);

var subscriber = redis.createClient(6379, 'localhost' , {no_ready_check: true});
subscriber.on('connect', function() {
    console.log('Connected to Subscriber Redis');
});

var publisher = redis.createClient(6379, 'localhost' , {no_ready_check: true});
publisher.on('connect', function() {
    console.log('Connected to Publisher Redis');
});



subscriber.on("message", function(channel, message) {
  console.log("Got message" + message);
	messageEvent = JSON.parse(message);
	console.log(messageEvent);

	// origin_from_message = messageEvent.origin;
	 event_from_message = messageEvent.event;

	// console.log("Origin-"+  origin_from_message);
	// console.log("Event-" + event_from_message);

	for(var key in arr){
					if(event_from_message == "student_removed_from_all"){
						var course_list = messageEvent.course_nos;
						console.log(course_list);
						var course_array = course_list.split(',');

						for(var i in course_array) {

						url = arr[key].publicurl + "/" + course_array[i];
						request({ url : url,
						method : arr[key].req_method
						}, function (error, response, body) {
						if (!error && response.statusCode == 200) {
						console.log(response.statusCode);
						console.log(response);
						course_details = JSON.parse(response);
						publisher.publish(arr[key].listener, course_details);

						} else {
						console.log(response.statusCode);
						}
						});
						console.log(course_array[i]);
						}

						}
					if(event_from_message == arr[key].event){

						var prev_student_courses=messageEvent.prev_student.course_nos;

						var prev_student_courses_list = prev_student_courses.split(',');

						var curr_student_courses=messageEvent.curr_student.course_nos;
						var curr_student_courses_list = curr_student_courses.split(',');
            var diffCourses = [];
            var length;

             if(curr_student_courses.length < 1)
             {
               diffCourses = prev_student_courses_list;
             }
             else if(prev_student_courses.length < 1)
             {
               diffCourses = curr_student_courses_list;
             }
             else
            {
               outerloop:
               for (var i=0; i < prev_student_courses_list.length; i++) {
                 for (var j=0; j < curr_student_courses_list.length; j++) {
                   if ( prev_student_courses_list[i] == curr_student_courses_list[j] ) {
                     continue outerloop;
                   }
                 }
                 diffCourses.push(prev_student_courses_list[i]);
               }
               outerloop:
               for (var i=0; i < curr_student_courses_list.length; i++) {
                 for (var j=0; j < prev_student_courses_list.length; j++) {
                   if ( prev_student_courses_list[j] == curr_student_courses_list[i] ) {
                     continue outerloop;
                   }
                 }
                 diffCourses.push(curr_student_courses_list[i]);
               }
            }
						var course_diff_array = diffCourses;
						for(var i in course_diff_array) {
                console.log(arr[key].event);
								url = arr[key].publicurl + "/" + course_diff_array[i];
								request({ url : url,
								method : arr[key].req_method
								}, function (error, response, body) {
								if (!error && response.statusCode == 200) {
								console.log(response.statusCode);
								console.log(response.body);
								course_details = JSON.parse(response.body);


								new_student = messageEvent.curr_student.lname;
								curr_student_list = course_details.lnames;
                console.log(curr_student_list);
								new_student_list = "";
								current_students = curr_student_list.split(',');


									if(curr_student_list.indexOf(new_student) >  -1)
								  {
								      for (var i in current_students) {

								          if ( current_students[i] == new_student ) {
								            current_students.splice(i,1);
								          }

								       }
								   new_student_list = current_students;
								  }
								  else
								  {
								   new_student_list = current_students + "," + new_student;
								  }

								course_details.lnames = new_student_list;
								course_details.event = event_from_message;
								console.log(course_details);

								publisher.publish(arr[key].listener, JSON.stringify(course_details));

								} else {
								console.log(response.statusCode);
								}
								});

						}
					}

	 }



	});

subscriber.subscribe("RI");
