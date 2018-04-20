
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

var url = window.location.href;
var deptName=decodeURI(url.split("=")[1]);
var className=decodeURI(url.split("=")[3]);

var pathList=[];

firebase.database().ref("/tbs/"+deptName+"/"+className).once("value").then(function(snapshot) {
  teacherJSON=snapshot.val();
  if(teacherJSON!==null){
    for (var key in teacherJSON) {
      if (teacherJSON.hasOwnProperty(key)) {
        var val = teacherJSON[key];
        for (var key1 in val) {
          var val1=val[key1];
          var div = document.createElement("div");
          var timeago=Date.now()-val1["timestamp"];
          div.innerHTML = "teacher: " + (key+ " review: "+val1["review"]+" Grade: "+val1["grade"]+" Stars: "+val1["stars"]+" time: "+getUnits(timeago)+" ago");
          document.getElementById("main").appendChild(div);
          pathList.push(key);
        }
      }
    }
    console.log(pathList);
  }else{
    var div = document.createElement("div");
    div.innerHTML = "There are no reviews for this class. Do you want to "
    a = document.createElement('a');
    a.href =  'rate'; // Insted of calling setAttribute
    a.innerHTML = "be the first to review this class?" // <a>INNER_TEXT</a>
    div.appendChild(a); // Append the link to the div
    document.getElementById("main").appendChild(div);
  }
});


function getUnits(timeago){
  var unitTime; //TODO check for plural/notplural time. for example, if it is only 1, it shouldnt be 1 hours, correct to 1 hour
  if(timeago<60000){
    unitTime=Math.round(timeago/1000);
    return(unitTime+" seconds");
  }else if (timeago<3600000) {
    unitTime=Math.round(timeago/60000);
    return (unitTime+" minutes")
  }else if (timeago<86400000) {
    unitTime=Math.round(timeago/3600000);
    return(unitTime+" hours");
  }else{
    unitTime=Math.round(timeago/86400000);
    return (unitTime+" days");
  }
}

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    var userId = firebase.auth().currentUser.uid;
    getTeachersList();

  }else{
    console.log("not logged in");
    window.location.href = '../login.html';
  }
});
