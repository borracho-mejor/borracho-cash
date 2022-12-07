import { SBCHUpdate } from "../model/sBCHUpdate.js";
import * as Element from "../viewpage/element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "../viewpage/util.js";
import { login_page } from "../viewpage/login_page.js";

export function addEventListeners() {
  Element.formRequestUpdateSBCHProject.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button =
      Element.formRequestUpdateSBCHProject.getElementsByTagName("button")[0];
    const origLabel = Util.disableButton(button);
    await requestUpdateSBCHProject(e);
    Util.enableButton(button, origLabel);
  });
}

async function requestUpdateSBCHProject(e) {
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

  const request = new SBCHUpdate({
    name,
    update,
    contact,
  });

  const errors = request.validate();
  if (errors) {
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
    await FirebaseController.requestUpdatesBCHProject(request.serialize());
    login_page();
    Util.popUpInfo(
      "Success!",
      `We will review requested changes to ${request.name}!`,
      "modal-form-request-update-sBCH-project"
    );
    e.target.reset();
  } catch (error) {
    Util.popUpInfo(
      "Failed to Request Project Update!",
      JSON.stringify(error),
      "modal-form-request-update-sBCH-project"
    );
  }
}
