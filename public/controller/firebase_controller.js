import { Card } from "../model/card.js";
import { SBCHProject } from "../model/sBCHProject.js";
import { Donation } from "../model/donation.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-functions.js";
import {
  getStorage,
  ref,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";

const db = getFirestore();
const functions = getFunctions();
const storage = getStorage();

// setup for emulator
const hostname = window.location.hostname;
if (hostname == "localhost" || hostname == "127.0.0.1") {
  connectFunctionsEmulator(functions, hostname, 5001);
}

export async function getHomeCardList() {
  let cards = [];
  const q = query(
    collection(db, Constant.collectionName.CARDS),
    orderBy("isPinned", "desc"),
    orderBy("timestamp", "desc")
  );
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const card = new Card(doc.data());
    card.docID = doc.id;
    cards.push(card);
  });
  return cards;
}

export async function getSBCHProjectList() {
  let projects = [];
  const q = query(
    collection(db, Constant.collectionName.SBCH_PROJECTS),
    where("status", "in", ["active"]),
    orderBy("bias", "asc"),
    orderBy("sort_name", "asc")
  );
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const project = new SBCHProject(doc.data());
    project.docID = doc.id;
    projects.push(project);
  });
  return projects;
}

export async function getSpendingList() {
  let spendings = [];
  const q = query(
    collection(db, Constant.collectionName.DONATIONS),
    where("type", "in", ["spending"]),
    orderBy("timestamp", "asc")
  );
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const spending = new Donation(doc.data());
    spending.docID = doc.id;
    spendings.push(spending);
  });
  return spendings;
}

export async function getDonationsList() {
  let donations = [];
  const q = query(
    collection(db, Constant.collectionName.DONATIONS),
    where("type", "in", ["donation"]),
    orderBy("timestamp", "asc")
  );
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const donation = new Donation(doc.data());
    donation.docID = doc.id;
    donations.push(donation);
  });
  return donations;
}

export async function addDonation(donation) {
  donation.timestamp = Timestamp.fromDate(new Date());
  const docRef = await addDoc(
    collection(db, Constant.collectionName.DONATIONS),
    donation
  );
}

const cf_getSBCHProjectSearch = httpsCallable(
  functions,
  "admin_getSBCHProjectSearch"
);
export async function getSBCHProjectSearch(keywords) {
  Util.popUpLoading("Searching...", "Slowly...");
  let projects = [];
  let result = await cf_getSBCHProjectSearch(keywords);
  result = result.data;

  for (const element of result) {
    const q = await query(
      collection(db, Constant.collectionName.SBCH_PROJECTS),
      where("status", "in", ["active"]),
      where("name", "==", element)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const project = new SBCHProject(doc.data());
      project.docID = doc.id;
      projects.push(project);
    });
  }
  projects.sort(function (a, b) {
    if (a.bias === b.bias) {
      // Name is only important when biases are the same
      return b.name - a.name;
    }
    return a.bias > b.bias ? 1 : -1;
  });

  setTimeout(function () {
    $("#loadingoverlay").modal("hide");
  }, 500);
  return projects;
}

export async function getTypeList(projects) {
  let types = [];
  projects.forEach((project) => {
    if (project.type.length > 0) {
      project.type.forEach((type) => {
        if (types.indexOf(type) === -1) {
          types.push(type);
        }
      });
    }
  });
  return types;
}

export async function getSocialsList(projects) {
  let socials = [];
  projects.forEach((project) => {
    let keyArray = Object.keys(project.socials);
    if (keyArray) {
      keyArray.forEach((key) => {
        if (socials.indexOf(key) === -1) {
          socials.push(key);
        }
      });
    }
  });
  return socials;
}

export async function addsBCHProject(project) {
  project.timestamp = Timestamp.fromDate(new Date());
  const docRef = await addDoc(
    collection(db, Constant.collectionName.SBCH_PROJECTS),
    project
  );
}

