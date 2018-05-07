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

//for each (review in firebase.database().ref('lastFive'){

firebase.database().ref("/lastFive").once("value").then(function(snapshot) {
  var ratingPaths = snapshot.val(); // 🍇🐨🍇 getting lastfive pathlist 🍇🐨🍇
  var lastFiveList = [];
  var pathList = [];
  var teacherList = [];
  var refList = [];
  for (var key in ratingPaths) {
    if (ratingPaths.hasOwnProperty(key)) {
      var val = ratingPaths[key];
      if(val.slice(-16)=="reviewsAndGrades"){ //TODO MAKE THIS RELIABLE, dont depend on the node, just make a regex to cut everything before the last slash
        var teachers = val.slice(0, -17);
      }else{
        var teachers = val.slice(0, -21);
      }
      var myRe = /[^/]*$/g;
      var myArray = myRe.exec(teachers);
      teachers = myArray[0];
      teacherList.push(teachers);
      lastFiveList.push(key);
      pathList.push(val);
    }
  }

  pathList.reverse();
  teacherList.reverse();

  for (var i = 0; i < pathList.length; i++){
    refList[i]=firebase.database().ref(pathList[i]).once('value');
  }
  //should reverse the reflist here so it goes from most recent to oldest
  var ratingsList = [];
  const all_pr = Promise.all(refList).then(results => { // collecting lastfive reviews
    for(var i = 0; i < refList.length; i++) { // iterates through the reflist
      ratingsList[i] = results[i].val();
      var timeago = Date.now()-ratingsList[i]["timestamp"];
      $("#teacher"+i).text(teacherList[i]+" - "+pathList[i].split("/")[3]);
      $("#time"+i).text(getUnits(timeago)+" ago");
      $("#stars"+i).html(getStarsText(ratingsList[i]["stars"]));
      $("#reviewText"+i).text(ratingsList[i]["review"]);
      $("#teacherLink"+i).attr("href", "teacher?teacher="+teacherList[i]);
    }
  });
});

const dbRef = firebase.database().ref();
const highestRatedTeachers = dbRef.child("teachers").orderByChild("avgRating").limitToLast(10); // 📸🦖😘 nice for ? 😘🦖📸

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
    if(numRatingList[i]>1){
      numRatingList[i]=numRatingList[i]+" reviews";
    }else{
      numRatingList[i]=numRatingList[i]+" review";
    }
    $("#t"+i).html(bestTeacherList[i]+" - "+numRatingList[i]+"<br> "+getStarsText(teacherRatingList[i]));
    $("#t"+i).attr("href", "teacher?teacher="+bestTeacherList[i]);
  }
});

document.getElementById("rateBtn").addEventListener('click', e =>{
  window.location.href = '../rate';
  //promise.catch(e =>console.log(e.message));
});

document.getElementById("logout").addEventListener('click', e =>{
  firebase.auth().signOut().then(function() {
    window.location.href = '../login';
  }, function(error) {
    console.log(error);
  });
});

function getStarsText(avgRating){
  var Starstxt="";
  for (var i=0; i<avgRating; i++){
    Starstxt+="<i class=\"icon-gray material-icons\">star</i>"
  }
  return Starstxt;
}

function getUnits(timeago){
  var unitTime;
  if(timeago<60000){
    unitTime=Math.round(timeago/1000);
    if (unitTime > 1){
      return(unitTime+" seconds");
    }else{
      return(unitTime+" second");
    }
  }else if (timeago<3600000) {
    unitTime=Math.round(timeago/60000);
    if (unitTime > 1){
      return(unitTime+" minutes");
    }else{
      return(unitTime+" minute");
    }

  }else if (timeago<86400000) {
    unitTime=Math.round(timeago/3600000);
    if (unitTime > 1){
      return(unitTime+" hours");
    }else{
      return(unitTime+" hour");
    }
  }else{
    unitTime=Math.round(timeago/86400000);
    if (unitTime>1){
      return (unitTime+" days");
    }else{
      return (unitTime+" day");
    }
  }
}

$( document ).ready(function() {
    $(".dropdown-button").dropdown();
});

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    var userId = firebase.auth().currentUser.uid;
  }else{
    console.log("not logged in");
    window.location.href = '../login';
  }
});
