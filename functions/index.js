const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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

// Load the showdown library (reading and displaying markdown files)
const showdown = require("showdown");

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
exports.cloud_getAcceptingBCHMarkdown = functions.https.onCall(
  getAcceptingBCHMarkdown
);

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
        chain,
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
        chain,
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
  // Get dominance
  object["marketCap"] = data.data.market_data.market_cap.usd;
  let market_data = await CoinGeckoClient.global();
  object["totalMarketCap"] = market_data.data.data.total_market_cap.usd;
  object["dominance"] = object["marketCap"] / object["totalMarketCap"];
  return object;
}

async function getAcceptingBCHMarkdown() {
  return (async () => {
    const response = await fetch(
      "https://api.github.com/repos/BitcoinCash1/Projects-BCH-Donations/contents/README.md",
      {
        headers: {
          Authorization: `${Secrets.gitHubAPI.apiKey}`,
        },
      }
    );
    const data = await response.json();
    // The contents of the markdown file are stored in the "content" property of the response
    //  Need to convert from base64 to utf-8
    const markdown = Buffer.from(data.content, "base64").toString("utf8");
    const converter = new showdown.Converter();
    const html = converter
      .makeHtml(markdown)
      .replace(/<a(.+?)>/g, '<a target="_blank"$1>'); // add target="_blank" to each link
    return html;
  })();
}

function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // do nothing
  }
}
