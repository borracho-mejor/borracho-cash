// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// CoinGecko API
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
const serviceAccount = require("./account_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const Constant = require("./constant.js");
const Secrets = require("./secrets.js");
const algoliasearch = require("algoliasearch");

exports.admin_getProjectByID = functions.https.onCall(getProjectByID);
exports.admin_updateSBCHProject = functions.https.onCall(updateSBCHProject);
exports.admin_deleteSBCHProject = functions.https.onCall(deleteSBCHProject);
exports.admin_getCardByID = functions.https.onCall(getCardByID);
exports.admin_updateCard = functions.https.onCall(updateCard);
exports.admin_deleteCard = functions.https.onCall(deleteCard);
exports.admin_getProjectSearch = functions.https.onCall(getProjectSearch);
exports.cloud_getBCHPrice = functions.https.onCall(getBCHPrice);

function isAdmin(email) {
  return Constant.adminEmails.includes(email);
}

async function getProjectByID(docID, context) {
  try {
    const doc = await admin
      .firestore()
      .collection(Constant.collectionName.PROJECTS)
      .doc(docID)
      .get();
    if (doc.exists) {
      const {
        name,
        description,
        audit,
        bias,
        dyor,
        upcoming,
        helpful_links,
        logo_path,
        socials,
        type,
        my_thoughts,
        quoted_description,
        timestamp,
        site,
        special_warning,
        imageName,
        imageURL,
      } = doc.data();
      const p = {
        name,
        description,
        audit,
        bias,
        dyor,
        upcoming,
        helpful_links,
        logo_path,
        socials,
        type,
        my_thoughts,
        quoted_description,
        timestamp,
        site,
        special_warning,
        imageName,
        imageURL,
      };
      p.docID = doc.id;
      return p;
    } else {
      return null;
    }
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred in getProjectByID."
    );
  }
}

async function updateSBCHProject(projectInfo, context) {
  if (!isAdmin(context.auth.token.email)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only admin users can invoke this function."
    );
  }
  try {
    await admin
      .firestore()
      .collection(Constant.collectionName.PROJECTS)
      .doc(projectInfo.docID)
      .update(projectInfo.data);
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred in updateProject."
    );
  }
}

async function deleteSBCHProject(docID, context) {
  if (!isAdmin(context.auth.token.email)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only admin users can invoke this function."
    );
  }
  try {
    await admin
      .firestore()
      .collection(Constant.collectionName.PROJECTS)
      .doc(docID)
      .delete();
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred in deleteProduct."
    );
  }
}

async function getCardByID(docID, context) {
  if (!isAdmin(context.auth.token.email)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only admin users can invoke this function."
    );
  }
  try {
    const doc = await admin
      .firestore()
      .collection(Constant.collectionName.CARDS)
      .doc(docID)
      .get();
    if (doc.exists) {
      const { body, header, isPinned, timestamp } = doc.data();
      const c = {
        body,
        header,
        isPinned,
        timestamp,
      };
      c.docID = doc.id;
      return c;
    } else {
      return null;
    }
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred in getCardByID."
    );
  }
}

async function updateCard(cardInfo, context) {
  if (!isAdmin(context.auth.token.email)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only admin users can invoke this function."
    );
  }
  try {
    await admin
      .firestore()
      .collection(Constant.collectionName.CARDS)
      .doc(cardInfo.docID)
      .update(cardInfo.data);
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred in updateCard."
    );
  }
}

async function deleteCard(docID, context) {
  if (!isAdmin(context.auth.token.email)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only admin users can invoke this function."
    );
  }
  try {
    await admin
      .firestore()
      .collection(Constant.collectionName.CARDS)
      .doc(docID)
      .delete();
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred in deleteCard."
    );
  }
}

async function getProjectSearch(keywords) {
  let searchIDs = [];
  const searchClient = algoliasearch(
    Constant.algoliaAPI.appId,
    Constant.algoliaAPI.apiKey
  );
  const index = searchClient.initIndex(Constant.algoliaIndexes.PROJECTS);

  await index.search(keywords).then(({ hits }) => {
    hits.forEach((hit) => {
      searchIDs.push(hit.name); // objectID
    });
  });
  return searchIDs;
}

async function getBCHPrice() {
  let data = await CoinGeckoClient.simple.price({
    ids: "bitcoin-cash",
    vs_currencies: "usd",
  });

  let object = await getBCHInfo();
  object["price"] = data.data["bitcoin-cash"].usd;

  return object;
}

async function getBCHInfo() {
  let data = await CoinGeckoClient.coins.fetch("bitcoin-cash");
  let object = {};
  object["marketcapRank"] = data.data.market_cap_rank;
  object["twentyFourHourChange"] =
    data.data.market_data.price_change_percentage_24h;
  object["sevenDayChange"] = data.data.market_data.price_change_percentage_7d;
  object["thirtyDayChange"] = data.data.market_data.price_change_percentage_30d;
  object["priceInBTC"] = data.data.market_data.current_price.btc;
  object["changeInBTCPrice24h"] =
    data.data.market_data.price_change_percentage_24h_in_currency.btc;
  return object;
}
