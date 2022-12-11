import { BugReport } from "../model/bugReport.js";
import * as Element from "../viewpage/element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "../viewpage/util.js";
import { login_page } from "../viewpage/login_page.js";

export function addEventListeners() {
  Element.formBugReport.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = Element.formBugReport.getElementsByTagName("button")[0];
    const origLabel = Util.disableButton(button);
    await submitBugReport(e);
    Util.enableButton(button, origLabel);
  });
}

async function submitBugReport(e) {
  const text = e.target.text.value;
  const contact = e.target.contact.value;

  // Clear error tags before validating again
  const errorTags = document.getElementsByClassName("error-bug-report");
  for (const element of errorTags) {
    element.innerHTML = "";
  }

  const report = new BugReport({
    text,
    contact,
  });

  const errors = report.validate();
  if (errors) {
    if (errors.text) {
      Element.formBugReportError.text.innerHTML = errors.text;
    }
    if (errors.contact) {
      Element.formBugReportError.contact.innerHTML = errors.contact;
    }
    return;
  }

  try {
    await FirebaseController.submitBugReport(report.serialize());
    login_page();
    Util.popUpInfo(
      "Success!",
      `We will review your bug report!`,
      "modal-form-bug-report"
    );
    e.target.reset();
  } catch (error) {
    Util.popUpInfo(
      "Failed to Submit Bug Report!",
      JSON.stringify(error),
      "modal-form-bug-report"
    );
  }
}