export async function requestsBCHProject(request) {
  request.timestamp = Timestamp.fromDate(new Date());
  request.to = ["brandon@borracho.cash"];
  request.message = {
    subject: `New sBCH Project Listing Request - ${request.name}`,
    html: `<p>Name: ${request.name}</p>
            <p>Contact: ${request.contact}</p>
            <p>Site: ${request.site}</p>
            <p>Description: ${request.description}</p>
            <p>Quoted Description: ${request.quoted_description}</p>
            <p>Type: ${request.type}</p>
            <p>Audit: ${request.audit}</p>
            <p>Socials: ${request.socials}</p>
            <p>Helpful Links: ${request.helpful_links}</p>
            <p>Logo: ${request.logo_link}</p>
            <p>Requested: ${request.timestamp}</p>`,
  };
  const docRef = await addDoc(
    collection(db, Constant.collectionName.LISTING_REQUEST),
    request
  );
}

export async function requestUpdatesBCHProject(request) {
  request.timestamp = Timestamp.fromDate(new Date());
  request.to = ["brandon@borracho.cash"];
  request.message = {
    subject: `New sBCH Project Update Request - ${request.name}`,
    html: `<p>Name: ${request.name}</p>
    <p>Update: ${request.update}</p>
    <p>Contact: ${request.contact}</p>`,
  };
  const docRef = await addDoc(
    collection(db, Constant.collectionName.LISTING_REQUEST),
    request
  );
}

export async function submitBugReport(report) {
  report.timestamp = Timestamp.fromDate(new Date());
  report.to = ["brandon@borracho.cash"];
  report.message = {
    subject: `New Bug Report - ${report.timestamp.seconds}`,
    html: `<p>Text: ${report.text}</p>
    <p>Contact: ${report.contact}</p>`,
  };
  const docRef = await addDoc(
    collection(db, Constant.collectionName.LISTING_REQUEST),
    report
  );
}

export async function addCard(card) {
  card.timestamp = Timestamp.fromDate(new Date());
  const docRef = await addDoc(
    collection(db, Constant.collectionName.CARDS),
    card
  );
}

export async function uploadImage(imageFile, imageName) {
  if (!imageName) {
    imageName = Date.now() + imageFile.name;
  }
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName);
  const taskSnapShot = await ref.put(imageFile);
  const imageURL = await taskSnapShot.ref.getDownloadURL();
  return { imageName, imageURL };
}

const cf_getProjectByID = httpsCallable(functions, "admin_getProjectByID");
export async function getProjectByID(docID) {
  const result = await cf_getProjectByID(docID);
  if (result.data) {
    const project = new SBCHProject(result.data);
    project.docID = result.data.docID;
    return project;
  } else {
    return null;
  }
}

export async function getProjectByName(name) {
  let project;
  const q = query(
    collection(db, Constant.collectionName.SBCH_PROJECTS),
    where("sort_name", "==", name)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    project = new SBCHProject(doc.data());
    project.docID = doc.id;
  });
  return project;
}

const cf_updateSBCHProject = httpsCallable(
  functions,
  "admin_updateSBCHProject"
);
export async function updateSBCHProject(project) {
  const docID = project.docID;
  const data = project.serializeForUpdate();
  await cf_updateSBCHProject({ docID, data });
}

const cf_deleteSBCHProject = httpsCallable(
  functions,
  "admin_deleteSBCHProject"
);
export async function deleteProject(docID, logo_path) {
  await cf_deleteSBCHProject(docID);
  const reference = ref(storage, logo_path);
  await deleteObject(reference);
}

const cf_getCardByID = httpsCallable(functions, "admin_getCardByID");
export async function getCardByID(docID) {
  const result = await cf_getCardByID(docID);
  if (result.data) {
    const card = new Card(result.data);
    card.docID = result.data.docID;
    return card;
  } else {
    return null;
  }
}

const cf_updateCard = httpsCallable(functions, "admin_updateCard");
export async function updateCard(card) {
  const docID = card.docID;
  const data = card.serializeForUpdate();
  await cf_updateCard({ docID, data });
}

const cf_deleteCard = httpsCallable(functions, "admin_deleteCard");
export async function deleteCard(docID) {
  await cf_deleteCard(docID);
}

const cf_getBCHPrice = httpsCallable(functions, "cloud_getBCHPrice");
export async function getBCHPrice() {
  const result = await cf_getBCHPrice();
  return result.data;
}
