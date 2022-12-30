import * as Routes from "./controller/routes.js";
import * as LightMode from "./controller/lightmode.js";
import * as FirebaseController from "./controller/firebase_controller.js";
import * as Element from "./viewpage/element.js";
import * as BCHInfo from "./controller/bch_info.js";

window.onload = () => {
  const pathname = window.location.pathname;
  const href = window.location.href;
  Routes.routing(pathname, href);
};

window.addEventListener("popstate", (e) => {
  e.preventDefault();
  const pathname = e.target.location.pathname;
  const href = e.target.location.href;
  Routes.routing(pathname, href);
});

// Enable light mode selection
LightMode.mode();

// Get BCH Info for NavBar
BCHInfo.makeBCHNavbarBox();

import * as HomePage from "./viewpage/home_page.js";
import * as LoginPage from "./viewpage/login_page.js";
import * as WhitepaperPage from "./viewpage/whitepaper_page.js";
import * as SBCHPage from "./viewpage/smartBCH_page.js";
import * as Auth from "./controller/auth.js";
import * as AddsBCHProject from "./controller/add_project.js";
import * as RequestProject from "./controller/request_project.js";
import * as RequestUpdatesBCHProject from "./controller/update_project.js";
import * as SubmitBugReport from "./controller/submit_bug_report.js";
import * as AddCard from "./controller/add_card.js";
import * as AddDonation from "./controller/add_donation.js";
import * as EditProject from "./controller/edit_project.js";
import * as Donations from "./viewpage/donations.js";
import * as CashTokensPage from "./viewpage/cashTokens_page.js";

HomePage.addEventListeners();
LoginPage.addEventListeners();
WhitepaperPage.addEventListeners();
SBCHPage.addEventListeners();
Auth.addEventListeners();
AddsBCHProject.addEventListeners();
RequestProject.addEventListeners();
RequestUpdatesBCHProject.addEventListeners();
SubmitBugReport.addEventListeners();
AddCard.addEventListeners();
AddDonation.addEventListeners();
EditProject.addEventListeners();
Donations.addEventListeners();
CashTokensPage.addEventListeners();
