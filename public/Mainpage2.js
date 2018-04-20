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
  var ratingPaths = snapshot.val();
  console.log(ratingPaths);
  var lastFiveList = [];
  var pathList = [];
  var teacherList = [];
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
      console.log(myArray);
      teachers = myArray[0];
      teacherList.push(teachers);
      lastFiveList.push(key);
      pathList.push(val);
    }
  }

  for (var i=4; i>=0; i--){
    console.log(i);
    var teacherElement=document.getElementById("t"+(i+1));
    teacherElement.innerHTML=teacherList[i];
    teacherElement.href="teacher"+"?teacher="+teacherList[i];
  }

});

document.getElementById("rateBtn").addEventListener('click', e =>{
  console.log("clicked");
  window.location.href = '../rate';
  //promise.catch(e =>console.log(e.message));

});

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    var userId = firebase.auth().currentUser.uid;
    console.log(userId);
  }else{
    console.log("not logged in");
    window.location.href = '../login.html';
  }
});
