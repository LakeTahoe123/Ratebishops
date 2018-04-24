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
  console.log(ratingPaths);
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
  for (var i=4; i>=0; i--){
    var teacherElement=document.getElementById("t"+(i+1));
    teacherElement.innerHTML=teacherList[i];
    teacherElement.href="teacher"+"?teacher="+teacherList[i];
  }
  pathList.reverse();
  teacherList.reverse();

  console.log(pathList);
  for (var i = 0; i < pathList.length; i++){
    refList[i]=firebase.database().ref(pathList[i]).once('value');
  }
  //should reverse the reflist here so it goes from most recent to oldest
  var ratingsList = [];
  const all_pr = Promise.all(refList).then(results => { // collecting lastfive reviews
    for(var i = 0; i < refList.length; i++) { // iterates through the reflist
      ratingsList[i] = results[i].val();
      console.log("ratinglist:"+ratingsList[i]);
      var timeago = Date.now()-ratingsList[i]["timestamp"];
      var teacherCardDiv = $("#teacherCard").clone().prop('id', 'card'+i);
      teacherCardDiv.find("*").each(function() { // appends number to each of the html child elements
        this.id = this.id + i;
      });
      teacherCardDiv.appendTo("#cardColumn");
      $("#teacher"+i).html(teacherList[i]+" - "+pathList[i].split("/")[3]+"<p>"+getUnits(timeago)+" ago<br>"+ratingsList[i]["review"]+"<br>stars: "+ratingsList[i]["stars"]+"</p>");
      $("#teacher"+i).attr("href", "teacher?teacher="+teacherList[i]);
    }
    $("#teacherCard").hide();
    console.log(ratingsList);
  });
});

document.getElementById("rateBtn").addEventListener('click', e =>{
  console.log("clicked");
  window.location.href = '../rate';
  //promise.catch(e =>console.log(e.message));
});

console.log("ESKETIT GOT checkpoint 0");
var highestRatingRef = firebase.database().ref("/teacher/");
console.log("SUH DUDE got checkpoint1");
arrayOfRatingVals = [];
arrayOfTeacherNames = [];
// highestRatingRef.forEach(function(data){
//   console.log("inside for each")
//   current=data.avgRating.val();
//   arrayOfRatingVals.append(current);
//   console.log('before appending teacher name')
//   arrayOfTeacherNames.append(data);
// })
// highestRatingRef.orderByValue().limitToFirst(5).on("value", function(snapshot) {
//   console.log("YE YE GOT CHECKPOINT 2");
//   console.log(snapshot.val());
//   snapshot.forEach(function(data) {
//     console.log("WASSSA WASSSA BITCONNECT got checkpoint 3");
//     console.log("The " + data.key + " average rating is " + data.val());
//   });
// });dd
document.getElementById("logout").addEventListener('click', e =>{
  firebase.auth().signOut().then(function() {
    window.location.href = '../login.html';
  }, function(error) {
    console.log(error);
  });
});

function getUnits(timeago){
  var unitTime; //TODO check for plural/notplural time. for example, if it is only 1, it shouldnt be 1 hours, correct to 1 hour
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

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    var userId = firebase.auth().currentUser.uid;
    console.log(userId);
  }else{
    console.log("not logged in");
    window.location.href = '../login.html';
  }
});
