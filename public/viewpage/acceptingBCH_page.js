import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import * as Auth from "../controller/auth.js";
import * as Edit from "../controller/edit_project.js";
import { Project } from "../model/Project.js";

export function addEventListeners() {
  Element.menuAcceptingBCH.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.ACCEPTINGBCH);
    acceptingBCH_page();
  });
}

export async function acceptingBCH_page() {
  Util.popUpLoading("Loading...", "");

  setTimeout(function () {
    $("#loadingoverlay").modal("hide");
  }, 500);

  Util.hideTwitterFeeds();
  Util.showHeader();
  Util.unActivateLinks();
  Element.menuNavbarDropdown.classList.add("active");
  Element.menuAcceptingBCH.classList.add("active");
  $("#modal-pop-up-info").modal("hide");

  let html = "Testing";

  Element.mainContent.innerHTML = html;
}
