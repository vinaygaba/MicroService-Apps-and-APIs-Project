function returnDifferentCourses(oldCourses , newCourses){

  var oldCoursesList = oldCourses;
  var newCoursesList = newCourses;
  var diffCourses = [];
  var length;

  var earlierCourses = oldCoursesList.split(',');
  var newCourses = newCoursesList.split(',');

  if(newCoursesList.length < 1)
  {
    diffCourses = earlierCourses;
  }
  else if (earlierCourses.length > newCourses.length)
  {
    outerloop:
    for (var i=0; i < earlierCourses.length; i++) {
      for (var j=0; j < newCourses.length; j++) {
        if ( earlierCourses[i] == newCourses[j] ) {
          continue outerloop;
        }
      }
      diffCourses.push(earlierCourses[i]);
    }
  }
  else
  {
    outerloop:
    for (var i=0; i < newCourses.length; i++) {
      for (var j=0; j < earlierCourses .length; j++) {
        if ( earlierCourses[i] == newCourses[j] ) {
          continue outerloop;
        }
      }
      diffCourses.push(newCourses[i]);
    }
  }

  return diffCourses;
}

function updatedStudentList(oldStudentList , newStudent){
  var currentStudentList = oldStudentList;
  var studentToAdd = newStudent;
  var newStudentList = "";
  var currentStudents = currentStudentList.split(",");
  if(currentStudentList.indexOf(studentToAdd) >  -1)
  {
      for (var i=0; i < currentStudents.length; i++) {

          if ( currentStudents[i] == studentToAdd ) {
            currentStudents.splice(i,1);
          }

       }
   newStudentList = currentStudents;
  }
  else
  {
     newStudentList = currentStudentList + "," + studentToAdd;
  }

  return newStudentList;

}
