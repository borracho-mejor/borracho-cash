import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as LightMode from "../controller/lightmode.js";
import * as Util from "./util.js";

export function addEventListeners() {
  Element.menuAbout.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.ABOUT);
    about_page();
  });
}

let cards;

export async function about_page() {
  Util.scrollToTop();
  Util.showTwitterFeeds();
  Util.hideHeader();

  let html = "";

  try {
    cards = await FirebaseController.getAboutCardList();

    if (cards.length == 0) {
      html += `<h4 style="text-align:center;">No cards found!</h4>`;
    }

    let index = 0;
    cards.forEach((card) => {
      html += buildCard(card, index);
      ++index;
    });
  } catch (error) {
    if (Constant.DEV) {
      console.log(error);
      // Util.popUpInfo("Error in getAboutCardList", JSON.stringify(error));
      return;
    }
  }

  Element.content.innerHTML = html;
}

function buildCard(card, index) {
  let pinnedTag = "";
  if (card.isPinned) {
    if (card.isPinned) {
      pinnedTag = `<img class="dark-mode" src="./images/pin_light.png" alt="Pinned" style="height: 1em; padding-right: 5px"/>
                    <img class="light-mode" src="./images/pin.png" alt="Pinned" style="height: 1em; padding-right: 5px"/>`;
    }
  }
  return `
          <div class="card mb-3 mr-1">
            <h5 class="card-header">${pinnedTag}${card.header}</h5>
            <div class="card-body">${card.body}</div>
          </div>`;
}
