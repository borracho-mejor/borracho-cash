import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import * as Auth from "../controller/auth.js";

export function addEventListeners() {
  Element.menuLogin.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.LOGIN);
    login_page();
  });
}

export async function login_page() {
  Util.scrollToTop();
  Util.hideTwitterFeeds();
  Util.hideHeader();
  Util.unActivateLinks();
  Element.menuLogin.classList.add("active");

  let html = `<h4 style="text-align:center;">Request listings below!</h4>
              <h5 style="text-align:center;">This will be fleshed out more in the coming weeks so project creators can easily request new listings or updates to existing listings. We can all help each other help each other.</h5>
              <div style="height: 15px;"></div>
              <div class="button-center">
                <button class="btn btn-success button-center" data-toggle="modal" data-target="#modal-form-request-sBCH-project" style="margin: 0 auto; display: block;">
                  Request sBCH Listing
                </button>
                <div style="height: 5px;"></div>
                <button class="btn btn-success modal-pre-auth button-center" data-toggle="modal" data-target="#modal-form-sign-in" style="margin: 0 auto;">
                    Sign-in (Admin Only)
                </button>
                <div class="button-center">
                  <button class="btn btn-success modal-post-auth" style="margin: 0 auto;" data-toggle="modal" data-target="#modal-form-add-card">
                      Add Card
                  </button>
                  <div style="height: 5px;"></div>
                  <button class="btn btn-success modal-post-auth" style="margin: 0 auto;" data-toggle="modal" data-target="#modal-form-add-sBCH-project">
                      Add sBCH Project
                  </button>
                  <div style="height: 5px;"></div>
                  <button class="btn btn-success modal-post-auth" style="margin: 0 auto;" data-toggle="modal" data-target="#modal-form-add-donation">
                      Add Donation/Spending
                  </button>
                  <div style="height: 5px;"></div>
                  <button id="button-sign-out" class="btn btn-danger modal-post-auth" style="margin-bottom: 10px; margin: 0 auto;">
                     Sign out
                  </button>
                </div>
            </div>
                `;

  Element.content.innerHTML = html;
  Auth.addSignOutEventListener();

  if (Auth.currentUser) {
    Auth.authStateChangeObserver(Auth.currentUser);
  }
}
