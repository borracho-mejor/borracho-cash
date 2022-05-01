import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { home_page } from "./home_page.js";

export function addEventListeners() {
  Element.menuSmartBCH.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.SBCH);
    smartBCH_page();
  });
}

let projects;
let types;
let socials;

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
                        <p>I do my best to add new VALID projects as they become available, but please let me know if I am missing any you think should be listed, including your own. For now, I can be reached best at the <b>Support/Listings Telegram</b> in the footer below.
                          Please be respectful and patient, WAGMI in the end.
                        </p>
                        <div class="text-center" style="padding-bottom: 0.625rem;">Project Count: <span id="project-count"></span></div>
                        <p style="text-align: center;">You can either...</p>
                        <form id="form-search" class="my-2 my-lg-0 form-inline">
                          <input name="searchKeywords" class="form-control mr-sm-2 inline flex-fill" type="search" placeholder="Search" aria-label="Search" />
                          <button class="btn btn-outline-success my-2 my-sm-0 inline" type="submit">Search</button>
                        </form>
                        <p class="padding-top" style="text-align: center; margin: 5px;">...or...</p>
                        <p style="text-align: center; margin: 5px;">Use the filters below to filter projects.</p>
                        <div class="text-center padding-bottom-medium">
                          <button id="button-filter" type="button" class="btn btn-success">FILTER RESULTS</button>
                          <button id="button-filter-clear" type="button" class="btn btn-danger">CLEAR</button>
                        </div>
                        <div class="alert alert-custom">
                          <p class="alert-heading">Quick Filters:</p>
                          <hr>
                          <div class="form-check inline padding-right-large">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-new">
                            <label class="form-check-label" for="checkbox-new">
                              Newly Listed
                            </label>
                          </div>
                          <div class="form-check inline padding-right-large">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-audited">
                            <label class="form-check-label" for="checkbox-audited">
                              Audited
                            </label>
                          </div>
                          <div class="form-check inline padding-right-large">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-mysats">
                            <label class="form-check-label" for="checkbox-mysats">
                              My Two Sats
                            </label>
                          </div>
                          <div class="form-check inline padding-right-large">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-dyor">
                            <label class="form-check-label" for="checkbox-dyor">
                              DYOR
                            </label>
                          </div>
                        </div>
                        <div class="alert alert-custom">
                          <p class="alert-heading">Type(s): (an OR relationship)</p>
                          <hr>
                          <div id="type-check-form"></div>
                        </div>
                        <div class="alert alert-custom">
                          <p class="alert-heading">Socials Available: (an AND relationship)</p>
                          <hr>
                          <div id="socials-check-form"></div>
                        </div>
                      </div>
                    </div>
                    `;

  try {
    projects = await FirebaseController.getSBCHProjectList();

    if (projects.length == 0) {
      html += `<h4 style="text-align:center;">No projects found!</h4>`;
    }

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
    types = await FirebaseController.getTypeList(projects);
    types.sort();
    let index = 0;
    types.forEach((type) => {
      typeChecksHTML += buildCheckboxesForTypes(type, index);
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
    socials = await FirebaseController.getSocialsList(projects);
    socials.sort();
    let index = 0;
    socials.forEach((social) => {
      let capitalSocial = social[0].toUpperCase() + social.substring(1);
      socialsChecksHTML += buildCheckboxesForSocials(capitalSocial, index);
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
  document.getElementById("project-count").innerHTML = projects.length;
  document.getElementById("button-filter").addEventListener("click", () => {
    filterResults();
  });
  document
    .getElementById("button-filter-clear")
    .addEventListener("click", () => {
      clearResults();
    });
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
  const date = Timestamp.fromDate(new Date());
  if (
    Math.floor((date - project.timestamp) / (3600 * 24)) <
    Constant.NEW_LISTING_TIME
  ) {
    // if project has been listed less than 30 days
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
  let descriptionText = "";
  if (project.description) {
    descriptionText += project.description;
  } else {
    descriptionText += "None... 🤷‍♂️";
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
              <div class="inline"><h1 class="inline"><h4 class="inline" style="vertical-align: middle;">${project.name}</h4><h6 class="inline" style="vertical-align: middle;">${listingTag}${auditTag}${dyorTag}</h6></div>
              <div class="inline float-right"><h6 class="text-muted">${typesText}</h6></div>
            </div>
            <div class="card-body flex-container">
              <div class="mr-3" style="flex: 10%; text-align: center;">
                <span class="vertical-center-helper"></span><a href=${project.site} target="_blank"><img src="${project.logo_path}" alt="Project logo" style="max-height: 8rem; max-width: 100%; padding: 5px;" /></a>
              </div>
              <div style="flex: 75%">
                <div class="alert alert-custom">
                  <h6 class="alert-heading">Description:</h6>
                  <hr>
                  <p>${descriptionText}</p>
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

function buildCheckboxesForTypes(label, index) {
  return `<div class="form-check-type inline padding-right-large">
            <input class="form-check-type-input" type="checkbox" value="" id="checkbox-type-${label}">
            <label class="form-check-type-label" for="checkbox-type-${label}">
              ${label}
            </label>
          </div>`;
}

function buildCheckboxesForSocials(label, index) {
  return `<div class="form-check-social inline padding-right-large">
            <input class="form-check-social-input" type="checkbox" value="" id="checkbox-social-${label}">
            <label class="form-check-social-label" for="checkbox-social-${label}">
              ${label}
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
  if (project.socials["angel"]) {
    html += `<a href="${project.socials["angel"]}" target="_blank"><img class="light-mode" src="./images/angel_dark.png" alt="Angel logo" style="height: 2em; padding: 5px" /></a>`;
    html += `<a href="${project.socials["angel"]}" target="_blank"><img class="dark-mode" src="./images/angel_light.png" alt="Angel logo" style="height: 2em; padding: 5px" /></a>`;
  }
  return html;
}

