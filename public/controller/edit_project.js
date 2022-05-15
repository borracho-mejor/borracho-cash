import * as FirebaseController from "./firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";
import * as Element from "../viewpage/element.js";
import { SBCHProject } from "../model/sBCHProject.js";
import { Card } from "../model/card.js";
import * as CloudStorage from "./cloud_storage.js";
import { trimAndParse, trimStrings } from "./add_sbch_project.js";
import { home_page } from "../viewpage/home_page.js";
import { about_page } from "../viewpage/about_page.js";
import { smartBCH_page } from "../viewpage/smartBCH_page.js";

let imageFile2Upload;

export function addEventListeners() {
  Element.formEditImageFileButton.addEventListener("change", (e) => {
    imageFile2Upload = e.target.files[0];
    if (!imageFile2Upload) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => (Element.formEditImageTag.src = reader.result);
    reader.readAsDataURL(imageFile2Upload);
  });
  Element.formEditProject.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = e.target.getElementsByTagName("button")[0];
    const label = Util.disableButton(button);

    const p = new SBCHProject({
      audit: trimAndParse(e.target.audit.value),
      bias: e.target.bias.value,
      description: e.target.description.value,
      search_description: (e.target.description.value + " ")
        .toLowerCase()
        .split(",")
        .join("")
        .split("<b>")
        .join("")
        .split("</b>")
        .join("")
        .split("</a>")
        .join("")
        .split('target="_blank">')
        .join("")
        .split("<a href=")
        .join("")
        .split(". ")
        .join(" ")
        .split('"')
        .join("")
        .split(" "),
      dyor: e.target.dyor.checked,
      helpful_links: trimAndParse(e.target.links.value),
      my_thoughts: e.target.twosats.value,
      search_my_thoughts: (e.target.twosats.value + " ")
        .toLowerCase()
        .split(",")
        .join("")
        .split("<b>")
        .join("")
        .split("</b>")
        .join("")
        .split("</a>")
        .join("")
        .split('target="_blank">')
        .join("")
        .split("<a href=")
        .join("")
        .split(". ")
        .join(" ")
        .split('"')
        .join("")
        .split(" "),
      name: e.target.name.value,
      sort_name: e.target.name.value.toLowerCase(),
      quoted_description: e.target.quoteddescription.value,
      socials: trimAndParse(e.target.socials.value),
      type: e.target.type.value.split(","),
      lower_type: e.target.type.value
        .toLowerCase()
        .split(" ")
        .join(",")
        .split(","),
      site: e.target.site.value,
    });
    let lowercase_audits = [];
    let search_audit_array = Array.from(Object.keys(p.audit));
    search_audit_array.forEach((audit) => {
      lowercase_audits.push(audit.toLowerCase());
    });
    p.search_audit = lowercase_audits;
    p.search_socials = Array.from(Object.keys(p.socials));
    p.docID = e.target.docID.value;

    const errorTags = document.getElementsByClassName("error-edit-project");
    for (const element of errorTags) {
      element.innerHTML = "";
    }
    // Check
    const errors = p.validate(imageFile2Upload);
    if (errors) {
      if (errors.name) {
        Element.formEditProjectError.name.innerHTML = errors.name;
      }
      return;
    }

    try {
      if (imageFile2Upload) {
        const imageInfo = await CloudStorage.uploadImage(
          imageFile2Upload,
          e.target.imageName.value
        );
        p.logo_path = imageInfo.imageURL;
      }
      // Update Firestore
      await FirebaseController.updateSBCHProject(p);

      // smartBCH_page();
      Util.popUpInfo(
        "Project Updated",
        `${p.name} is updated successfully`,
        "modal-form-edit-sBCH-project"
      );
    } catch (error) {
      Util.popUpInfo("Error when updating project.", JSON.stringify(error));
      return;
    }

    Util.enableButton(button, label);
  });
  Element.formEditCard.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = e.target.getElementsByTagName("button")[0];
    const label = Util.disableButton(button);

    const c = new Card({
      body: e.target.body.value,
      header: e.target.header.value,
      page: e.target.page.value,
      isPinned: e.target.isPinned.checked,
    });

    c.docID = e.target.docID.value;

    const errorTags = document.getElementsByClassName("error-edit-card");
    for (const element of errorTags) {
      element.innerHTML = "";
    }

    try {
      // Update Firestore
      await FirebaseController.updateCard(c);

      if (c.page === "home") {
        home_page();
      }
      if (c.page === "about") {
        about_page();
      }
      Util.popUpInfo(
        "Card Updated",
        `${c.header} is updated successfully`,
        "modal-form-edit-card"
      );
    } catch (error) {
      Util.popUpInfo("Error when updating card.", JSON.stringify(error));
      return;
    }

    Util.enableButton(button, label);
  });
}

export async function editProject(docID) {
  let project;
  try {
    project = await FirebaseController.getProjectByID(docID);
    if (!project) {
      Util.popUpInfo(
        "getProjectByID Error",
        `No project found with ID: ${docID}`
      );
      return;
    }
  } catch (error) {
    Util.popUpInfo("Error in getProjectByID", JSON.stringify(error));
    return;
  }

  Element.formEditProject.docID.value = project.docID;
  Element.formEditProject.audit.value = JSON.stringify(project.audit);
  Element.formEditProject.bias.value = project.bias;
  Element.formEditProject.description.value = project.description;
  Element.formEditProject.dyor.checked = project.dyor;
  Element.formEditProject.links.value = JSON.stringify(project.helpful_links);
  Element.formEditProject.twosats.value = project.my_thoughts;
  Element.formEditProject.name.value = project.name;
  Element.formEditProject.quoteddescription.value = project.quoted_description;
  Element.formEditProject.socials.value = JSON.stringify(project.socials);
  Element.formEditProject.type.value = project.type;
  Element.formEditProject.site.value = project.site;
  Element.formEditImageTag.src = project.logo_path;

  // Set imageFile2Upload to null since it is a global variable
  imageFile2Upload = null;

  $("#modal-form-edit-sBCH-project").modal("show");
}

export async function deleteProject(docID, logo_path) {
  try {
    await FirebaseController.deleteProject(docID, logo_path);

    smartBCH_page();
    Util.popUpInfo("Deleted Product", `${docID} has sucessfully been deleted.`);
  } catch (error) {
    Util.popUpInfo("Error with Deletion", JSON.stringify(error));
  }
}

export async function editCard(docID) {
  let card;
  try {
    card = await FirebaseController.getCardByID(docID);
    if (!card) {
      Util.popUpInfo("getCardByID Error", `No card found with ID: ${docID}`);
      return;
    }
  } catch (error) {
    Util.popUpInfo("Error in getCardByID", JSON.stringify(error));
    return;
  }

  Element.formEditCard.docID.value = card.docID;
  Element.formEditCard.body.value = card.body;
  Element.formEditCard.header.value = card.header;
  Element.formEditCard.page.value = card.page;
  Element.formEditCard.isPinned.checked = card.isPinned;

  $("#modal-form-edit-card").modal("show");
}

export async function deleteCard(docID, page) {
  try {
    await FirebaseController.deleteCard(docID);

    if (page === "home") {
      home_page();
    }
    if (page === "about") {
      about_page();
    }
    Util.popUpInfo("Deleted Card", `${docID} has sucessfully been deleted.`);
  } catch (error) {
    Util.popUpInfo("Error with Deletion", JSON.stringify(error));
  }
}
