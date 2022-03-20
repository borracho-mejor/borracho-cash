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
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const db = getFirestore();

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

export async function getTypeList() {
  let types = [];
  let projects = await getSBCHProjectList();
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
