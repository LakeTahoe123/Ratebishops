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
for (i=0; i<firebase.database().ref('lastFive').length; i++){
//for each (review in db.ref('lastFive')){
  //console.log(review);
  console.log(firebase.database().ref('lastFive')[i]);
  //var pathURL = review.toString();
  var pathURL = firebase.database().ref('lastFive')[i].toString();
  var path = pathURL.replace( "https://ratebishops-6b27c.firebaseio.com", "");
  console.log(path);
}
console.log()
console.log("running");
document.getElementById("rateBtn").addEventListener('click', e =>{
  console.log("clicked");
  window.location.href = '../rate.html';
  //promise.catch(e =>console.log(e.message));


});
