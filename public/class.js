
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

$("#teacherCard").hide();

firebase.database().ref("/tbs/"+deptName+"/"+className).once("value").then(function(snapshot) {
  teacherJSON=snapshot.val();
  if(teacherJSON!==null){
    var i=0;

    for (var key in teacherJSON) {
      if (teacherJSON.hasOwnProperty(key)) {
        var val = teacherJSON[key];
        for (var key1 in val) {
          var val1=val[key1];
          var div = document.createElement("div");
          var timeago=Date.now()-val1["timestamp"];
          var teacherCardDiv = $("#teacherCard").clone().prop('id', 'card'+i);
          teacherCardDiv.find("*").each(function() { // appends number to each of the html child elements
            this.id = this.id + i;
          });
          teacherCardDiv.appendTo("#cardColumn");
          teacherCardDiv.show();
          console.log(key);
          console.log(i);

          $("#teacherName"+i).html(" "+key); // 🍰🍦🍧 puts all the actual content into the card 🍰🍦🍧
          $("#stars"+i).html("Stars (out of 5): "+val1["stars"]); //puts all the actual content into the card
          $("#grade"+i).html("Grade this person got: "+val1["grade"]); //puts all the actual content into the card
          $("#time"+i).html(getUnits(timeago)+" ago");
          $("#reviewText"+i).html(val1["review"]);
          console.log($("#teacherLink")+i);
          $("#teacherLink"+i).attr("href", "teacher?teacher="+key);
          pathList.push(key);
          i++;

        }
      }

    }
    console.log(pathList);
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

  }else{
    console.log("not logged in");
    window.location.href = '../login.html';
  }
});
