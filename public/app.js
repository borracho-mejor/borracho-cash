import * as Routes from "./controller/routes.js";
import * as LightMode from "./controller/lightmode.js";

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

import * as HomePage from "./viewpage/home_page.js";
import * as LoginPage from "./viewpage/login_page.js";
import * as WhitepaperPage from "./viewpage/whitepaper_page.js";
import * as SBCHPage from "./viewpage/smartBCH_page.js";
import * as Auth from "./controller/auth.js";
import * as AddsBCHProject from "./controller/add_sbch_project.js";
import * as RequestsBCHProject from "./controller/request_sbch_project.js";
import * as AddCard from "./controller/add_card.js";
import * as EditProject from "./controller/edit_project.js";

HomePage.addEventListeners();
LoginPage.addEventListeners();
WhitepaperPage.addEventListeners();
SBCHPage.addEventListeners();
Auth.addEventListeners();
AddsBCHProject.addEventListeners();
RequestsBCHProject.addEventListeners();
AddCard.addEventListeners();
EditProject.addEventListeners();
