const admin = require("firebase-admin");
// The "./" means "look in this same folder"
const serviceAccount = require("./serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;