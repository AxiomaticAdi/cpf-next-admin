import admin from "firebase-admin";

// Initialize Firebase Admin
var databaseAdmin = require("firebase-admin");
var serviceAccount = require("./firebase-admin-key.json");

// Initialize the app with a service account, granting admin privileges
databaseAdmin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;
