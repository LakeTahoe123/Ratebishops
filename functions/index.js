// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.addTimestamp = functions.database.ref('/tbs/{department}/{class}/{teacher}/{reviews}').onCreate((event) => {
  console.log(ServerValue.TIMESTAMP);
  const promise = (event.data.ref).child("timestamp").set(ServerValue.TIMESTAMP); //TODO might have to make it admin database ref
  return promise;
});
