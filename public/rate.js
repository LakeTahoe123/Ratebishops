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
var uid;
var allClasses="lol";
var allTeachers="lol";

$(".errormsg").hide();
$("#languageSelect").hide();
$("#divlang").hide();

var globalstars;

document.getElementById('postReview').addEventListener('click', e=>{
  var department=document.getElementById("department").value;
  var className=document.getElementById("className").value;
  var teacher=document.getElementById("teacher").value;
  var review=document.getElementById("review").value;
  var letterGrade=document.getElementById("letterGrade").value;
  var starRating=globalstars;

  //var starRating=getNumStars();
  if(validateForm(department,className,teacher,review,letterGrade,starRating)){
    pushOrSetData(department,className, teacher,review, letterGrade,starRating);
  }

});

$(document).ready(function() { //stuff that exectures when the page is loaded
  $('select').material_select();
  $('#modal1').modal();
});

var oReq1 = new XMLHttpRequest(); //logic to get the classes.txt file
oReq1.addEventListener("load", teachListener);
oReq1.open("GET", "../teachers.txt");
oReq1.send();

function teachListener () {
  allTeachers=this.responseText; //i honestly have no clue what this is sike this is the text of the teachers.txt file

}

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
  $('#teacher').empty() //empties the dropdown before putting in new teachers/classes

  var selectDept=document.getElementById("department");
  if(selectDept.value=="LANGUAGE"){
    //$("#languageSelect").show();
    $("#divlang").show();
    $('select').material_select();

  }else{
    //$("#languageSelect").hide();
    $("#divlang").hide();

    var cList=getclasses(selectDept.value, allClasses);
    var tList=getclasses(selectDept.value, allTeachers);
    insertClasses(tList, document.getElementById("teacher"))
    insertClasses(cList, document.getElementById("className"));
  }

}

function getNumStars() { //TODO check if this code is essential
  console.log(document.getElementById('star1').checked)
  for (i = 1; i <= 5; i++) {
    spider='star'
    spider +=i
    if (document.getElementById(spider).checked) {
      console.log(spider)
      return spider;
    }
  }
}

function changeLangClasses(){
  $('#className').empty()
  $('#teacher').empty()


  //this will insert the correct language classes when user changes their language
  var cList=getclasses(document.getElementById("languageSelect").value, allClasses);
  var tList=getclasses(document.getElementById("languageSelect").value, allTeachers);


  insertClasses(cList, document.getElementById("className"));
  insertClasses(tList, document.getElementById("teacher"));


}

function insertClasses(classList, selectElement){
    try{
      classList.pop(); //removes the last element, which comes out empty usually
      var option = document.createElement("option"); //this logic makes the placeholder option first
      if(selectElement==document.getElementById("teacher")){
        option.text = "(Pick Your Teacher)";

      }else{
        option.text = "(Pick Your Class)";

      }
      selectElement.add(option);
      selectElement.options[0].disabled = true;

      for(i=1; i<(classList.length); i++){
        var option = document.createElement("option"); //the actual classes in
        option.text = classList[i];
        selectElement.add(option);
      }
      $('select').material_select();
    }catch(err){
      //console.log(err);
    }
  }

function getclasses(department, whichlist){
  try{
    var firstsplit=whichlist.split("***START OF "+department+" SECTION***");
    var secondsplit=firstsplit[1].split("***END OF "+department+" SECTION***");
    return secondsplit[0].split("\n");
  }
  catch(err){
    //console.log(err);
  }
}

function setNewParentData(department,className, teacher,review, letterGrade, starRating){
  var dataRef = firebase.database().ref("tbs");
  console.log("setting new data");
  dataRef.child(department+"/"+className+"/"+teacher).set({
    reviewsAndGrades: {
      review: review,
      grade: letterGrade,
      stars: starRating
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
          console.log("closemodal");
        } // Callback for Modal close
    });
}

function pushNewChildData(department,className, teacher,review, letterGrade, starRating){
  var dataRef = firebase.database().ref("tbs");
  dataRef.child(department+"/"+className+"/"+teacher).push({
    review: review,
    grade: letterGrade,
    stars: starRating
  });
  console.log("modal opening");
}

