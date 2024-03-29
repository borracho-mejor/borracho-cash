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
  $("#modal-pop-up-info").modal("hide");
  Util.popUpLoading("Loading...", "");

  let html = "";

  try {
    html = await FirebaseController.getAcceptingBCHMarkdown();
  } catch (error) {
    Util.popUpInfo("Error in getAcceptingBCHMarkdown", JSON.stringify(error));
    return;
  }

  html += `<div class="alert alert-success" role="alert">This content is dynamically displayed from the <a class="alert-link" href="https://github.com/BitcoinCash1/Projects-BCH-Donations" target="_blank">BitcoinCash1/Projects-BCH-Donations</a> Github repo. Please consider submitting a pull request if you know of additional projects accepting Bitcoin Cash (BCH) donations, or let one of the contributors know and we'd be happy to do so on your behalf. Let's help each other help each other.</div>`;

  html += Element.floatingButtonHTML;

  Element.content.innerHTML = html;
  Util.scrollToTop();
  Util.hideHeader();
  Util.unActivateLinks();
  Element.menuNavbarDropdown.classList.add("active");
  Element.menuAcceptingBCH.classList.add("active");

  // When the user scrolls, show the button
  Element.content.onscroll = function () {
    scrollFunction();
  };
  Element.contentSidebar.onscroll = function () {
    scrollFunction();
  };
  Element.mainContent.onscroll = function () {
    scrollFunction();
  };
  document.body.addEventListener("scroll", function () {
    scrollFunction();
  });
  function scrollFunction() {
    if (
      Element.content.scrollTop > 20 ||
      Element.contentSidebar.scrollTop > 20 ||
      Element.mainContent.scrollTop > 20 ||
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById("floating-button").style.display = "table";
      document.getElementById("floating-button-span").style.display =
        "table-cell";
    } else {
      document.getElementById("floating-button").style.display = "none";
      document.getElementById("floating-button-span").style.display = "none";
    }
  }
  document.getElementById("floating-button").addEventListener("click", () => {
    Util.scrollToTop();
  });

  setTimeout(function () {
    $("#loadingoverlay").modal("hide");
  }, 500);
}
