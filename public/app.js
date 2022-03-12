import * as Routes from "./controller/routes.js";
import * as LightMode from "./controller/lightmode.js";

window.onload = () => {
  const pathname = window.location.pathname;
  const href = window.location.href;
  Routes.routing(pathname, href);
  console.log(pathname);
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
import * as AboutPage from "./viewpage/about_page.js";
import * as WhitepaperPage from "./viewpage/whitepaper_page.js";

HomePage.addEventListeners();
AboutPage.addEventListeners();
WhitepaperPage.addEventListeners();