function filterResults() {
  let filteredProjects = [...projects];
  let newHTML = "";
  // new_listing
  if (document.getElementById("checkbox-new").checked) {
    const date = Timestamp.fromDate(new Date());
    filteredProjects = filteredProjects.filter(function (project) {
      return (
        Math.floor((date - project.timestamp) / (3600 * 24)) <
        Constant.NEW_LISTING_TIME
      );
    });
  }
  // audit
  if (document.getElementById("checkbox-audited").checked) {
    filteredProjects = filteredProjects.filter(function (project) {
      return Object.keys(project.audit).length != 0;
    });
  }
  // two sats
  if (document.getElementById("checkbox-mysats").checked) {
    filteredProjects = filteredProjects.filter(function (project) {
      return project.my_thoughts != "";
    });
  }
  // DYOR
  if (document.getElementById("checkbox-dyor").checked) {
    filteredProjects = filteredProjects.filter(function (project) {
      return project.dyor;
    });
  }
  // project type
  let typesCheckboxArray = document.getElementsByClassName(
    "form-check-type-input"
  );
  let typesArray = [];
  for (let i = 0; i < typesCheckboxArray.length; i++) {
    if (typesCheckboxArray[i].checked) {
      typesArray.push(typesCheckboxArray[i].parentNode.textContent.trim());
    }
  }
  if (typesArray.length != 0) {
    filteredProjects = filteredProjects.filter(function (project) {
      return project.type.some((val) => typesArray.indexOf(val) != -1);
    });
  }
  // socials
  let socialsCheckboxArray = document.getElementsByClassName(
    "form-check-social-input"
  );
  let socialsArray = [];
  for (let i = 0; i < socialsCheckboxArray.length; i++) {
    if (socialsCheckboxArray[i].checked) {
      socialsArray.push(
        socialsCheckboxArray[i].parentNode.textContent.trim().toLowerCase()
      );
    }
  }
  if (socialsArray.length != 0) {
    filteredProjects = filteredProjects.filter(function (project) {
      return socialsArray.every((element) => {
        return Object.keys(project.socials).includes(element);
      });
    });
  }

  if (filteredProjects.length === 0) {
    newHTML += `<h4 style="text-align:center;">No projects found with that filter!</h4>`;
  }
  let index = 0;
  filteredProjects.forEach((project) => {
    newHTML += buildProjectCard(project, index);
    ++index;
  });

  Element.content.scrollTo(0, 0);
  document.getElementById("project-count").innerHTML = filteredProjects.length;
  Element.content.innerHTML = newHTML;
}

function clearResults() {
  smartBCH_page();
}
