// firebase.js
const admin = require('firebase-admin');
const path  = require('path');

const serviceAccount = path.resolve('./movie-app-60d18-firebase-adminsdk-uhcm7-7ecd0962f8.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://mechanic-hub-60d18.appspot.com' // Replace with your Firebase Storage bucket
});

const bucket = admin.storage().bucket();
module.exports = bucket;
