import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";

export function addEventListeners() {
  Element.menuHome.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.HOME);
    home_page();
  });
}

let cards;

export async function home_page() {
  Util.scrollToTop();
  Util.showTwitterFeeds();
  Util.hideHeader();

  let html = "";

  try {
    cards = await FirebaseController.getHomeCardList();

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
      // Util.popUpInfo("Error in getHomeCardList", JSON.stringify(error));
      return;
    }
  }

  Element.content.innerHTML = html;

  if (Auth.currentUser) {
    Auth.authStateChangeObserver(Auth.currentUser);
  }
}

function buildCard(card, index) {
  let pinnedTag = "";
  if (card.isPinned) {
    pinnedTag = `<img class="dark-mode" src="./images/pin_light.png" alt="Pinned" style="height: 1em; padding-right: 5px"/>
                  <img class="light-mode" src="./images/pin.png" alt="Pinned" style="height: 1em; padding-right: 5px"/>`;
  }
  return `
          <div class="card mb-3 mr-1">
          <div class="card-header">
            <h5 class="inline">${pinnedTag}${card.header}</h5>
            <h6 class="inline float-right text-muted">Posted: ${new Date(
              card.timestamp.toDate()
            ).toDateString()}</h6>
            <form class="form-delete-product inline float-right modal-post-auth" method="post">
            <input type="hidden" name="docID" value="${card.docID}">
            <button class="btn btn-outline-danger" style="margin-right: 5px;" type="submit">Delete</button>
          </form>
          <form class="form-edit-product inline float-right modal-post-auth" method="post">
            <input type="hidden" name="docID" value="${card.docID}">
            <button class="btn btn-outline-success" style="margin-right: 5px;" type="submit">Edit</button>
          </form>
        </div>
            <div class="card-body">${card.body}</div>
          </div>`;
}
