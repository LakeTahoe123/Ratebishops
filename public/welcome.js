
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


const btnLogout=document.getElementById("logout");
const txtGrade=document.getElementById("gradetxt");

var database=firebase.database();
var userId;

btnLogout.addEventListener('click', e =>{
  firebase.auth().signOut().then(function() {
    window.location.href = '../login.html';
  }, function(error) {
    console.log(error);
  });
})

function getgrade(snap){
  var grade = snap.child("Grade").val();
  document.getElementById("gradelvl").innerHTML = "Your grade is: "+grade;
}

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    var userId = firebase.auth().currentUser.uid;
    var publicRef = database.ref("users/"+userId+"/publicData");
    publicRef.once("value")
    .then(function(snapshot) {
      var key = snapshot.key;
      snap=snapshot;
      getgrade(snap);

    });
  }else{
    console.log("not logged in");
    window.location.href = '../login.html';
  }
});
