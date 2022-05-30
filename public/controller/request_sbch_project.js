import { SBCHRequest } from "../model/sBCHRequest.js";
import * as Element from "../viewpage/element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "../viewpage/util.js";
import { listings_page } from "../viewpage/listings_page.js";

export function addEventListeners() {
  Element.formRequestSBCHProject.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button =
      Element.formRequestSBCHProject.getElementsByTagName("button")[0];
    const origLabel = Util.disableButton(button);
    await requestSBCHProject(e);
    Util.enableButton(button, origLabel);
  });
}

async function requestSBCHProject(e) {
  const name = e.target.name.value;
  const site = e.target.site.value;
  const description = e.target.description.value;
  const quoted_description = e.target.quoteddescription.value;
  const type = e.target.types.value;
  const audit = e.target.audits.value;
  const socials = e.target.socials.value;
  const helpful_links = e.target.helpfullinks.value;
  const logo_link = e.target.linktologo.value;
  const contact = e.target.contact.value;

  // Clear error tags before validating again
  const errorTags = document.getElementsByClassName("error-request-project");
  for (let i = 0; i < errorTags.length; i++) {
    errorTags[i].innerHTML = "";
  }

  const request = new SBCHRequest({
    name,
    site,
    description,
    quoted_description,
    type,
    audit,
    socials,
    helpful_links,
    logo_link,
    contact,
  });

  try {
    await FirebaseController.requestsBCHProject(request.serialize());
    listings_page();
    Util.popUpInfo(
      "Success!",
      `${request.name} has been requested!`,
      "modal-form-request-sBCH-project"
    );
    e.target.reset();
  } catch (error) {
    Util.popUpInfo(
      "Failed to Request Project!",
      JSON.stringify(error),
      "modal-form-request-sBCH-project"
    );
  }
}