function pushOrSetData(department,className,teacher,review,letterGrade, starRating){
  var publicRef = firebase.database().ref("tbs/"+department+"/"+className);
  refString="/tbs/"+department+"/"+className+"/"+teacher+"/";
  console.log(refString);
  if(userReviews.includes(refString)){
    $('#modal1').modal('open');
    document.getElementById("modalMessage").innerHTML="You have already reviewed this class, therefore your review was not accepted.";
  }else{
    var snap, hasTeacher;
    publicRef.once("value").then(function(snapshot) {
      var key = snapshot.key;
      var hasTeacher = snapshot.hasChild(teacher);
      if(!hasTeacher){
        setNewParentData(department,className,teacher,review,letterGrade,starRating);
      }else{
        pushNewChildData(department,className,teacher,review,letterGrade,starRating);
      }
      $('#modal1').modal('open');

    });
  }

}

function validateForm(department,className,teacher,review,letterGrade, starRating) {
    var wassup=true; //if wassup is true, then the forms good and it will submit
    $(".errormsg").hide();
    if(department=="(Pick)" || className=="(Pick Your Class)" || className=="" || teacher=="" || teacher=="(Pick Your Teacher)" || review=="" || letterGrade=="" || starRating==undefined ){ //add || starRating=""
      wassup=false;
    }
    if(!wassup){
      $("#rateerror").show();
    }
    return wassup;
}

var userReviews=[];

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    uid=firebase.auth().currentUser.uid;
    console.log("logged in");
    database.ref("/users/"+uid+"/privateData").once("value").then(function(snapshot) {
      reviews=snapshot.val();
      for (var key in reviews) {
        if (reviews.hasOwnProperty(key)) {
          var val = reviews[key];
          val=val.split(val.split("/")[5])[0];
          userReviews.push(val);
        }
      }
    });

  }else{
    window.location.href = '../login.html';
    console.log("not logged in");
  }
});

//⭐⭐⭐STAR RATING⭐⭐⭐
function ready(fn) {
  if(document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
var selectedRating = 0;
ready(function(){
  function addClass(el, className) {
    if(typeof el.length == "number") {
      Array.prototype.forEach.call(el, function(e,i){ addClass(e, className) });
      return;
    }
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  }
  function removeClass(el, className) {
    if(typeof el.length == "number") {
      Array.prototype.forEach.call(el, function(e,i){ removeClass(e, className) });
      return;
    }
    if (el.classList)
      el.classList.remove(className);
    else if(el.className)
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
  var stars = document.querySelectorAll(".rating-stars a");
  Array.prototype.forEach.call(stars, function(el, i){
    el.addEventListener("mouseover", function(evt){
      removeClass(stars, "selected");
      // For each star up to the highlighted one, add "hover"
      var to = parseInt(evt.target.getAttribute("data-rating"));
      Array.prototype.forEach.call(stars, function(star, i) {
        if(parseInt(star.getAttribute("data-rating")) <= to) {
          addClass(star, "hover");
        }
      });
    });
    el.addEventListener("mouseout", function(evt){
      removeClass(evt.target, "hover");
    });
    el.addEventListener("click", function(evt){
      selectedRating = parseInt(evt.target.getAttribute("data-rating"));
      globalstars=selectedRating;
      removeClass(stars, "hover");
      Array.prototype.forEach.call(stars, function(star, i) {
        if(parseInt(star.getAttribute("data-rating")) <= selectedRating) {
          addClass(star, "selected");
        }
      });
      evt.preventDefault();
    });
  });
  document.querySelector(".rating-stars").addEventListener("mouseout", function(evt){
    // When the cursor leaves the whole rating star area, remove the "hover" class and apply
    // the "selected" class to the number of stars selected.
    removeClass(stars, "hover");
    if(selectedRating) {
      Array.prototype.forEach.call(stars, function(star, i) {
        if(parseInt(star.getAttribute("data-rating")) <= selectedRating) {
          addClass(star, "selected");
        }
      });
    }
  });

});
