import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Util from "./util.js";

export function addEventListeners() {
  Element.menuSmartBCH.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.SBCH);
    smartBCH_page();
  });
}

let cards;

export async function smartBCH_page() {
  let html = "TESTING (in a new branch)!!!";

  Element.content.innerHTML = html;
  Util.scrollToTop();
  Util.showTwitterFeeds();
}
