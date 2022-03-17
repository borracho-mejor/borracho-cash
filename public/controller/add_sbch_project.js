import { SBCHProject } from "../model/sBCHProject.js";
import * as Element from "../viewpage/element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as CloudStorage from "../controller/cloud_storage.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";

let imageFile2Upload;

export function resetImageSelection() {
  imageFile2Upload = null;
  Element.imageTagAddProject.src = "";
}

export function addEventListeners() {
  Element.formAddProject.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = Element.formAddProject.getElementsByTagName("button")[0];
    const origLabel = Util.disableButton(button);
    await addNewsBCHProject(e);
    // await ProductPage.product_page();
    Util.enableButton(button, origLabel);
  });
  Element.formImageAddButton.addEventListener("change", (e) => {
    imageFile2Upload = e.target.files[0];
    if (!imageFile2Upload) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => (Element.imageTagAddProject.src = reader.result);
    reader.readAsDataURL(imageFile2Upload);
    Element.formAddProjectError.logo.innerHTML = "";
  });
}

async function addNewsBCHProject(e) {
  const audit = trimAndParse(e.target.audits.value);
  const bias = e.target.bias.value;
  const description = e.target.description.value;
  const dyor = e.target.dyor.checked; // may need to change
  const helpful_links = trimAndParse(e.target.links.value);
  const my_thoughts = e.target.twosats.value;
  const name = e.target.name.value;
  const new_listing = e.target.newlisting.checked;
  const quoted_description = e.target.quoteddescription.value;
  const socials = trimAndParse(e.target.socials.value);
  const type = e.target.type.value.split(",");

  // Clear error tags before validating again
  const errorTags = document.getElementsByClassName("error-add-project");
  for (let i = 0; i < errorTags.length; i++) {
    errorTags[i].innerHTML = "";
  }

  const project = new SBCHProject({
    audit,
    bias,
    description,
    dyor,
    helpful_links,
    my_thoughts,
    name,
    new_listing,
    quoted_description,
    socials,
    type,
  });
  // Check
  const errors = project.validate(imageFile2Upload);
  if (errors) {
    if (errors.name) {
      Element.formAddProjectError.name.innerHTML = errors.name;
    }
    if (errors.price) {
      Element.formAddProjectError.price.innerHTML = errors.price;
    }
    if (errors.summary) {
      Element.formAddProjectError.description.innerHTML = errors.description;
    }
    if (errors.image) {
      Element.formAddProjectError.image.innerHTML = errors.image;
    }
    return;
  }

  try {
    const { imageURL } = await CloudStorage.uploadImage(imageFile2Upload); // No imageName provide, so automatically generated by FirebaseController
    project.logo_path = imageURL;
    await FirebaseController.addsBCHProject(project.serialize());
    Util.popUpInfo(
      "Success!",
      `${project.name} added!`,
      "modal-form-add-sBCH-project"
    );
  } catch (error) {
    if (Constant.DEV) {
      console.log(error);
    }
    Util.popUpInfo(
      "Failed to Add Project!",
      JSON.stringify(error),
      "modal-add-product"
    );
  }
}

function trimAndParse(string) {
  return JSON.parse(JSON.stringify(JSON.parse(string), trimStrings, 4));
}

function trimStrings(key, value) {
  if (typeof value === "string") {
    return value.trim();
  }

  return value;
}
