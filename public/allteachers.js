// Initialize Firebase
(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBGBBbL9dDtRDi7WG3RsZ4eE-2qnqkAvFw",
    authDomain: "ratebishops-6b27c.firebaseapp.com",
    databaseURL: "https://ratebishops-6b27c.firebaseio.com",
    projectId: "ratebishops-6b27c",
    storageBucket: "ratebishops-6b27c.appspot.com",
    messagingSenderId: "62112601506"
  };
  firebase.initializeApp(config);

}());


const dbRef = firebase.database().ref();
const highestRatedTeachers = dbRef.child("teachers").orderByChild("avgRating"); // 🍔🍂🆑 better now 🆑🍂🍔

highestRatedTeachers.once("value").then(function(snapshot) {
  var bestTeacherList = [];
  var teacherRatingList = [];
  var numRatingList = [];

  snapshot.forEach(function(child) { // this is the 5 highest rated teachers
    bestTeacherList.push(child.ref.key);

    var teacherJSON = child.val();
    teacherRatingList.push(teacherJSON["avgRating"]);
    numRatingList.push(teacherJSON["numRatings"]);
  });
  console.log(bestTeacherList);
  for (var i=0; i < bestTeacherList.length; i++){
    $("#t"+i).html(bestTeacherList[i]+" - "numRatingList[i]+" ratings<br> "+getStarsText(teacherRatingList[i]));
    $("#t"+i).attr("href", "teacher?teacher="+bestTeacherList[i]);
  }
});

function getStarsText(avgRating){
  var Starstxt="";
  for (var i=0; i<avgRating; i++){
    Starstxt+="<i class=\"icon-gray material-icons\">star</i>"
  }
  return Starstxt;
}
