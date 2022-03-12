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
    let types = project.type;
  }
  return `
          <div class="card mb-3">
            <div class="card-header">
              <h6>${project.name}${listingTag}${auditTag}${dyorTag}</h6>
              <h6>Type: </h6>
            </div>
            <div class="card-body">
              <div class="inline">
                <img src="${project.logo_path}" alt="Project logo" style=" height: 5em; padding: 5px;" />
              </div>
              <div class="inline">
                <div>${project.description}</div>
                <div>${helpfulLinksText}</div>
              </div>
            </div>
          </div>`;
}
