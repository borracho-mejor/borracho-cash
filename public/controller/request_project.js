import { Request } from "../model/Request.js";
import * as Element from "../viewpage/element.js";
import * as FirebaseController from "./firebase_controller.js";
import * as Util from "../viewpage/util.js";
import { login_page } from "../viewpage/login_page.js";

export function addEventListeners() {
  Element.formRequestProject.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = Element.formRequestProject.getElementsByTagName("button")[0];
    const origLabel = Util.disableButton(button);
    await requestProject(e);
    Util.enableButton(button, origLabel);
  });
}

async function requestProject(e) {
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
  const chain = e.target.chain.value;

  // Clear error tags before validating again
  const errorTags = document.getElementsByClassName("error-request-project");
  for (let i = 0; i < errorTags.length; i++) {
    errorTags[i].innerHTML = "";
  }

  const request = new Request({
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
    chain,
  });

  try {
    await FirebaseController.requestProject(request.serialize());
    login_page();
    Util.popUpInfo(
      "Success!",
      `${request.name} has been requested!`,
      "modal-form-request-project"
    );
    e.target.reset();
  } catch (error) {
    Util.popUpInfo(
      "Failed to Request Project!",
      JSON.stringify(error),
      "modal-form-request-project"
    );
  }
}
