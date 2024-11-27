// firebase.js
require('dotenv').config(); // Load environment variables from .env file
const admin = require('firebase-admin');
const path = require('path');

// Get the service account key path from environment variable
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

// Initialize Firebase with credentials from the environment
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)), // Read the key file from the path
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Use the storage bucket from the environment variable
});

const bucket = admin.storage().bucket();
module.exports = bucket;
