// Initialize Firebase
(function() {
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

var database = firebase.database();
var uid, allClasses; //globals

$(".errormsg").hide();

document.getElementById('postReview').addEventListener('click', e=>{
  var department=document.getElementById("department").value;
  var className=document.getElementById("className").value;
  var teacher=document.getElementById("teacher").value;
  var review=document.getElementById("review").value;
  var letterGrade=document.getElementById("letterGrade").value;
  if(validateForm(department,className,teacher,review,letterGrade)){
    pushOrSetData(department,className, teacher,review, letterGrade);
  }

});

$(document).ready(function() {
  $('select').material_select();
  $('#modal1').modal();

});

function reqListener () {
  allClasses=this.responseText;
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "../classes.txt");
oReq.send();

document.getElementById("department").addEventListener("change", changeClasses());

function changeClasses(){ //add the correct class options to the select (classes are drawn from the text file)
  $('#className').empty()
  var selectDept=document.getElementById("department");
  var classList=getclasses(selectDept.value);
  classList.pop();
  var option = document.createElement("option");
  option.text = "(Pick Your Class)";
  document.getElementById("className").add(option);
  document.getElementById("className").options[0].disabled = true;
  for(i=1; i<(classList.length); i++){
    var option = document.createElement("option");
    option.text = classList[i];
    document.getElementById("className").add(option);
  }
  $('select').material_select();
}

function getclasses(department){
  var firstsplit=allClasses.split("***START OF "+department+" SECTION***");//TODO catch this error so that other code will still run
  var secondsplit=firstsplit[1].split("***END OF "+department+" SECTION***");
  return secondsplit[0].split("\n");
}

function setNewParentData(department,className, teacher,review, letterGrade){
  var dataRef = firebase.database().ref("tbs");
  console.log("setting new data");
  dataRef.child(department+"/"+className+"/"+teacher).set({
    reviewsAndGrades: {
      review: review,
      grade: letterGrade,
    },
  });
}


function openModal1(){
  $('#modal1').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      backdrop: 'static',
      keyboard: false,
      ready: function(modal, trigger) {
          console.log(modal, trigger);
      },
        complete: function() {
          alert('Closed');
        } // Callback for Modal close
    });
}

function pushNewChildData(department,className, teacher,review, letterGrade){
  var dataRef = firebase.database().ref("tbs");
  dataRef.child(department+"/"+className+"/"+teacher).push({
    review: review,
    grade: letterGrade,
  });
  console.log("modal opening");
}

function pushOrSetData(department,className,teacher,review,letterGrade){
  var publicRef = database.ref("tbs/"+department+"/"+className);
  var snap,hasTeacher;
  publicRef.once("value")
  .then(function(snapshot) {
    var key = snapshot.key;
    var hasTeacher = snapshot.hasChild(teacher);
    if(!hasTeacher){
      console.log('hasteacher');
      setNewParentData(department,className,teacher,review,letterGrade);
    }else{
      pushNewChildData(department,className,teacher,review,letterGrade);
    }
    console.log($('#modal1'))
    $('#modal1').modal('open');

  });
}

function validateForm(department,className,teacher,review,letterGrade) {
    var wassup=true;
    $(".errormsg").hide();
    console.log(teacher);
    if(department=="(Pick)" || className=="(Pick Your Class)" || teacher=="" || review=="" || letterGrade==""){
      wassup=false;
    }
    if(!wassup){
      $("#rateerror").show();
    }
    return wassup;

}

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    uid=firebase.auth().currentUser.uid;
    console.log("logged in")
  }else{
    window.location.href = '../login.html';
    console.log("not logged in");
  }
})
