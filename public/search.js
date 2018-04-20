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

$('#searchForm').submit(function () { //jQuery for making the page not redirect when submitted.
 formSubmit();
 return false;
});

function formSubmit() { //triggers when form is submitted
  console.log("submitted");
  var teacherPicked = document.getElementById("teacherOption").checked;
  var classPicked = document.getElementById("classOption").checked;
  if(teacherPicked){
    window.location.href = '../teacher?teacher='+document.getElementById("autocomplete-input").value;
  }else{
    var className=document.getElementById("autocomplete-input").value;
    var dept="";
    for (i in deptClassList) {
      if(deptClassList[i].includes(className)) {
        dept=deptList[i];
        break; // 🌺🌺🌺 I like this emoji 🌺🌺🌺
      }
    }
    window.location.href = '../class?dept='+dept+"=class="+className;
  }
}


var oReq1 = new XMLHttpRequest(); // 🍎🍎🍎 this gets the teachers.txt file 🍎🍎🍎
oReq1.addEventListener("load", teachListener);
oReq1.open("GET", "../teachers.txt");
oReq1.send();

var allTeachers;
function teachListener() {
  allTeachers=this.responseText; //  this is the text of the teachers.txt file
}

var oReq2 = new XMLHttpRequest(); // 🏫🏫🏫 this gets the classes.txt file 🏫🏫🏫
oReq2.addEventListener("load", classListener);
oReq2.open("GET", "../classes.txt");
oReq2.send();
var allClasses;
function classListener() {
  allClasses=this.responseText;
}

function getTeachersList(){
  console.log("teacher list running");
  var tList=getclasses(allTeachers);
  return tList;
}

function getClassesList(){
  console.log("class list running");
  var cList=getclasses(allClasses);
  return cList;
}

var deptClassList=[];
deptList=["ARTS","ENGLISH","MATH","SCIENCE","COMPUTERSCIENCE","HISTORY","PERFORMING ARTS","CHINESE","FRENCH","LATIN","SPANISH","RELIGION","INDEPENDENT ELECTIVES"];

function getclasses(whichlist){
  var allTeacherList=[];
  for (i in deptList){
    try{
      var firstsplit=whichlist.split("***START OF "+deptList[i]+" SECTION***");
      var secondsplit=firstsplit[1].split("***END OF "+deptList[i]+" SECTION***");
      allTeacherList=allTeacherList.concat(secondsplit[0].split("\n"));
      deptClassList[i]=secondsplit[0].split("\n");
    }
    catch(err){
      //console.log(err);
    }
  }
  return(allTeacherList);
}

function classSelected() {
  var classList = getClassesList().slice(1);
  initAutocomplete(classList);
}

function initAutocomplete(teacherList){
  var jsonData = {};
  teacherList.forEach(function(column) {
    jsonData[column] = null; // this makes the json object, the value is a image url that we can display if we want to.
  });

  $('#autocomplete-input').autocomplete({
    data: jsonData, // this is the data that gets fed into the materialze autocomplete
    limit: 20,
    onAutocomplete: function(val) {
      console.log("complete");
      // Callback
    },
    minLength: 2, // The amount of characters that the user types before autocomplete starts
  });
}

function teacherSelected() {
  var teacherList = getTeachersList().slice(1);
  initAutocomplete(teacherList);
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
