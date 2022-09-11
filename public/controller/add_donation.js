import { Donation } from "../model/donation.js";
import * as Element from "../viewpage/element.js";
import * as FirebaseController from "./firebase_controller.js";
import * as Util from "../viewpage/util.js";
import * as BCHInfo from "./bch_info.js";

export function addEventListeners() {
  Element.formAddDonation.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = Element.formAddDonation.getElementsByTagName("button")[0];
    const origLabel = Util.disableButton(button);
    await addNewDonation(e);
    Util.enableButton(button, origLabel);
  });
}

async function addNewDonation(e) {
  let usdAmount, bchAmount;

  // update navbar price bc why not?
  BCHInfo.makeBCHNavbarBox();

  const bchInfo = await FirebaseController.getBCHPrice();
  const bchPrice = bchInfo.price;

  const title = e.target.title.value;
  if (e.target.usdAmount.value && !e.target.bchAmount.value) {
    usdAmount = parseFloat(e.target.usdAmount.value);
    bchAmount = usdAmount / bchPrice;
  } else if (!e.target.usdAmount.value && e.target.bchAmount.value) {
    bchAmount = parseFloat(e.target.bchAmount.value);
    usdAmount = bchAmount * bchPrice;
  } else {
    usdAmount = parseFloat(e.target.usdAmount.value);
    bchAmount = parseFloat(e.target.bchAmount.value);
  }
  let type;
  if (e.target.isDonation.checked && !e.target.isSpending.checked) {
    type = "donation";
  } else if (e.target.isSpending.checked && !e.target.isDonation.checked) {
    type = "spending";
  } else {
    type = "error";
  }
  const timestamp = Date.now();

  // Clear error tags before validating again
  const errorTags = document.getElementsByClassName("error-add-donation");
  for (let i = 0; i < errorTags.length; i++) {
    errorTags[i].innerHTML = "";
  }

  const donation = new Donation({
    title,
    type,
    usdAmount,
    bchAmount,
    timestamp,
  });
  // Check
  const errors = donation.validate();
  if (errors) {
    if (errors.type) {
      Element.formAddDonationError.donation.innerHTML = errors.type;
    }
    if (errors.title) {
      Element.formAddDonationError.title.innerHTML = errors.title;
    }
    if (errors.bchAmount) {
      Element.formAddDonationError.bchAmount.innerHTML = errors.bchAmount;
    }
    if (errors.usdAmount) {
      Element.formAddDonationError.usdAmount.innerHTML = errors.usdAmount;
    }
    return;
  }

  try {
    await FirebaseController.addDonation(donation.serialize());
    Util.popUpInfo(
      "Success!",
      `${donation.title} added!`,
      "modal-form-add-donation"
    );
    e.target.reset();
  } catch (error) {
    Util.popUpInfo(
      "Failed to Add Donation!",
      JSON.stringify(error),
      "modal-add-donation"
    );
  }
}
