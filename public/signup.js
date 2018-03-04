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

$(".errormsg").hide();


const txtEmail=document.getElementById("email");
const txtPassword=document.getElementById("password");
const txtGrade=document.getElementById("grade");
const btnSignup=document.getElementById("signup");


btnSignup.addEventListener('click', e =>{
  //TODO find a way to integrate SubmitForm into this //?? idk what this even means
  const email=txtEmail.value;
  const pass=txtPassword.value;
  const auth=firebase.auth();
  if(validateForm()){
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
  }
});

$(document).ready(function() {
  $('select').material_select();
});

function writeUserData(uid1) {
  const grade=txtGrade.value;
  firebase.database().ref("users/"+uid1+"/publicData").set({
    Grade: grade
  }).then(() => {
    window.location.replace("../welcome.html");
  });
}

function validateForm() {
    var wassup=true;
    $(".errormsg").hide()
    if (txtPassword.value=="") {
      $('#passerror').show();
      wassup=false;
    }if (txtEmail.value=="") {
      $('#emailerror').show();
      wassup=false;
    }if(txtGrade.value=="Choose your option"){
      $('#gradeerror').show();
      wassup=false;
    }
    if(!wassup){
      $('#errors').show();
    }
    return wassup;

}

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    uid = firebase.auth().currentUser.uid;
    writeUserData(uid);
    window.location.href = '../welcome.html';
  }else{
    console.log("not logged in");
  }
})
