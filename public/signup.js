// Initialize Firebase
(function() {
  // Initialize Firebase
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
var uid="user";

const txtEmail=document.getElementById("email");
const txtPassword=document.getElementById("password");
const txtGrade=document.getElementById("grade")
const btnSignup=document.getElementById("signup");


btnSignup.addEventListener('click', e =>{
  console.log("finishClicked");//TODO find a way to integrate SubmitForm into this
  const email=txtEmail.value;
  const pass=txtPassword.value;
  const auth=firebase.auth();
  auth.createUserWithEmailAndPassword(email,pass);
});

$(document).ready(function() {
  $('select').material_select();
});

function writeUserData(uid1) {
  const grade=txtGrade.value;
  console.log(grade);
  firebase.database().ref("users/"+uid1+"/publicData").set({
      Grade: grade
  }).then(() => {
    console.log('Write succeeded!');
    window.location.replace("../welcome.html");
  });

}

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    console.log("logged in.");
    uid = firebase.auth().currentUser.uid;
    console.log(uid);
    writeUserData(uid);

  }else{
    console.log("not logged in");
  }
})
