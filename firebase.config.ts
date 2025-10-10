import admin from "firebase-admin";

// Initialize Firebase Admin
const serviceAccount = require("./firebase-admin-key.json");

// Initialize the app with a service account, granting admin privileges
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default db;
