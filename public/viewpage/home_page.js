import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";
import * as Edit from "../controller/edit_project.js";

export function addEventListeners() {
  Element.menuHome.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.HOME);
    home_page();
  });
}

export async function home_page() {
  let cards;
  try {
    cards = await FirebaseController.getHomeCardList();
  } catch (error) {
    Util.popUpInfo("Error in getHomeCardList", JSON.stringify(error));
    return;
  }
  build_home_page(cards);
}

export async function build_home_page(cards) {
  Util.scrollToTop();
  Util.showTwitterFeeds();
  Util.hideHeader();
  Util.unActivateLinks();
  Element.menuHome.classList.add("active");

  let html = "";

  if (cards.length == 0) {
    html += `<h4 style="text-align:center;">No cards found!</h4>`;
  }

  let index = 0;
  cards.forEach((card) => {
    html += buildCard(card);
    ++index;
  });

  html += Element.floatingButtonHTML;

  Element.content.innerHTML = html;

  if (Auth.currentUser) {
    Auth.authStateChangeObserver(Auth.currentUser);
  }

  const editButtons = document.getElementsByClassName("form-edit-card");
  for (const element of editButtons) {
    element.addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disableButton(button);
      await Edit.editCard(e.target.docID.value);
      Util.enableButton(button, label);
    });
  }
  const deleteButtons = document.getElementsByClassName("form-delete-card");
  for (const element of deleteButtons) {
    element.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Confirm Deletion
      const r = confirm("Are you sure you want to delete this card?");
      if (!r) {
        return;
      }
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disableButton(button);
      await Edit.deleteCard(e.target.docID.value);
      Util.enableButton(button, label);
    });
  }

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
}

function buildCard(card) {
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
            <form class="form-delete-card inline float-right modal-post-auth" method="post">
            <input type="hidden" name="docID" value="${card.docID}">
            <button class="btn btn-outline-danger" style="margin-right: 5px;" type="submit">Delete</button>
          </form>
          <form class="form-edit-card inline float-right modal-post-auth" method="post">
            <input type="hidden" name="docID" value="${card.docID}">
            <button class="btn btn-outline-success" style="margin-right: 5px;" type="submit">Edit</button>
          </form>
        </div>
            <div class="card-body">${card.body}</div>
          </div>`;
}
