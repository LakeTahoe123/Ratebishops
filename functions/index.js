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
  pathString="";
  for(i=0; i<pathArray.length; i++){
    pathString=pathString+"/"+pathArray[i] //PathString is the path of this review
  }

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
        var timeStampList=[];
        const pr1=admin.database().ref(pathList[0]).once('value');
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

      });
    }
  });

  const promise = (event.data.ref).child("timestamp").set(admin.database.ServerValue.TIMESTAMP); //TODO might have to make it admin database ref
  return promise;

});

function getTimeStampList(pathList){
  var timeList=[];
  const pr1=admin.database().ref(pathList[1]).once('value');
  const pr2=admin.database().ref(pathList[2]).once('value');
  const pr3=admin.database().ref(pathList[3]).once('value');
  const pr4=admin.database().ref(pathList[4]).once('value');
  const pr5=admin.database().ref(pathList[5]).once('value');
  //console.log(pathList);
  const all_pr=Promise.all([pr1,pr2,pr3,pr4,pr5]).then(results => {
    const e1=results[0].child("timestamp").val();
    const e2=results[1].child("timestamp").val();
    const e3=results[2].child("timestamp").val();
    const e4=results[3].child("timestamp").val();
    const e5=results[4].child("timestamp").val();
    //console.log("e5 "+e5);

    timeList=[e1,e2,e3,e4,e5];
    //console.log("returning timelist: "+timeList);
    return timeList;
  });


}
