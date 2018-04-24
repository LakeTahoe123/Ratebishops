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

$(".errormsg").hide();
const txtEmail=document.getElementById("email");
console.log(txtEmail);
const txtPassword=document.getElementById("password");
console.log(txtPassword)
const btnSubmit=document.getElementById("login");
//const btnSignup=document.getElementById("btnSignup");
//const btnGoogle=document.getElementById("btnGoogleSignIn");

btnSubmit.addEventListener('click', e =>{
  console.log("clicked");
  const email=txtEmail.value;
  console.log(email);
  const pass=txtPassword.value;
  const auth=firebase.auth();
  firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    $(".errormsg").show();
    console.log(errorMessage);
    if(errorMessage=="There is no user record corresponding to this identifier. The user may have been deleted."){
      document.getElementById("errors").innerHTML="No user found with this email.";
    }else{
      document.getElementById("errors").innerHTML=(errorMessage);
    }
  });
  //promise.catch(e =>console.log(e.message));
});

/*btnSignup.addEventListener('click', e=>{
  // TODO: check for real email
  const email=txtEmail.value;
  const pass=txtPassword.value;
  const auth=firebase.auth();

  window.location.href = '/setup.html';

})
*/

var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = 'en';

/*btnGoogle.addEventListener('click', e=>{
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });


})
*/
//listens if you logout, can run stuff in the else
firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    console.log(firebaseUser);
    console.log(firebaseUser.uid);
    window.location.href = '../Mainpage.html';

  }else{
    console.log("not logged in");
  }
})
