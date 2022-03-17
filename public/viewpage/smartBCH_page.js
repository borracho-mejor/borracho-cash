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
let types;

export async function smartBCH_page() {
  Util.scrollToTop();
  Util.hideTwitterFeeds();
  Util.showHeader();

  let html = "";
  let typeChecksHTML = "";
  let socialsChecksHTML = "";
  let sidebarHTML = `<div style="height: 100%;">
                      <img class="dark-mode" src="./images/smartBCH_light.png" alt="smartBCH logo" style="width: 100%; padding: 5px; margin: auto;" /><img class="light-mode" src="./images/smartBCH_dark.png" alt="smartBCH logo" style="width: 100%; padding: 5px;" />
                      <div style="max-width: 65rem; padding: 5px; margin: auto; text-align: left;">                  
                        <h5>Here's a list of smartBCH projects. This will only include projects like DEXs, Launchpads, Staking Platforms, NFT Marketplaces, and tokens with large use-cases (i.e: Celery with its staking platform and SIDX with its governance and managed portfolio). 
                          I am not currently including NFT projects or tokens without use-cases.
                        </h5>
                        <p class="text-muted"><b>Disclaimer: Do Your Own Research!</b> Although I give my thoughts on most projects, nothing included here should be interpretted as financial advice in any shape or form.
                         Please research any project thoroughly before even contemplating investing, and only invest what you are able and willing to lose.</p>
                        <div class="text-center padding-bottom">
                          <button type="button" class="btn btn-success">FILTER RESULTS</button>
                          <button type="button" class="btn btn-danger">CLEAR</button>
                        </div>
                        <p style="text-align: center;">Use the filters below to filter projects.</p>
                        <div class="alert alert-custom">
                          <p class="alert-heading">New Listings:</p>
                          <hr>
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-new">
                            <label class="form-check-label" for="checkbox-new">
                              New Listings Only
                            </label>
                          </div>
                        </div>
                        <div class="alert alert-custom">
                          <p class="alert-heading">Type:</p>
                          <hr>
                          <div id="type-check-form"></div>
                        </div>
                        <div class="alert alert-custom">
                          <p class="alert-heading">Audited:</p>
                          <hr>
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-audited">
                            <label class="form-check-label" for="checkbox-audited">
                              Audited Listings Only
                            </label>
                          </div>
                        </div>
                        <div class="alert alert-custom">
                          <p class="alert-heading">My two sats:</p>
                          <hr>
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-mysats">
                            <label class="form-check-label" for="checkbox-mysats">
                              My Two Sats Given
                            </label>
                          </div>
                        </div>
                        <div class="alert alert-custom">
                          <p class="alert-heading">Socials Available:</p>
                          <hr>
                          <div id="socials-check-form"></div>
                        </div>
                      </div>
                    </div>
                    `;

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
  try {
    types = await FirebaseController.getTypeList();
    let index = 0;
    types.forEach((type) => {
      typeChecksHTML += buildCheckboxes(type, index);
      ++index;
    });
  } catch (error) {
    if (Constant.DEV) {
      console.log(error);
      // Util.popUpInfo("Error in getHomeprojectList", JSON.stringify(error));
    }
    return;
  }

  try {
    let index = 0;
    Constant.socialsList.forEach((social) => {
      let capitalSocial = social[0].toUpperCase() + social.substring(1);
      socialsChecksHTML += buildCheckboxes(capitalSocial, index);
      ++index;
    });
  } catch (error) {
    if (Constant.DEV) {
      console.log(error);
      // Util.popUpInfo("Error in getHomeprojectList", JSON.stringify(error));
    }
    return;
  }

  Element.content.innerHTML = html;
  Element.contentSidebar.innerHTML = sidebarHTML;
  document.getElementById("type-check-form").innerHTML = typeChecksHTML;
  document.getElementById("socials-check-form").innerHTML = socialsChecksHTML;
}

