// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.addTimestamp = functions.database.ref('/tbs/{department}/{class}/{teacher}/{reviews}').onCreate((event) => {
  pathArray=event.data.ref.path. pieces_;
  console.log(pathArray);
  pathString="";
  for(i=0; i<pathArray.length; i++){
    pathString=pathString+"/"+pathArray[i]
  }
  console.log(pathString);


  const promise = (event.data.ref).child("timestamp").set(admin.database.ServerValue.TIMESTAMP); //TODO might have to make it admin database ref
  return promise;
});
