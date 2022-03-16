import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import * as Auth from "../controller/auth.js";

export function addEventListeners() {
  //
}

export async function login_page() {
  Util.scrollToTop();
  Util.hideTwitterFeeds();
  Util.hideHeader();

  let html = `<div style="height: 100%;">
                <button class="btn btn-success modal-pre-auth" data-toggle="modal" data-target="#modal-form-sign-in">
                    Sign-in
                </button>
                <button class="btn btn-success modal-post-auth" style="margin-bottom: 10px;" data-toggle="modal" data-target="#modal-form-add-sBCH-project">
                    Add sBCH Project
                </button>
                <button id="button-sign-out" class="btn btn-danger modal-post-auth" data-toggle="modal" data-target="#modal-form-add-sBCH-project">
                    Sign out
                </button>
            </div>
                `;

  Element.content.innerHTML = html;
  Auth.addSignOutEventListener();
}
