import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";

export function addEventListeners() {
  Element.menuHome.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.HOME);
    home_page();
  });
}

let cards;

export async function home_page() {
  let html = "";

  try {
    cards = await FirebaseController.getHomeCardList();
    let index = 0;
    cards.forEach((card) => {
      html += buildCard(card, index);
      ++index;
    });
  } catch (error) {
    if (Constant.DEV) {
      console.log(error);
      // Util.popUpInfo("Error in getHomeCardList", JSON.stringify(error));
      return;
    }
  }

  Element.content.innerHTML = html;
  Util.scrollToTop();
  Util.showTwitterFeeds();
}

function buildCard(card, index) {
  let pinnedTag = "";
  if (card.isPinned) {
    pinnedTag = `<img class="dark-mode" src="./images/pin_light.png" alt="Pinned" style="height: 1em; padding-right: 5px"/>
                  <img class="light-mode" src="./images/pin.png" alt="Pinned" style="height: 1em; padding-right: 5px"/>`;
  }
  return `
          <div class="card mb-3">
            <h6 class="card-header">${pinnedTag}${card.header}</h6>
            <div class="card-body">${card.body}</div>
          </div>`;
}
