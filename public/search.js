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


$("#department").hide();
$("#languageSelect").hide();


$('#searchForm').submit(function () { //jQuery for making the page not redirect when submitted.
 formSubmit();
 return false;
});

function formSubmit() { //triggers when form is submitted
  console.log("submitted");
  var teacherPicked = document.getElementById("teacherOption").checked;
  var classPicked = document.getElementById("classOption").checked;
  console.log(teacherPicked);

  if(teacherPicked){
    searchDB("teachers");
  }else{
    searchDB("classes");
  }

}

function searchDB(typeSearch){
  firebase.database().ref("/teachers/"+teacherName).once("value").then(function(snapshot) {
    teacherJSON=snapshot.val();
    var avgRating=teacherJSON["avgRating"];
    var ratingsJSON=teacherJSON["ratings"];
    for (var key in ratingsJSON) {
      if (ratingsJSON.hasOwnProperty(key)) {
        var val = ratingsJSON[key];
        pathList.push(val);
      }
    }
  });
  return list;
}

function classSelected() {
  $("#department").show();

}

function teacherSelected() {
  $("#department").hide();
  $("#languageSelect").hide();
}

function changeClasses() {
  if(document.getElementById("department").value == "LANGUAGE"){
    $("#languageSelect").show();
  }else {
    $("#languageSelect").hide();

  }
}
