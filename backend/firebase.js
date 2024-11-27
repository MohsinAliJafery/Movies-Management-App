require('dotenv').config(); // Load environment variables from .env file
const admin = require('firebase-admin');

// Parse the service account key from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase with credentials from the environment
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Use the parsed JSON directly
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Use the storage bucket from the environment variable
});

const bucket = admin.storage().bucket();
module.exports = bucket;
