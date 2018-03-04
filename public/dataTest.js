masterDataJSON = {message: "hello"}
var database = firebase.database();
var newPostRef = postListRef.push();
newPostRef.set(masterDataJSON);
var uid;

document.getElementById('postReview').addEventListener("click", e=>(
  var department=document.getElementById("department").value;
  var className=documentent.getElementByID("className").value;
  var teacher=document.getElementById("teacher").value;
  var review=document.getElementById("review").value;
  var letterGrade=document.getElementByID("letterGrade").value;


}


function writeUserData(department, className, teacher, review, letterGrade) {
  firebase.database().ref('' +).set({
    tbs: {
      department:{
          className: {
            teacher: {
              uid: {
                review:review
                letterGrade:letterGrade
              }
          }
      }
    }
  });
};

firebase.auth().onAuthStateChanged(firebaseUser=>{
  if(firebaseUser){
    uid=firebase.auth().currentUser.uid;
    console.log(uid);

  }else{
    console.log("not logged in");
  }
})
