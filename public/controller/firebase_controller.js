import { Card } from "../model/card.js";
import { SBCHProject } from "../model/sBCHProject.js";
import * as Constant from "../model/constant.js";
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

const db = getFirestore();
const functions = getFunctions();

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
    if (doc.data().page == "home") {
      const card = new Card(doc.data());
      card.docID = doc.id;
      cards.push(card);
    }
  });
  return cards;
}

export async function getSBCHProjectList() {
  let projects = [];
  const q = query(
    collection(db, Constant.collectionName.SBCH_PROJECTS),
    orderBy("bias", "asc"),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const project = new SBCHProject(doc.data());
    project.docID = doc.id;
    projects.push(project);
  });
  return projects;
}

export async function getSBCHProjectSearch(keywords) {
  let projects = [];
  const nameContains = query(
    collection(db, Constant.collectionName.SBCH_PROJECTS),
    where("name", "in", keywords)
  );
  const nameSnapshot = await getDocs(nameContains);
  const typeContains = query(
    collection(db, Constant.collectionName.SBCH_PROJECTS),
    where("type", "array-contains-any", keywords)
  );
  const typeSnapshot = await getDocs(typeContains);
  const [nameQuerySnapshot, typeQuerySnapshot] = await Promise.all([
    nameSnapshot,
    typeSnapshot,
  ]);
  nameQuerySnapshot.forEach((doc) => {
    const project = new SBCHProject(doc.data());
    project.docID = doc.id;
    projects.push(project);
  });
  typeQuerySnapshot.forEach((doc) => {
    const project = new SBCHProject(doc.data());
    project.docID = doc.id;
    projects.push(project);
  });
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

export async function getAboutCardList() {
  let cards = [];
  const q = query(
    collection(db, Constant.collectionName.CARDS),
    orderBy("isPinned", "desc"),
    orderBy("timestamp", "desc")
  );
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    if (doc.data().page == "about") {
      const card = new Card(doc.data());
      card.docID = doc.id;
      cards.push(card);
    }
  });
  return cards;
}

export async function addsBCHProject(project) {
  project.timestamp = Timestamp.fromDate(new Date());
  const docRef = await addDoc(
    collection(db, Constant.collectionName.SBCH_PROJECTS),
    project
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
  console.log("now here");
  const result = await cf_getProjectByID(docID);
  if (result.data) {
    const project = new SBCHProject(result.data);
    project.docID = result.data.docID;
    return project;
  } else {
    return null;
  }
}
