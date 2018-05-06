
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


$("#teacherCard").hide();
var classRef = firebase.database().ref("/tbs/"+deptName+"/"+className);
classRef.once("value").then(function(snapshot) {
  teacherJSON=snapshot.val();
  if(teacherJSON!==null){
    var i=0;
    sortedList=sortJSON(teacherJSON);

    for (var i in sortedList) {
        var div = document.createElement("div");
        var timeago=Date.now()-sortedList[i][2];
        var teacherCardDiv = $("#teacherCard").clone().prop('id', 'card'+i);
        teacherCardDiv.find("*").each(function() { // appends number to each of the html child elements
          this.id = this.id + i;
        });
        teacherCardDiv.appendTo("#cardColumn");
        teacherCardDiv.show();
        $("#teacherName"+i).text(" "+sortedList[i][0]); // 🍰🍦🍧 puts all the actual content into the card 🍰🍦🍧
        $("#stars"+i).html(getStarsText(sortedList[i][1]["stars"]));
        $("#grade"+i).text("Grade this person got: "+sortedList[i][1]["grade"]);
        $("#time"+i).text(getUnits(timeago)+" ago");
        $("#reviewText"+i).text(sortedList[i][1]["review"]);
        $("#teacherLink"+i).attr("href", "teacher?teacher="+sortedList[i][0]);
        i++;
    }
    document.getElementById("teacherName").innerHTML=className;

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

function sortJSON(jsonObject){
  var i=0;
  console.log(jsonObject);
  var teacherList=[];
  var jsonlist=[];
  var sortedList=[]
  for (key in jsonObject){
    teacherObject = jsonObject[key];
    for (reviewKey in teacherObject){
      teacherList.push([key]);
      sortedList.push([key,teacherObject[reviewKey],teacherObject[reviewKey]["timestamp"]])
      jsonlist.push(teacherObject[reviewKey]);
      console.log(teacherObject[reviewKey]);
    }
    i++
  }
  sortedList.sort(function(a,b){
    return b[2]-a[2];
  });

  console.log(sortedList);
  return sortedList;
}

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    var userId = firebase.auth().currentUser.uid;
  }else{
    console.log("not logged in");
    window.location.href = '../login';
  }
});
