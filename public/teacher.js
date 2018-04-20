
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
var teacherName=decodeURI(url.split("=")[1]);
var pathList=[];

firebase.database().ref("/teachers/"+teacherName).once("value").then(function(snapshot) {
  teacherJSON=snapshot.val();
  if(teacherJSON!==null){
    var avgRating=teacherJSON["avgRating"];
    var ratingsJSON=teacherJSON["ratings"];
    for (var key in ratingsJSON) {
      if (ratingsJSON.hasOwnProperty(key)) {
        var val = ratingsJSON[key];
        pathList.push(val);
      }
    }

    document.getElementById("teacherName").innerHTML=teacherName+" average rating: "+avgRating;

    var timeStampList=[];
    var refList=[];
    var ratingsList=[]
    for(var i=0; i<pathList.length; i++){
      refList[i]=firebase.database().ref(pathList[i]).once('value');
    }
    const all_pr=Promise.all(refList).then(results => { //collecting all the reviews for this teacher
      for(var i = 0; i < refList.length; i++) { //iterates through the pathlist
        ratingsList[i]=results[i].val();
        var div = document.createElement("div");
        var timeago=Date.now()-ratingsList[i]["timestamp"];
        div.innerHTML = "class: " + (pathList[i].split("/")[3]) + " review: "+ratingsList[i]["review"]+" Grade: "+ratingsList[i]["grade"]+" Stars: "+ratingsList[i]["stars"]+" time: "+getUnits(timeago)+" ago";
        document.getElementById("main").appendChild(div);
      }
      console.log(ratingsList);
    });
  }else{
    console.log("is null.")
    var div = document.createElement("div");
    div.innerHTML = "There are no reviews for this teacher. Do you want to "
    a = document.createElement('a');
    a.href =  'rate'; // Insted of calling setAttribute
    a.innerHTML = "be the first to review this teacher?" // <a>INNER_TEXT</a>
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
