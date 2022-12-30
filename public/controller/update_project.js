import { Update } from "../model/Update.js";
import * as Element from "../viewpage/element.js";
import * as FirebaseController from "./firebase_controller.js";
import * as Util from "../viewpage/util.js";
import { login_page } from "../viewpage/login_page.js";

export function addEventListeners() {
  Element.formRequestUpdateSBCHProject.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button =
      Element.formRequestUpdateSBCHProject.getElementsByTagName("button")[0];
    const origLabel = Util.disableButton(button);
    await requestUpdateProject(e);
    Util.enableButton(button, origLabel);
  });
}

async function requestUpdateProject(e) {
  const chain = e.target.chain.value;
  const name = e.target.name.value;
  const update = e.target.update.value;
  const contact = e.target.contact.value;

  // Clear error tags before validating again
  const errorTags = document.getElementsByClassName(
    "error-request-update-project"
  );
  for (const element of errorTags) {
    element.innerHTML = "";
  }

  const request = new Update({
    chain,
    name,
    update,
    contact,
  });

  const errors = request.validate();
  if (errors) {
    if (errors.chain) {
      Element.formUpdateProjectError.chain.innerHTML = errors.chain;
    }
    if (errors.name) {
      Element.formUpdateProjectError.name.innerHTML = errors.name;
    }
    if (errors.update) {
      Element.formUpdateProjectError.update.innerHTML = errors.update;
    }
    if (errors.contact) {
      Element.formUpdateProjectError.contact.innerHTML = errors.contact;
    }
    return;
  }

  try {
    await FirebaseController.requestUpdateProject(request.serialize());
    login_page();
    Util.popUpInfo(
      "Success!",
      `We will review requested changes to ${request.name}!`,
      "modal-form-request-update-project"
    );
    e.target.reset();
  } catch (error) {
    Util.popUpInfo(
      "Failed to Request Project Update!",
      JSON.stringify(error),
      "modal-form-request-update-project"
    );
  }
}
