// Initialize Firebase
(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBco8PGP1xna_Do_2tgHYmlpikv6Ar03JI",
    authDomain: "socialmedia-7b24f.firebaseapp.com",
    databaseURL: "https://socialmedia-7b24f.firebaseio.com",
    projectId: "socialmedia-7b24f",
    storageBucket: "socialmedia-7b24f.appspot.com",
    messagingSenderId: "37163023515"
  };
  firebase.initializeApp(config);

}());

const txtEmail=document.getElementById("email");
console.log(txtEmail);
const txtPassword=document.getElementById("password");
console.log(txtPassword)
const btnSubmit=document.getElementById("submit");
//const btnSignup=document.getElementById("btnSignup");
//const btnGoogle=document.getElementById("btnGoogleSignIn");


btnSubmit.addEventListener('click', e =>{
  console.log("clicked");
  const email=txtEmail.value;
  console.log(email);
  const pass=txtPassword.value;
  const auth=firebase.auth();
  auth.signInWithEmailAndPassword(email,pass);
  //promise.catch(e =>console.log(e.message));


})

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
    console.log("should redirect here.");
    //window.location.href = '../match.html';

  }else{
    console.log("not logged in");
  }
})
