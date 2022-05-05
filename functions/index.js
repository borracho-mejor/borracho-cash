// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
const serviceAccount = require("./account_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const Constant = require("./constant.js");

exports.admin_getProjectByID = functions.https.onCall(getProjectByID);

function isAdmin(email) {
  return Constant.adminEmails.includes(email);
}

async function getProjectByID(docID, context) {
  if (!isAdmin(context.auth.token.email)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only admin users can invoke this function."
    );
  }
  try {
    const doc = await admin
      .firestore()
      .collection(Constant.collectionName.SBCHPROJECTS)
      .doc(docID)
      .get();
    if (doc.exists) {
      const {
        name,
        description,
        audit,
        bias,
        dyor,
        helpful_links,
        logo_path,
        socials,
        type,
        my_thoughts,
        quoted_description,
        timestamp,
        site,
        imageName,
        imageURL,
      } = doc.data();
      const p = {
        name,
        description,
        audit,
        bias,
        dyor,
        helpful_links,
        logo_path,
        socials,
        type,
        my_thoughts,
        quoted_description,
        timestamp,
        site,
        imageName,
        imageURL,
      };
      p.docID = doc.id;
      return p;
    } else {
      return null;
    }
  } catch (error) {
    if (Constant.DEV) {
      console.log(error);
    }
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred in getProjectByID."
    );
  }
}
