import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import * as Auth from "../controller/auth.js";
import * as Edit from "../controller/edit_project.js";

export function addEventListeners() {
  Element.menuSmartBCH.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.SBCH);
    smartBCH_page();
  });
}

let projects;
let types;
let socials;

export async function smartBCH_page(scrollTop = true) {
  if (scrollTop) {
    Util.scrollToTop();
  } else {
    Element.content.scrollTo(0, 0);
  }
  Util.hideTwitterFeeds();
  Util.showHeader();
  Util.unActivateLinks();
  Element.menuSmartBCH.classList.add("active");

  let html = "";
  let typeChecksHTML = "";
  let socialsChecksHTML = "";
  let sidebarHTML = `<div style="height: 100%;">
                      <img class="dark-mode" src="./images/smartBCH_light.png" alt="smartBCH logo" style="width: 100%; padding: 5px; margin: auto;" /><img class="light-mode" src="./images/smartBCH_dark.png" alt="smartBCH logo" style="width: 100%; padding: 5px;" />
                      <div style="max-width: 65rem; padding: 5px; margin: auto; text-align: left;">                  
                        <h5 class="padding-bottom">Here's a list of smartBCH projects. This will only include projects like DEXs, Launchpads, Staking Platforms, NFT Marketplaces, and tokens with large use-cases (i.e: Celery with its staking platform and SIDX with its governance and managed portfolio). 
                          I am not currently including tokens without use-cases. With smartBCH, WAGMI!
                        </h5>
                        <div class="text-center padding-bottom-large" style="max-width: 65%; margin-left: auto; margin-right: auto;">
                          <button id="button-add-smartBCH" type="button" class="btn btn-block btn-outline-success"><img src="../images/metamask.svg" alt="Metamask Logo" style="max-height: 1.5em;" /> Add smartBCH to MetaMask</button>
                        </div>
                        <p>
                          <small class="text-muted"><b>Disclaimer: Do Your Own Research!</b> Although I give my thoughts on some projects, nothing included here should be interpretted as financial advice in any shape or form.
                            Please research any project thoroughly before even contemplating investing, and only invest what you are able and willing to lose.
                          </small>
                        </p>                        
                        <div class="text-center padding-bottom"><h5>Project Count: <span id="project-count"></span></h5></div>
                        <p style="text-align: center;">You can either...</p>
                        <form id="form-search" class="my-2 my-lg-0 form-inline">
                          <input id="input-search" name="searchKeywords" class="form-control mr-sm-2 inline flex-fill" type="search" placeholder="Search" aria-label="Search" />
                          <button class="btn btn-success my-2 my-sm-0 inline center-mobile" type="submit">Search</button>
                        </form>
                        <small style="text-align: center; display: block;">Work in progress, searching is hard... Clear search below.</small>
                        <p class="padding-top" style="text-align: center; margin: 5px;">— OR —</p>
                        <p style="text-align: center; margin: 5px;">Use the filters below to filter projects.</p>
                        <div class="text-center padding-bottom-medium">
                          <button id="button-filter" type="button" class="btn btn-success" style="margin-right: 5px;">Filter Projects</button>
                          <button id="button-filter-clear" type="button" class="btn btn-danger">Clear</button>
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
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-non-dyor">
                            <label class="form-check-label" for="checkbox-non-dyor">
                              Non-DYOR
                            </label>
                          </div>
                          <div class="form-check inline padding-right-large">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-mysats">
                            <label class="form-check-label" for="checkbox-mysats">
                              My Two Sats
                            </label>
                          </div>
                          <div class="form-check inline padding-right-large">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-non-nft">
                            <label class="form-check-label" for="checkbox-non-nft">
                              Non-NFT Only
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
    Util.popUpInfo("Error in getHomeProjectList", JSON.stringify(error));
    return;
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
    Util.popUpInfo("Error in getHomeProjectList", JSON.stringify(error));
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
    Util.popUpInfo("Error in getHomeProjectList", JSON.stringify(error));
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
    .getElementById("button-add-smartBCH")
    .addEventListener("click", () => {
      addSmartBCHChain();
    });
  document.getElementById("form-search").addEventListener("submit", (e) => {
    e.preventDefault();
    const keywords = e.target.searchKeywords.value.trim().toLowerCase();
    searchResults(keywords);
  });
  document
    .getElementById("button-filter-clear")
    .addEventListener("click", () => {
      clearResults();
    });

  const editButtons = document.getElementsByClassName("form-edit-project");
  for (const element of editButtons) {
    element.addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disableButton(button);
      await Edit.editProject(e.target.docID.value);
      Util.enableButton(button, label);
    });
  }
  const deleteButtons = document.getElementsByClassName("form-delete-project");
  for (const element of deleteButtons) {
    element.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Confirm Deletion
      const r = confirm("Are you sure you want to delete this project?");
      if (!r) {
        return;
      }
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disableButton(button);
      await Edit.deleteProject(e.target.docID.value, e.target.logoPath.value);
      Util.enableButton(button, label);
    });
  }

  if (Auth.currentUser) {
    Auth.authStateChangeObserver(Auth.currentUser);
  }
}

function buildProjectCard(project, index) {
  let dyorTag = "";
  if (project.dyor) {
    dyorTag += `<div class="inline padding-left"><span class="badge badge-danger">!!--DYOR--!!</span></div>`;
  }
  let auditTag = "";
  if (Object.keys(project.audit).length === 0) {
    // auditTag += `<div class="inline padding-left"><span class="badge badge-warning">No Audit</span></div>`;
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
            <div class="card-header" style="padding: 10px;">
              <div class="inline"><a href=${
                project.site
              } target="_blank"><h4 class="inline padding-left-medium padding-right ignore-hyper-color" style="vertical-align: middle;">${
    project.name
  }</h4></a><h6 class="inline" style="vertical-align: middle;">${listingTag}${auditTag}${dyorTag}</h6></div>
              <div class="inline padding-right-medium padding-top-medium float-right"><h6 class="text-muted">${typesText}</h6></div>
            </div>
            <div class="card-body flex-container">
              <div class="mr-3" style="flex: 10%; text-align: center;">
                <span class="vertical-center-helper"></span><a href=${
                  project.site
                } target="_blank"><img class="shaking-image" src="${
    project.logo_path
  }" alt="Project logo" style="max-height: 8rem; max-width: 100%; padding: 5px;" /></a>
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
              <div style="flex: 15%; text-align: right; height 100%; margin: 5px;">
                <div class="padding-bottom">
                  <h5>Socials:</h5>
                  <p>${socialsHTML}</p>
                </div>
                <div class="padding-bottom">
                  <h5>Helpful Links:</h5>
                  <p>${helpfulLinksText}</p>
                </div>
                <div class="padding-bottom">
                  <h5>Added:</h5>
                  <p>${new Date(project.timestamp.toDate()).toDateString()}</p>
                </div>
                <form class="form-delete-project inline float-right modal-post-auth" method="post">
                <input type="hidden" name="docID" value="${project.docID}">
                <input type="hidden" name="logoPath" value="${
                  project.logo_path
                }">
                <button class="btn btn-outline-danger" style="margin-left: 5px;" type="submit">Delete</button>
              </form>
              <form class="form-edit-project inline float-right modal-post-auth" method="post">
                <input type="hidden" name="docID" value="${project.docID}">
                <button class="btn btn-outline-success" style="margin-left: 5px;" type="submit">Edit</button>
              </form>
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
  let html = `<div class="sibling-fade">`;
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
  // If no socials we need to add text
  if (html == `<div class="sibling-fade">`) {
    html += `<p>None... 🤷‍♂️</p>`;
  }
  html += "</div>";
  return html;
}

function filterResults() {
  document.getElementById("input-search").value = "";
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
  // non-NFT
  if (document.getElementById("checkbox-non-nft").checked) {
    filteredProjects = filteredProjects.filter(function (project) {
      if (project.type.length === 1) {
        return !project.type.includes("NFT Collection");
      } else {
        return project.type;
      }
    });
  }
  // non-DYOR
  if (document.getElementById("checkbox-non-dyor").checked) {
    filteredProjects = filteredProjects.filter(function (project) {
      return !project.dyor;
    });
  }
  // project type
  let typesCheckboxArray = document.getElementsByClassName(
    "form-check-type-input"
  );
  let typesArray = [];
  for (const element of typesCheckboxArray) {
    if (element.checked) {
      typesArray.push(element.parentNode.textContent.trim());
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
  for (const element of socialsCheckboxArray) {
    if (element.checked) {
      socialsArray.push(element.parentNode.textContent.trim().toLowerCase());
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

async function searchResults(keywords) {
  clearCheckboxes();
  let newHTML = "";
  let searchedProjects = [];

  if (keywords.length != 0) {
    searchedProjects = await FirebaseController.getSBCHProjectSearch(keywords);
  }

  if (searchedProjects.length === 0) {
    newHTML += `<h4 style="text-align:center;">No projects found with that search!</h4>`;
  }

  let index = 0;
  searchedProjects.forEach((project) => {
    newHTML += buildProjectCard(project, index);
    ++index;
  });

  Element.content.scrollTo(0, 0);
  document.getElementById("project-count").innerHTML = searchedProjects.length;

  Element.content.innerHTML = newHTML;
}

function clearResults() {
  smartBCH_page(false);
}

// Thanks im_uname#100🍋 for providing this function
async function addSmartBCHChain() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x2710" }],
    });
    Util.popUpInfo(
      "smartBCH already added!",
      "Silly, smartBCH has already been added. Get on over to Mistswap/Tangoswap and start trading for low fees on a fast EVM!"
    );
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2710",
              chainName: "smartBCH Mainnet",
              blockExplorerUrls: ["https://www.smartscan.cash/"],
              rpcUrls: [
                "https://smartbch.greyh.at",
                "https://smartbch.fountainhead.cash/mainnet",
                "https://rpc.uatvo.com",
              ],
              nativeCurrency: {
                name: "BCH",
                symbol: "BCH",
                decimals: 18,
              },
            },
          ],
        });
        Util.popUpInfo(
          "smartBCH added to wallet!",
          "Go to Mistswap/Tangoswap and start trading for low fees on a fast EVM!"
        );
      } catch (addError) {
        Util.popUpInfo(
          "Error adding smartBCH! (addError)",
          JSON.stringify(addError)
        );
      }
    }
    if (switchError.code != 4902) {
      Util.popUpInfo(
        "Error adding smartBCH! (switchError)",
        JSON.stringify(switchError)
      );
    }
  }
}

function clearCheckboxes() {
  document.getElementById("checkbox-new").checked = false;
  document.getElementById("checkbox-audited").checked = false;
  document.getElementById("checkbox-mysats").checked = false;
  document.getElementById("checkbox-dyor").checked = false;
  document.getElementById("checkbox-non-nft").checked = false;
  document.getElementById("checkbox-non-dyor").checked = false;
  let typesCheckboxArray = document.getElementsByClassName(
    "form-check-type-input"
  );
  for (const element of typesCheckboxArray) {
    element.checked = false;
  }
  let socialsCheckboxArray = document.getElementsByClassName(
    "form-check-social-input"
  );
  for (const element of socialsCheckboxArray) {
    element.checked = false;
  }
}