function buildProjectCard(project, index) {
  let dyorTag = "";
  if (project.dyor) {
    dyorTag += `<div class="inline padding-left"><span class="badge badge-danger">!!--DYOR--!!</span></div>`;
  }
  let auditTag = "";
  if (Object.keys(project.audit).length === 0) {
    auditTag += `<div class="inline padding-left"><span class="badge badge-warning">No Audit</span></div>`;
  } else {
    for (var key in project.audit) {
      if (project.audit.hasOwnProperty(key)) {
        auditTag += `<a href="${project.audit[key]}" target="_blank"><div class="inline padding-left"><span class="badge badge-success">Audit: ${key}</span></div></a>`;
      }
    }
  }
  let listingTag = "";
  if (project.new_listing) {
    listingTag += `<div class="inline padding-left"><span class="badge badge-warning">New Listing</span></div>`;
  }
  let helpfulLinksText = "";
  if (Object.keys(project.helpful_links).length === 0) {
    helpfulLinksText += helpfulLinksText += "None... 🤷‍♂️";
  } else {
    let linkIndex = 0;
    for (var keyy in project.helpful_links) {
      if (project.helpful_links.hasOwnProperty(keyy)) {
        if (linkIndex !== 0) {
          helpfulLinksText += " - ";
        }
        linkIndex++;
        helpfulLinksText += `<a href="${project.helpful_links[keyy]}" target="_blank">${keyy}</a>`;
      }
    }
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
  let myThoughtsText = "";
  if (project.my_thoughts) {
    myThoughtsText += project.my_thoughts;
  } else {
    myThoughtsText += "None... 🤷‍♂️";
  }
  let quoteText = "";
  if (project.quoted_description) {
    quoteText += project.quoted_description;
  } else {
    quoteText += "No quoted description available... 🤷‍♂️";
  }
  let socialsHTML = buildSocials(project);

  return `
          <div class="card mb-3 mr-1">
            <div class="card-header">
              <h6 class="inline">${project.name}${auditTag}${dyorTag}</h6>
              <h6 class="inline text-muted float-right">${typesText}${listingTag}</h6>
            </div>
            <div class="card-body flex-container">
              <div class="mr-3" style="flex: 10%">
                <span class="vertical-center-helper"></span><img src="${project.logo_path}" alt="Project logo" style="width: 100%; padding: 5px;" />
              </div>
              <div style="flex: 75%">
                <div class="alert alert-custom">
                  <h6 class="alert-heading">Description:</h6>
                  <hr>
                  <p>${project.description}</p>
                  <p class="text-muted">"${quoteText}"</p>
                </div>
                <div class="alert alert-custom">
                  <h6 class="alert-heading inline">My two sats:</h6>
                  <hr>
                  <p class="mb-0">${myThoughtsText}</p>
                </div>
              </div>
              <div style="flex: 15%; text-align: right; height 100%;">
                <div class="padding-bottom">
                  <h5>Socials:</h5>
                  <p>${socialsHTML}</p>
                </div>
                <div>
                  <h5>Helpful Links:</h5>
                  <p>${helpfulLinksText}</p>
                </div>
              </div>
            </div>
          </div>`;
}

function buildCheckboxes(type, index) {
  return `<div class="form-check inline padding-right-large">
            <input class="form-check-input" type="checkbox" value="" id="checkbox-type-${type}">
            <label class="form-check-label" for="checkbox-type-${type}">
              ${type}
            </label>
          </div>`;
}

function buildSocials(project) {
  let html = "";
  if (project.socials["telegram"]) {
    html += `<a href="${project.socials["telegram"]}" target="_blank"><img src="./images/telegram.png" alt="Telegram logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["twitter"]) {
    html += `<a href="${project.socials["twitter"]}" target="_blank"><img src="./images/twitter.png" alt="Twitter logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["github"]) {
    html += `<a href="${project.socials["github"]}" target="_blank"><img class="light-mode" src="./images/github_dark.png" alt="Github logo" style="height: 2em; padding: 5px" /></a>`;
    html += `<a href="${project.socials["github"]}" target="_blank"><img class="dark-mode" src="./images/github_light.png" alt="Github logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["read"]) {
    html += `<a href="${project.socials["read"]}" target="_blank"><img src="./images/read.png" alt="Read.cash logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["noise"]) {
    html += `<a href="${project.socials["noise"]}" target="_blank"><img src="./images/noise.png" alt="Noise.cash logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["memo"]) {
    html += `<a href="${project.socials["memo"]}" target="_blank"><img src="./images/memocash.png" alt="Memo.cash logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["discord"]) {
    html += `<a href="${project.socials["discord"]}" target="_blank"><img src="./images/discord.png" alt="Discord logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["reddit"]) {
    html += `<a href="${project.socials["reddit"]}" target="_blank"><img src="./images/reddit.png" alt="Reddit logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["medium"]) {
    html += `<a href="${project.socials["medium"]}" target="_blank"><img class="light-mode" src="./images/medium_dark.png" alt="Medium logo" style="height: 2em; padding: 5px" /></a>`;
    html += `<a href="${project.socials["medium"]}" target="_blank"><img class="dark-mode" src="./images/medium_light.png" alt="Medium logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["linkedin"]) {
    html += `<a href="${project.socials["linkedin"]}" target="_blank"><img src="./images/linkedin.png" alt="LinkedIn logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["facebook"]) {
    html += `<a href="${project.socials["facebook"]}" target="_blank"><img src="./images/facebook.png" alt="Facebook logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["instagram"]) {
    html += `<a href="${project.socials["instagram"]}" target="_blank"><img src="./images/instagram.png" alt="Instagram logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["weibo"]) {
    html += `<a href="${project.socials["weibo"]}" target="_blank"><img src="./images/weibo.png" alt="Weibo logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["youtube"]) {
    html += `<a href="${project.socials["youtube"]}" target="_blank"><img src="./images/youtube.png" alt="Youtube logo" style="height: 2em; padding: 5px" /></a>`;
  }
  return html;
}
