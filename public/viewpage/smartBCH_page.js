import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";

export function addEventListeners() {
  Element.menuSmartBCH.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.SBCH);
    smartBCH_page();
  });
}

let projects;

export async function smartBCH_page() {
  let html = "";

  try {
    projects = await FirebaseController.getSBCHProjectList();
    let index = 0;
    projects.forEach((project) => {
      html += buildProjectCard(project, index);
      ++index;
    });
  } catch (error) {
    if (Constant.DEV) {
      console.log(error);
      // Util.popUpInfo("Error in getHomeprojectList", JSON.stringify(error));
      return;
    }
  }

  Element.content.innerHTML = html;
  Util.scrollToTop();
  Util.hideTwitterFeeds();
}

function buildProjectCard(project, index) {
  let dyorTag = "";
  if (project.dyor) {
    dyorTag += ` <span class="badge badge-danger">DYOR</span>`;
  }
  let auditTag = "";
  if (project.audit) {
    auditTag += ` <span class="badge badge-success">Audit</span>`;
  } else {
    auditTag += ` <span class="badge badge-warning">No Audit</span>`;
  }
  let listingTag = "";
  if (project.new_listing) {
    listingTag += ` <span class="badge badge-warning">New Listing</span>`;
  }
  let helpfulLinksText = "";
  if (project.helpful_links.length > 0) {
    helpfulLinksText += "Helpful Links: ";
    let linkIndex = 0;
    project.helpful_links.forEach((helpfulLink) => {
      helpfulLinksText += `<a href="${helpfulLink["link"]}" target="_blank">${helpfulLink["name"]}</a>`;
      if (linkIndex < project.helpful_links.length - 1) {
        helpfulLinksText += " - ";
      }
      linkIndex++;
    });
  }
  let typesText = "";
  if (project.type.length > 0) {
    typesText += "Type: ";
    let linkIndex = 0;
    project.type.forEach((type) => {
      typesText += type;
      if (linkIndex < project.type.length - 1) {
        typesText += ", ";
      }
      linkIndex++;
    });
  }
  let myThoughtsText = "My two sats: ";
  if (project.my_thoughts) {
    myThoughtsText += project.my_thoughts;
  } else {
    myThoughtsText += "None... 🤷‍♂️";
  }
  let socialsHTML = "";
  if (project.socials["telegram"] !== "") {
    console.log("telegram");
  }
  if (project.socials["twitter"] !== "") {
    socialsHTML += `<a href="${project.socials["twitter"]}" target="_blank"><img src="./images/twitter.png" alt="Twitter logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["discord"] !== "") {
    console.log("discord");
  }
  if (project.socials["github"] !== "") {
    console.log("github");
  }
  if (project.socials["noise"] !== "") {
    console.log("noise");
  }
  if (project.socials["read"] !== "") {
    console.log("read");
  }
  if (project.socials["reddit"] !== "") {
    console.log("reddit");
  }
  if (project.socials["medium"] !== "") {
    console.log("medium");
  }
  if (project.socials["linkedin"] !== "") {
    console.log("linkedin");
  }
  if (project.socials["facebook"] !== "") {
    console.log("facebook");
  }
  if (project.socials["instagram"] !== "") {
    console.log("instagram");
  }
  if (project.socials["weibo"] !== "") {
    console.log("weibo");
  }
  if (project.socials["youtube"] !== "") {
    console.log("youtube");
  }

  return `
          <div class="card mb-3">
            <div class="card-header">
              <h6 class="inline">${project.name}${listingTag}${auditTag}${dyorTag}</h6>
              <h6 class="inline text-muted float-right">${typesText}</h6>
            </div>
            <div class="card-body">
              <div class="inner">
                <img src="${project.logo_path}" alt="Project logo" style=" height: 5em; padding: 5px;" />
              </div>
              <div class="inner">
                <div class="padding-bottom">${project.description}</div>
                <div class="padding-bottom">${myThoughtsText}</div>
                <div>${helpfulLinksText}</div>
              </div>
              <div class="inner-top float-right" style="height: 100%; width: 20%; text-align: right;">
                <h5>Socials:</h5>
                <div>${socialsHTML}</div>
              </div>
            </div>
          </div>`;
}
