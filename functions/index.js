// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.addTimestamp = functions.database.ref('/tbs/{department}/{class}/{teacher}/{reviews}').onCreate((event) => {
  pathArray=event.data.ref.path.pieces_;
  teacherName=pathArray[3]; //TODO implement server side check that the teacher isnt null
  pathString="";
  var isAdmin = event.auth.admin;
  var uid = event.auth.variable ? event.auth.variable.uid : null;
  for(i=0; i<pathArray.length; i++){
    pathString=pathString+"/"+pathArray[i]; //PathString is the path of this review
  }

  var myreview=event.data.val(); //getting the amount of stars that the person left on this teacher
  numStarsreview=myreview["stars"];
  var numChildren,reviews;
  admin.database().ref("/teachers/"+teacherName).once("value", function(snapshot) {
      numChildren = snapshot.numChildren();
      reviews=snapshot.val();
  }).then(() =>{
      avgRatingRef = admin.database().ref("/teachers/"+teacherName);
      //admin.database().ref(pathString).once("value",function(snapshot){
        //reviews=snapshot.val();
      //}

      if(numChildren>1){
        numRatings1 = reviews["numRatings"];
        avg = reviews["avgRating"];
        newAvg = (avg*numRatings1+numStarsreview)/(numRatings1+1);

        avgRatingRef.update({
          avgRating: newAvg,
          numRatings: numRatings1+1
        });
      }else{
        avgRatingRef.update({
          avgRating: numStarsreview,
          numRatings: 1
        });
      }
  });
  var canWrite=true;

  admin.database().ref('/users/'+uid+'/privateData').once("value", function (snapshot){ //records that this user made a review of this teacher
    var reviewList = snapshot.val();
    var refList = [];
    for (var key in reviewList) {
      if (reviewList.hasOwnProperty(key)) {
        var val = reviewList[key];
        var myRe = /[^/]*$/g;
        var tempString = myRe.exec(val)[0];
        val = val.replace(tempString,"");
        refList.push(val);
      }
    }
    console.log(refList);
    var myRe = /[^/]*$/g;
    console.log(myRe.exec(pathString)[0]);

    if(refList.includes(myRe.exec(pathString)[0])){
      canWrite = false;
      console.log("set canwrite to false.");
    }
    if(canWrite){
      admin.database().ref('/users/'+uid+'/privateData').push(pathString);
    }
  }).then(() =>{
    if(canWrite){
      var lastFiveref=admin.database().ref("/lastFive");
      var numberReviews=0;
      var mintime;
      lastFiveref.once("value", function(snapshot) {
          numberReviews = snapshot.numChildren();
      }).then(() =>{
        var pathList=[];
        var lastFiveList=[];
        if(numberReviews<5){
          admin.database().ref('/lastFive').push(pathString);
        }else{
          var db = admin.database();
          var ref = db.ref("/lastFive");
          ref.once("value", function(snapshot) {
            obj=snapshot.val();
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                var val = obj[key];
                lastFiveList.push(key);
                pathList.push(val);
              }
            }
          }).then(() => {
            if(canWrite){
              var timeStampList=[];
              const pr1=admin.database().ref(pathList[0]).once('value'); //TODO make this more efficient, loop it.
              const pr2=admin.database().ref(pathList[1]).once('value');
              const pr3=admin.database().ref(pathList[2]).once('value');
              const pr4=admin.database().ref(pathList[3]).once('value');
              const pr5=admin.database().ref(pathList[4]).once('value');
              const all_pr=Promise.all([pr1,pr2,pr3,pr4,pr5]).then(results => {
                const e1=results[0].child("timestamp").val();
                const e2=results[1].child("timestamp").val();
                const e3=results[2].child("timestamp").val();
                const e4=results[3].child("timestamp").val();
                const e5=results[4].child("timestamp").val();
                timeStampList=[e1,e2,e3,e4,e5];
                var mintime=6520883614318; //a big date so we can find the least date number
                var minPath;
                for(i=0; i<timeStampList.length; i++){
                  if(timeStampList[i]<mintime){
                    mintime=timeStampList[i];
                    minPath=pathList[i];
                    lastFivekey=lastFiveList[i];
                  }
                }
                // console.log("final mintime "+mintime);
                // console.log("minstring "+minPath);
                // console.log("the key is "+lastFivekey);
                // console.log("pathstring is "+pathString);
                console.log("delete oldest review");
                admin.database().ref('/lastFive').child(lastFivekey).remove();
                admin.database().ref('/lastFive').push(pathString);
              }); //gets timestamps from the pathlist that we already have so that we can find the minimum timestamp
            }
          });
        }
      });
    }
    if(canWrite){
      console.log("good");
      const promise = (event.data.ref).child("timestamp").set(admin.database.ServerValue.TIMESTAMP);
      admin.database().ref("/teachers/"+teacherName).child("ratings").push(pathString); //TODO find the double write
      return promise;
    }else{
      console.log("bad");
      const promise = admin.database().ref(pathString).remove();
      return promise;
    }
  });
});
