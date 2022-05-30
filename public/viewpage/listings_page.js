import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";

export function addEventListeners() {
  Element.menuListings.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.LISTINGS);
    listings_page();
  });
}

export async function listings_page() {
  Util.scrollToTop();
  Util.hideTwitterFeeds();
  Util.hideHeader();
  Util.unActivateLinks();
  Element.menuListings.classList.add("active");

  let html = `
                <button class="btn btn-success button-center" data-toggle="modal" data-target="#modal-form-request-sBCH-project" style="margin: 0 auto; display: block;">
                    Request sBCH Listing
                </button>
                `;

  Element.content.innerHTML = html;

  if (Auth.currentUser) {
    Auth.authStateChangeObserver(Auth.currentUser);
  }
}
