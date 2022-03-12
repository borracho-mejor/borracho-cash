import { Card } from "../model/card.js";
import * as Constant from "../model/constant.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
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
