import { Card } from "../model/card.js";
import * as Element from "../viewpage/element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "../viewpage/util.js";

export function addEventListeners() {
  Element.formAddCard.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = Element.formAddCard.getElementsByTagName("button")[0];
    const origLabel = Util.disableButton(button);
    await addNewCard(e);
    Util.enableButton(button, origLabel);
  });
}

async function addNewCard(e) {
  const header = e.target.header.value;
  const body = e.target.body.value;
  const isPinned = e.target.isPinned.checked;
  const timestamp = Date.now();

  // Clear error tags before validating again
  const errorTags = document.getElementsByClassName("error-add-card");
  for (let i = 0; i < errorTags.length; i++) {
    errorTags[i].innerHTML = "";
  }

  const card = new Card({
    header,
    body,
    isPinned,
    timestamp,
  });
  // Check
  const errors = card.validate();
  if (errors) {
    if (errors.header) {
      Element.formAddCardError.header.innerHTML = errors.header;
    }
    if (errors.body) {
      Element.formAddCardError.body.innerHTML = errors.body;
    }
    if (errors.isPinned) {
      Element.formAddCardError.isPinned.innerHTML = errors.isPinned;
    }
    return;
  }

  try {
    await FirebaseController.addCard(card.serialize());
    Util.popUpInfo("Success!", `${card.header} added!`, "modal-form-add-card");
    e.target.reset();
  } catch (error) {
    Util.popUpInfo(
      "Failed to Add Card!",
      JSON.stringify(error),
      "modal-add-card"
    );
  }
}
