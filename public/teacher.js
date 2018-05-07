
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

$("#teacherCard").hide();

var url = window.location.href;
var teacherName=decodeURI(url.split("=")[1]); //gets the teacher name from url
var pathList=[];

firebase.database().ref("/teachers/"+teacherName).once("value").then(function(snapshot) {
  teacherJSON=snapshot.val();
  if(teacherJSON != null){
    var avgRating = teacherJSON["avgRating"];
    var ratingsJSON = teacherJSON["ratings"];
    for (var key in ratingsJSON) {
      if (ratingsJSON.hasOwnProperty(key)) {
        var val = ratingsJSON[key];
        pathList.push(val);
      }
    }

    document.getElementById("teacherName").innerHTML=teacherName;

    document.getElementById("titleHeader").innerHTML="Average Rating: "+getStarsText(avgRating);

    var timeStampList = [];
    var refList = [];
    var ratingsList = []
    for (var i = 0; i < pathList.length; i++){
      refList[i]=firebase.database().ref(pathList[i]).orderByChild("timestamp").once('value');
    }
    const all_pr = Promise.all(refList).then(results => { // 🤯🤯🤯 collecting all the reviews for this teacher 🤯🤯🤯
      $("#teacherCard").show();
      var jsonList=[];
      results.forEach(function(child) {
        var teacherJSON = child.val();
        jsonList.push(teacherJSON);
      });

      jsonList.reverse();
      pathList.reverse();
      console.log(jsonList)

      for(var i = 0; i < refList.length; i++) { // iterates through the reflist
        if(jsonList[i]==null){
          i++
        }
        var timeago = Date.now()-jsonList[i]["timestamp"];
        var teacherCardDiv = $("#teacherCard").clone().prop('id', 'card'+i);
        teacherCardDiv.find("*").each(function() { // appends number to each of the html child elements
          this.id = this.id + i;
        });
        teacherCardDiv.appendTo("#cardColumn");

        $("#stars"+i).html(getStarsText(jsonList[i]["stars"])); // puts all the actual content into the card
        $("#grade"+i).text("Grade this person got: "+jsonList[i]["grade"]);
        $("#time"+i).text(getUnits(timeago)+" ago");
        $("#className"+i).text(pathList[i].split("/")[3]);
        $("#reviewText"+i).text(jsonList[i]["review"]);
        $("#classLink"+i).attr("href", "class?dept="+pathList[i].split("/")[2]+"=class="+pathList[i].split("/")[3]);

      }
      $("#teacherCard").hide();
    });
  }else{
    // 😿😿😿 "is null." 😿😿😿
    $("#teacherCard").hide();
    $("#titleHeader").html("There are no reviews for this teacher. Do you want to <a href=\"rate\">submit a review?</a>")
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
