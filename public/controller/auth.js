import * as Element from "../viewpage/element.js";
import * as FirebaseController from "./firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Routes from "../controller/routes.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

export let currentUser = null;

const auth = getAuth();

export function addEventListeners() {
  Element.formSignIn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      $("#modal-form-sign-in").modal("hide");
    } catch (error) {
      if (Constant.DEV) {
        console.log(error);
      }
      //   Util.popUpInfo(
      //     "Sign-in Error",
      //     JSON.stringify(error),
      //     "modal-form-sign-in"
      //   );
    }
  });

  onAuthStateChanged(auth, authStateChangeObserver);
}

export function addSignOutEventListener() {
  document
    .getElementById("button-sign-out")
    .addEventListener("click", async () => {
      // sign out from Firebase
      try {
        await signOut(auth);
      } catch (e) {
        if (Constant.DEV) {
          console.log(e);
        }
      }
    });
}

export function authStateChangeObserver(user) {
  if (user) {
    // signed in
    currentUser = user;

    let elements = document.getElementsByClassName("modal-pre-auth");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    elements = document.getElementsByClassName("modal-post-auth");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    }
  } else {
    // signed out
    currentUser = null;

    let elements = document.getElementsByClassName("modal-pre-auth");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    }
    elements = document.getElementsByClassName("modal-post-auth");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
  }
}
