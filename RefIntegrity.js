var redis = require('redis');
var config = require('./config.json');
var _ = require('underscore');
//console.log(config);

var arr = Object.keys(config).map(function(k) { return config[k] });
//console.log(arr[0].listener);

var subscriber = redis.createClient(10001, 'localhost' , {no_ready_check: true});
subscriber.on('connect', function() {
    console.log('Connected to Subscriber Redis');
});

var publisher = redis.createClient(10001, 'localhost' , {no_ready_check: true});
publisher.on('connect', function() {
    console.log('Connected to Publisher Redis');
});



subscriber.on("message", function(channel, message) {
  console.log("Got message" + message);
	messageEvent = JSON.parse(message);
	console.log(messageEvent);

	// origin_from_message = messageEvent.origin;
	// event_from_message = messageEvent.event;

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
					if(event_from_message == "student_updated"){

						var prev_student_courses=messageEvent.prev_student.course_nos;
						var prev_student_courses_list = prev_student_courses.split(',');

						var curr_student_courses=messageEvent.curr_student.course_nos;
						var curr_student_courses_list = curr_student_courses.split(',');

						if(curr_student_courses_list.length > prev_student_courses_list.length)
						var diff=_.difference(curr_student_courses_list,prev_student_courses_list);
						else
						var diff=_.difference(prev_student_courses_list,curr_student_courses_list);
						console.log(diff);

						var course_diff_array = diff.split(',');

						for(var i in course_diff_array) {

						url = arr[key].publicurl + "/" + course_diff_array[i];
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
						console.log(course_diff_array[i]);
						}
					}

	 }
       


	});

subscriber.subscribe("RI");
