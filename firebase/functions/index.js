// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.testAPI = functions.https.onRequest((request, response) => {
 response.send("API online!");
});



exports.registerEntry = functions.https.onCall((data, context) => {
  // return {
  //     repeat_message: data.message,
  //     repeat_count: data.count + 1,
  // }

  const db = admin.firestore();

  const uid = context.auth.uid

  var d = new Date();

  var doc = {
    tsin: d,
    tsout: null,
    room: data.room,
    uid: uid
  };

  return db.collection('data').add(doc).then(
    writeResult => {
      //return writeResult;
      return {result: "ok"};
    // res.send(writeResult);
    });


});







exports.registerLeave = functions.https.onCall((data, context) => {
    //Parameters: uid, room

    const db = admin.firestore();

    var d = new Date();

    const uid = context.auth.uid;

    return db.collection("data").where('uid', '==', uid).where('tsout', '==', null).where('room', '==', data.room)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                //update data
                db.doc("data/" + doc.id).update({tsout: d}).then(result => {return {result: "ok"}});

                //return {result: "ok"};
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

});







