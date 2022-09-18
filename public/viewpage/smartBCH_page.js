import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import * as Auth from "../controller/auth.js";
import * as Edit from "../controller/edit_project.js";
import { SBCHProject } from "../model/sBCHProject.js";

export function addEventListeners() {
  Element.menuSmartBCH.addEventListener("click", () => {
    history.pushState(null, null, Routes.routePathname.SBCH);
    smartBCH_page();
  });
}

let projects = [];
let filterArray = [];
let typeChecksHTML = "";
let socialsChecksHTML = "";
let copyButtonHTML = `<button id="copy-button" class="material-icons-outlined button-clear inline" style="vertical-align: middle;" data-toggle="popover" data-placement="top" data-content="URL Copied!">content_copy</button>`;

export async function smartBCH_page(
  routeKeywords,
  scrollTop = true,
  isCollapsed = false
) {
  Util.popUpLoading("Loading projects...", "");

  projects = [];
  filterArray = [];
  typeChecksHTML = "";
  socialsChecksHTML = "";
  let specificProject;

  try {
    projects = await FirebaseController.getSBCHProjectList();
  } catch (error) {
    Util.popUpInfo("Error in getHomeProjectList", JSON.stringify(error));
    return;
  }
  try {
    const types = await FirebaseController.getTypeList(projects);
    types.sort();
    let index = 0;
    types.forEach((type) => {
      typeChecksHTML += buildCheckboxesForTypes(type, index);
      ++index;
    });
  } catch (error) {
    Util.popUpInfo("Error in getProjectTypeList", JSON.stringify(error));
    return;
  }
  try {
    let socials = await FirebaseController.getSocialsList(projects);
    socials.sort();
    let index = 0;
    socials.forEach((social) => {
      let capitalSocial = social[0].toUpperCase() + social.substring(1);
      socialsChecksHTML += buildCheckboxesForSocials(capitalSocial, index);
      ++index;
    });
  } catch (error) {
    Util.popUpInfo("Error in getProjectSocialsList", JSON.stringify(error));
    return;
  }
  if (routeKeywords) {
    if (routeKeywords.startsWith("search=") && routeKeywords != "search=") {
      routeKeywords = routeKeywords.substring(7);
      try {
        projects = await FirebaseController.getSBCHProjectSearch(routeKeywords);
      } catch (error) {
        Util.popUpInfo("Error in getSBCHProjectSearch", JSON.stringify(error));
        return;
      }
      const keywordsArray = routeKeywords.toLowerCase().match(/\S+/g);
      const joinedSearchKeys = keywordsArray.join("+");
      history.pushState(
        null,
        null,
        Routes.routePathname.SBCH + "#search=" + joinedSearchKeys
      );
    } else if (
      routeKeywords.startsWith("filter=") &&
      routeKeywords != "filter="
    ) {
      routeKeywords = routeKeywords.substring(7);
      filterArray = routeKeywords.split(" ");
      history.pushState(
        null,
        null,
        Routes.routePathname.SBCH + "#filter=" + routeKeywords
      );
    } else if (
      routeKeywords.startsWith("project=") &&
      routeKeywords != "project="
    ) {
      // getSBCHProjectByName (decoded)
      routeKeywords = routeKeywords.substring(8);
      specificProject = await FirebaseController.getProjectByName(
        decodeURI(routeKeywords)
      );
      isCollapsed = true;
      history.pushState(
        null,
        null,
        Routes.routePathname.SBCH + "#project=" + routeKeywords
      );
    } else {
      history.pushState(null, null, Routes.routePathname.SBCH);
    }
  } else {
    history.pushState(null, null, Routes.routePathname.SBCH);
  }

  setTimeout(function () {
    $("#loadingoverlay").modal("hide");
  }, 500);

  build_smartBCH_page(routeKeywords, specificProject, scrollTop, isCollapsed);
}

export async function build_smartBCH_page(
  routeKeywords,
  specificProject,
  scrollTop,
  isCollapsed
) {
  Util.hideTwitterFeeds();
  Util.showHeader();
  Util.unActivateLinks();
  Element.menuSmartBCH.classList.add("active");
  $("#modal-pop-up-info").modal("hide");

  let html = "";
  let sidebarHTML = `<div style="height: 100%;">
                      <img class="dark-mode" src="./images/smartBCH_light.png" alt="smartBCH logo" style="width: 100%; padding: 5px; margin: auto;" /><img class="light-mode" src="./images/smartBCH_dark.png" alt="smartBCH logo" style="width: 100%; padding: 5px;" />
                      <div class="mx-2 mt-3 flashing-warning alert alert-danger flex-container" role="alert" style="background-color: #dc3545; color: white; border: none; min-height: 1em; text-align: center; padding: 1px 0;">
                        <div class="px-3 flex-container" style="flex: 10%; text-align: center; vertical-align: middle; flex-direction: column; justify-content: center;">
                          <i class="material-icons-outlined" style="font-size: 1.5em; display: inline-block; justify-content: center; align-items: center;">warning</i>
                        </div>
                        <div>
                          <a style="color: white;" href="https://borracho.cash/smartbch#project=conflex%20f.k.a.%20coinflex"><strong>Mark Lamb and Conflex</strong></a> really fucked us. Most high liquidty bridges and on/off ramps are currently offline, please DYOR before investing.
                        </div>
                        <div class="px-3 flex-container" style="flex: 10%; text-align: center; vertical-align: middle; flex-direction: column; justify-content: center;">
                          <i class="material-icons-outlined" style="font-size: 1.5em; display: inline-block; justify-content: center; align-items: center;">warning</i>
                        </div>
                      </div>
                      <div class="p-2" style="max-width: 65rem; margin: auto; text-align: left;">                  
                        <div class="collapse show multi-collapse" id="collapseSidebar2" >
                          <h5 class="padding-bottom">Here's a list of smartBCH projects. This will only include projects like DEXs, Launchpads, Staking Platforms, NFT Marketplaces, and tokens with large use-cases (i.e: Celery with its staking platform and SIDX with its governance and managed portfolio). 
                           I am not currently including tokens without use-cases. With smartBCH, WAGMI!
                          </h5>
                          <p style="vertical-align: middle;">
                            <div data-toggle="collapse" href="#collapseDisclaimer" role="button" aria-expanded="false" aria-controls="collapseDisclaimer">
                              <div class="alert alert-danger" role="alert" style="min-height: 1em; text-align: center; padding: 1px 0;">
                                <i class="material-icons" style="font-size: 1.5em; vertical-align: middle; float: left; margin-left: 5%;">help_outline</i>
                                  <small>Click here to read my disclaimer!</small>
                                <i class="material-icons" style="font-size: 1.5em; vertical-align: middle; float: right; margin-right: 5%;">help_outline</i>
                              </div>
                            </div>
                            <div class="collapse" id="collapseDisclaimer">
                              <small class="text-muted"><b>Do Your Own Research!</b> Although I give my thoughts on some projects, nothing included here should be interpretted as financial advice in any shape or form.
                                Please research any project thoroughly before even contemplating investing, and only invest what you are able and willing to lose.
                              </small>
                            </div>
                          </p>
                          <div class="text-center padding-bottom-large" style="max-width: 65%; margin-left: auto; margin-right: auto;">
                            <button id="button-add-smartBCH" type="button" class="btn btn-block btn-outline-success"><img src="../images/metamask.png" alt="Metamask Logo" style="max-height: 1.5em;" /> Add smartBCH to MetaMask</button>
                          </div>    
                        </div>                 
                        <div class="text-center padding-bottom"><h5>Project Count: <span id="project-count"></span></h5></div>
                          <p style="text-align: center;">You can either...</p>
                          <form id="form-search" class="my-2 my-lg-0 form-inline">
                            <input id="input-search" name="searchKeywords" class="form-control mr-sm-2 inline flex-fill" type="search" placeholder="Search" aria-label="Search" />
                            <button class="btn btn-success my-2 my-sm-0 inline center-mobile" type="submit" style="position: relative;">
                              <div id="search-notification-badge" class="notification-badge" role="status"></div>
                              <span class="material-icons" style="vertical-align: middle;">search</span>
                            </button>
                          </form>
                          <p class="padding-top" style="text-align: center; margin: 5px;">— OR —</p>
                          <p style="text-align: center; margin: 5px;">Use the filters below to filter projects.</p>
                          <div class="text-center padding-bottom-medium">
                            <button id="button-filter" type="button" class="btn btn-success" style="position: relative; margin-right: 8px; margin-bottom: 5px;">
                              <div id="filter-notification-badge" class="notification-badge" role="status"></div>
                              Filter Projects
                            </button>
                            <button id="button-filter-clear" type="button" class="btn btn-danger" style="margin-right: 5px; margin-bottom: 5px;">Clear</button>
                            <button id="collapse-button" class="btn btn-outline-success collapse-btn-text flashing-button" data-toggle="collapse" href="#collapseSidebar" data-target=".multi-collapse" role="button" 
                              aria-expanded="false" aria-controls="collapseSidebar1 collapseSidebar2" style="margin-bottom: 5px;">Expand Sidebar</button>
                          </div>
                          <div class="collapse multi-collapse" id="collapseSidebar1" >
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
                              <input class="form-check-input" type="checkbox" value="" id="checkbox-upcoming">
                              <label class="form-check-label" for="checkbox-upcoming">
                                Upcoming
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
                            <div class="form-check inline padding-right-large">
                              <input class="form-check-input" type="checkbox" value="" id="checkbox-non-dyor">
                              <label class="form-check-label" for="checkbox-non-dyor">
                                Non-DYOR
                              </label>
                            </div>
                            <div class="form-check inline padding-right-large">
                              <input class="form-check-input" type="checkbox" value="" id="checkbox-non-nft">
                              <label class="form-check-label" for="checkbox-non-nft">
                                Non-NFT Only
                              </label>
                            </div>
                            <div class="form-check inline padding-right-large">
                              <input class="form-check-input" type="checkbox" value="" id="checkbox-non-upcoming">
                              <label class="form-check-label" for="checkbox-non-upcoming">
                                Non-Upcoming
                              </label>
                            </div>
                            <div class="form-check inline padding-right-large">
                              <input class="form-check-input" type="checkbox" value="" id="checkbox-warning">
                              <label class="form-check-label" for="checkbox-warning">
                              <span style="color: #dc3545;"><strong>Special Warnings</strong></span>
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
                    </div>
                  `;

  if (projects.length == 0) {
    html += `<h4 style="text-align:center;">No projects found!</h4>`;
  } else {
    if (specificProject) {
      html += `<div class="card mb-3 mr-1"><div class="card-body"><h5 style="text-align:left;">This is a specific project that was shared from the <a href="https://borracho.cash/smartbch" target="_blank">borracho.cash/smartbch</a> listings. 
              After checking it out feel free to use the <button id="button-clear-all" type="button" class="btn btn-danger btn-sm py-0" style="font-size: 0.75rem;">Clear</button> button in the left sidebar (or header on mobile) to see 
              a list off all projects. You can also use the <i style="color: #07a159;">search bar</i> to search for a variety of project names, types, 
              socials, developers, or basically anything that is displayed on each project's card. Finally, check out the filters 
              to find a specifc project type, a list of projects with certain social channels, or a variety of quick filters such as audited or newly listed projects.</h5>
              <small class="text-muted float-right">Share this page: ${copyButtonHTML}</small>
              </div></div>`;
      html += buildProjectCard(specificProject);
    } else if (routeKeywords) {
      html += `<div class="card mb-3 mr-1"><div class="card-body"><h5 style="text-align:left;">This is a specific search from the <a href="https://borracho.cash/smartbch" target="_blank">borracho.cash/smartbch</a> listings. 
                After checking it out feel free to use the <button id="button-clear-all" type="button" class="btn btn-danger btn-sm py-0" style="font-size: 0.75rem;">Clear</button> button in the left sidebar (or header on mobile) to see 
                a list off all projects. You can also use the <i style="color: #07a159;">search bar</i> to search for a variety of project names, types, 
                socials, developers, or basically anything that is displayed on each project's card. Finally, check out the filters 
                to find a specifc project type, a list of projects with certain social channels, or a variety of quick filters such as audited or newly listed projects.</h5>
                <small class="text-muted float-right">Share this page: ${copyButtonHTML}</small>
                </div></div>`;
      let index = 0;
      projects.forEach((project) => {
        html += buildProjectCard(project, index);
        ++index;
      });
    } else {
      let index = 0;
      projects.forEach((project) => {
        html += buildProjectCard(project, index);
        ++index;
      });
    }
  }

  html += Element.floatingButtonHTML;

  Element.content.innerHTML = html;
  Element.contentSidebar.innerHTML = sidebarHTML;

  // if searched/specific
  if (document.getElementById("copy-button")) {
    document.getElementById("copy-button").addEventListener("click", () => {
      copyTextToClipboard(window.location.href, "copy-button");
      setTimeout(function () {
        $("#copy-button").popover("hide");
      }, 1000);
    });
  }

  // Notification badges
  const filterNotificationBadge = document.getElementById(
    "filter-notification-badge"
  );
  filterNotificationBadge.style.display = "none";
  const searchNotificationBadge = document.getElementById(
    "search-notification-badge"
  );
  searchNotificationBadge.style.display = "none";

  document.getElementById("type-check-form").innerHTML = typeChecksHTML;
  document.getElementById("socials-check-form").innerHTML = socialsChecksHTML;
  if (!specificProject) {
    document.getElementById("project-count").innerHTML = projects.length;
  } else {
    document.getElementById("project-count").innerHTML = 1;
  }
  document.getElementById("button-filter").addEventListener("click", () => {
    filterResults(
      specificProject,
      filterNotificationBadge,
      searchNotificationBadge
    );
  });
  document
    .getElementById("button-add-smartBCH")
    .addEventListener("click", () => {
      addSmartBCHChain();
    });

  // Searching
  document.getElementById("form-search").addEventListener("submit", (e) => {
    e.preventDefault();
    const keywords = e.target.searchKeywords.value.trim().toLowerCase();
    if (
      document.getElementById("collapseSidebar1").classList.contains("show")
    ) {
      searchResults(keywords, false, false);
    } else {
      searchResults(keywords, false, true);
    }
  });

  document
    .getElementById("button-filter-clear")
    .addEventListener("click", () => {
      clearResults();
    });
  document.getElementById("collapse-button").addEventListener("click", () => {
    collapseSidebar();
  });
  document.getElementById("floating-button").addEventListener("click", () => {
    Util.scrollToTop();
  });

  // Clear empty search
  if (routeKeywords == "search=") {
    clearResults();
  }

  if (filterArray && filterArray.length > 0) {
    filterArray.forEach((filter) => {
      document.getElementById(`checkbox-${decodeURI(filter)}`).checked = true;
    });
    specificProject = null;
    filterResults(
      specificProject,
      filterNotificationBadge,
      searchNotificationBadge
    );
  } else {
    clearCheckboxes();
  }

  // When the user scrolls, show the button
  Element.content.onscroll = function () {
    scrollFunction();
  };
  Element.contentSidebar.onscroll = function () {
    scrollFunction();
  };
  Element.mainContent.onscroll = function () {
    scrollFunction();
  };
  document.body.addEventListener("scroll", function () {
    scrollFunction();
  });
  function scrollFunction() {
    if (
      Element.content.scrollTop > 20 ||
      Element.contentSidebar.scrollTop > 20 ||
      Element.mainContent.scrollTop > 20 ||
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById("floating-button").style.display = "table";
      document.getElementById("floating-button-span").style.display =
        "table-cell";
    } else {
      document.getElementById("floating-button").style.display = "none";
      document.getElementById("floating-button-span").style.display = "none";
    }
  }

  if (scrollTop) {
    Util.scrollToTop();
  } else {
    Element.content.scrollTo(0, 0);
  }

  if (isCollapsed) {
    document.getElementById("collapseSidebar1").classList.remove("show");
    document.getElementById("collapseSidebar2").classList.remove("show");
    document.getElementById("collapse-button").innerHTML = "Expand Sidebar";
  }

  // Change placeholder when routed search
  if (
    routeKeywords &&
    routeKeywords != "search=" &&
    filterArray.length == 0 &&
    !specificProject
  ) {
    document.getElementById("input-search").value = routeKeywords;
    searchNotificationBadge.style.display = "flex";
  }

  if (Auth.currentUser) {
    Auth.authStateChangeObserver(Auth.currentUser);
  }

  const collapseButton = document.getElementById("collapse-button");
  if (window.getComputedStyle(collapseButton).display === "none") {
    document.getElementById("collapseSidebar1").classList.add("show");
    document.getElementById("collapseSidebar2").classList.add("show");
  }

  addAdminButtons();
  addShareButtons(specificProject);

  if (document.getElementById("button-clear-all")) {
    document
      .getElementById("button-clear-all")
      .addEventListener("click", () => {
        clearResults();
      });
  }
}

function addAdminButtons() {
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
}

function addShareButtons(specificProject) {
  // Share buttons
  const shareButtons = document.getElementsByClassName("form-share-project");
  for (const element of shareButtons) {
    if (specificProject) {
      element.style.display = "none";
    }
    element.addEventListener("submit", async (e) => {
      e.preventDefault();
      await shareProject(e.target.name.value);
    });
  }
}

function buildProjectCard(project, index) {
  let dyorTag = "";
  if (project.dyor) {
    dyorTag += `<div class="inline padding-left"><span class="badge badge-danger">!!--DYOR--!!</span></div>`;
  }
  let upcomingTag = "";
  if (project.upcoming) {
    upcomingTag += `<div class="inline padding-left"><span class="dark-mode badge badge-light">Upcoming/Planned</span><span class="light-mode badge badge-dark">Upcoming/Planned</span></div>`;
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

  let specialWarningText = "";
  if (project.special_warning) {
    specialWarningText = `<div class="m-2 py-1 px-1 badge badge-danger flashing-warning" style="text-align: center; align-items: center; font-size: 1.25rem; display: flex; justify-content: space-around;" role="alert">
                            <i class="material-icons-outlined" style="vertical-align: middle;">warning</i>
                            <i class="material-icons-outlined" style="vertical-align: middle;">warning</i>
                            <i class="material-icons-outlined" style="vertical-align: middle;">warning</i>
                            <div>${project.special_warning.toUpperCase()}</div>
                            <i class="material-icons-outlined" style="vertical-align: middle;">warning</i>
                            <i class="material-icons-outlined" style="vertical-align: middle;">warning</i>
                            <i class="material-icons-outlined" style="vertical-align: middle;">warning</i>
                          </div>`;
  }

  return `
          <div class="card mb-2 mr-1">
            <div class="card-header px-2 py-2" style="vertical-align: middle;">
              <div class="p-0 inline" style="vertical-align: middle;"><a href=${
                project.site
              } target="_blank"><h4 class="inline px-2 ignore-hyper-color" style="vertical-align: middle;">${
    project.name
  }</h4></a><h6 class="inline" style="vertical-align: middle;">${listingTag}${upcomingTag}${dyorTag}${auditTag}</h6></div>
              <div class="inline pr-2 float-right" style="vertical-align: middle;">
                <h6 class="text-muted inline">${typesText}</h6>
                <form class="form-share-project inline" method="post">
                  <input type="hidden" name="name" value="${project.name}">
                  <button class="material-icons-outlined padding-left button-clear" style="font-size: 1.75em; vertical-align: -0.25em;" type="submit">share</button>
                </form>
              </div>
            </div>
            ${specialWarningText}
            <div class="py-2 card-body flex-container">
              <div class="mr-3 pb-2" style="flex: 10%; text-align: center;">
                <span class="vertical-center-helper"></span><a href=${
                  project.site
                } target="_blank"><img class="shaking-image" src="${
    project.logo_path
  }" alt="Project logo" style="max-height: 8rem; max-width: 100%; padding: 5px;" /></a>
              </div>
              <div style="flex: 75%">
                <div class="px-3 py-2 mb-2 alert alert-custom">
                  <h6 class="py-1 m-0 alert-heading" style="vertical-align: middle;">Description:</h6>
                  <hr class="my-2" />
                  <p class="mb-3">${descriptionText}</p>
                  <p class="mb-2 text-muted">"${quoteText}"</p>
                </div>
                <div class="px-3 py-2 mb-2 alert alert-custom">
                  <h6 class="py-1 m-0 alert-heading" style="vertical-align: middle;">My two sats:</h6>
                  <hr class="my-2" />
                  <p class="mb-2">${myThoughtsText}</p>
                </div>
              </div>
              <div class="ml-2 pb-2 flex-container" style="flex: 15%; text-align: right; height 100%; margin: 5px; flex-direction: column; justify-content: space-between">
                <div class="pb-1">
                  <h5 class="m-1">Socials:</h5>
                  ${socialsHTML}
                </div>
                <div class="pb-1">
                  <h5 class="m-1">Helpful Links:</h5>
                  <p class="m-1">${helpfulLinksText}</p>
                </div>
                <div class="pb-1">
                  <h5 class="m-1">Added:</h5>
                  <p class="m-1">${new Date(
                    project.timestamp.toDate()
                  ).toDateString()}</p>
                </div>
                <div class="pb-1">
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
            </div>
          </div>`;
}

function buildCheckboxesForTypes(label, index) {
  return `<div class="form-check-type inline padding-right-large">
            <input class="form-check-type-input" type="checkbox" value="" id="checkbox-${label.toLowerCase()}">
            <label class="form-check-type-label" for="checkbox-${label.toLowerCase()}">
              ${label}
            </label>
          </div>`;
}

function buildCheckboxesForSocials(label, index) {
  return `<div class="form-check-social inline padding-right-large">
            <input class="form-check-social-input" type="checkbox" value="" id="checkbox-${label.toLowerCase()}">
            <label class="form-check-social-label" for="checkbox-${label.toLowerCase()}">
              ${label}
            </label>
          </div>`;
}

function buildSocials(project) {
  let html = `<div class="m-1 sibling-fade">`;
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
    html += `<a href="${project.socials["read"]}" target="_blank"><img class="light-mode" src="./images/read_dark.png" alt="Read logo" style="height: 2em; padding: 5px" /></a>`;
    html += `<a href="${project.socials["read"]}" target="_blank"><img class="dark-mode" src="./images/read_light.png" alt="Read logo" style="height: 2em; padding: 5px" /></a>`;
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
  if (project.socials["linktree"]) {
    html += `<a href="${project.socials["linktree"]}" target="_blank"><img src="./images/linktree.png" alt="Linktree logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["tiktok"]) {
    html += `<a href="${project.socials["tiktok"]}" target="_blank"><img class="light-mode" src="./images/tik-tok-dark.png" alt="TikTok logo" style="height: 2em; padding: 5px" /></a>`;
    html += `<a href="${project.socials["tiktok"]}" target="_blank"><img class="dark-mode" src="./images/tik-tok-light.png" alt="TikTok logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["slack"]) {
    html += `<a href="${project.socials["slack"]}" target="_blank"><img src="./images/slack.png" alt="Slack logo" style="height: 2em; padding: 5px" /></a>`;
  }
  if (project.socials["gitlab"]) {
    html += `<a href="${project.socials["gitlab"]}" target="_blank"><img src="./images/gitlab.png" alt="Gitlab logo" style="height: 2em; padding: 5px" /></a>`;
  }
  // If no socials we need to add text
  if (html == `<div class="m-1 sibling-fade">`) {
    html += `<p>None...🤷‍♂️</p>`;
  }
  html += "</div>";
  return html;
}

async function filterResults(
  specificProject,
  filterNotificationBadge,
  searchNotificationBadge
) {
  Util.popUpLoading("Loading projects...", "");

  let filterCount = 0;

  try {
    projects = await FirebaseController.getSBCHProjectList();
  } catch (error) {
    Util.popUpInfo("Error in getHomeProjectList", JSON.stringify(error));
    return;
  }

  let routeArray = [];

  document.getElementById("input-search").value = "";

  let filteredProjects = [...projects];
  let newHTML = "";
  // new_listing
  if (document.getElementById("checkbox-new").checked) {
    routeArray.push("new");
    filterCount++;
    const date = Timestamp.fromDate(new Date());
    filteredProjects = filteredProjects.filter(function (project) {
      return (
        Math.floor((date - project.timestamp) / (3600 * 24)) <
        Constant.NEW_LISTING_TIME
      );
    });
    // sort by timestamp
    filteredProjects.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }
  // audit
  if (document.getElementById("checkbox-audited").checked) {
    routeArray.push("audited");
    filterCount++;
    filteredProjects = filteredProjects.filter(function (project) {
      return Object.keys(project.audit).length != 0;
    });
  }
  // two sats
  if (document.getElementById("checkbox-mysats").checked) {
    routeArray.push("mysats");
    filterCount++;
    filteredProjects = filteredProjects.filter(function (project) {
      return project.my_thoughts != "";
    });
  }
  // DYOR
  if (document.getElementById("checkbox-dyor").checked) {
    routeArray.push("dyor");
    filterCount++;
    filteredProjects = filteredProjects.filter(function (project) {
      return project.dyor;
    });
  }
  // non-NFT
  if (document.getElementById("checkbox-non-nft").checked) {
    routeArray.push("non-nft");
    filterCount++;
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
    routeArray.push("non-dyor");
    filterCount++;
    filteredProjects = filteredProjects.filter(function (project) {
      return !project.dyor;
    });
  }
  // special warning
  if (document.getElementById("checkbox-warning").checked) {
    routeArray.push("warning");
    filterCount++;
    filteredProjects = filteredProjects.filter(function (project) {
      return project.special_warning && project.special_warning != "";
    });
  }
  // Upcoming
  if (document.getElementById("checkbox-upcoming").checked) {
    routeArray.push("upcoming");
    filterCount++;
    filteredProjects = filteredProjects.filter(function (project) {
      return project.upcoming;
    });
  }
  // non-Upcoming
  if (document.getElementById("checkbox-non-upcoming").checked) {
    routeArray.push("non-upcoming");
    filterCount++;
    filteredProjects = filteredProjects.filter(function (project) {
      return !project.upcoming;
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
    typesArray.forEach((val) => {
      val = val.toLowerCase();
      routeArray.push(val);
      filterCount++;
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
    socialsArray.forEach((val) => {
      val = val.toLowerCase();
      routeArray.push(val);
      filterCount++;
    });
  }

  if (filteredProjects.length === 0) {
    newHTML += `<h4 style="text-align:center;">No projects found with that filter!</h4>`;
  } else {
    newHTML += `<div class="card mb-3 mr-1"><div class="card-body"><h5 style="text-align:left;">This is a specific filter from the <a href="https://borracho.cash/smartbch" target="_blank">borracho.cash/smartbch</a> listings. 
                After checking it out feel free to use the <button id="button-clear-all" type="button" class="btn btn-danger btn-sm py-0" style="font-size: 0.75rem;">Clear</button> button in the left sidebar (or header on mobile) to see 
                a list off all projects. You can also use the <i style="color: #07a159;">search bar</i> to search for a variety of project names, types, 
                socials, developers, or basically anything that is displayed on each project's card. Finally, check out the filters 
                to find a specifc project type, a list of projects with certain social channels, or a variety of quick filters such as audited or newly listed projects.</h5>
                <small class="text-muted float-right">Share this page: ${copyButtonHTML}</small>
                </div></div>`;
    let index = 0;
    filteredProjects.forEach((project) => {
      newHTML += buildProjectCard(project, index);
      ++index;
    });
  }

  newHTML += Element.floatingButtonHTML;

  Element.content.scrollTo(0, 0);
  document.getElementById("project-count").innerHTML = filteredProjects.length;
  Element.content.innerHTML = newHTML;

  filterNotificationBadge.style.display = "flex";
  filterNotificationBadge.innerHTML = filterCount;
  searchNotificationBadge.style.display = "none";

  if (document.getElementById("copy-button")) {
    document.getElementById("copy-button").addEventListener("click", () => {
      copyTextToClipboard(window.location.href, "copy-button");
      setTimeout(function () {
        $("#copy-button").popover("hide");
      }, 1000);
    });
  }

  if (document.getElementById("button-clear-all")) {
    document
      .getElementById("button-clear-all")
      .addEventListener("click", () => {
        clearResults();
      });
  }

  if (Auth.currentUser) {
    Auth.authStateChangeObserver(Auth.currentUser);
  }

  addAdminButtons();
  addShareButtons(specificProject);

  document.getElementById("floating-button").addEventListener("click", () => {
    Util.scrollToTop();
  });

  if (routeArray.length != 0) {
    const joinedFilterKeys = routeArray.join("+");
    history.pushState(
      null,
      null,
      Routes.routePathname.SBCH + "#filter=" + joinedFilterKeys
    );
  }

  setTimeout(function () {
    $("#loadingoverlay").modal("hide");
  }, 500);
}

async function searchResults(keywords, scrollTop, isCollapsed) {
  clearCheckboxes();
  if (keywords === "") {
    Element.content.innerHTML = `<h4 style="text-align:center;">Please enter some search terms and try that search again!</h4> ${Element.floatingButtonHTML}`;
    document.getElementById("floating-button").addEventListener("click", () => {
      Util.scrollToTop();
    });
  } else {
    smartBCH_page(`search=${keywords}`, scrollTop, isCollapsed);
  }
}

function clearResults() {
  projects = [];
  filterArray = [];
  typeChecksHTML = "";
  socialsChecksHTML = "";
  $("#copy-button").popover("hide");
  $("#share-button").popover("hide");
  if (document.getElementById("collapseSidebar1").classList.contains("show")) {
    smartBCH_page("", false, false);
  } else {
    smartBCH_page("", false, true);
  }
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
              chainName: "SmartBCH Mainnet",
              blockExplorerUrls: [
                "https://sonar.cash",
                "https://www.smartscan.cash/",
              ],
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

function collapseSidebar() {
  if (
    document.getElementById("collapseSidebar1").classList.contains("show") &&
    document.getElementById("collapseSidebar2").classList.contains("show")
  ) {
    document.getElementById("collapse-button").innerHTML = "Expand Sidebar";
    document.getElementById("collapseSidebar1").classList.add("show");
    document.getElementById("collapseSidebar2").classList.add("show");
  } else {
    document.getElementById("collapse-button").innerHTML = "Collapse Sidebar";
    document.getElementById("collapseSidebar1").classList.remove("show");
    document.getElementById("collapseSidebar2").classList.remove("show");
  }
}

async function shareProject(name) {
  // Util.popUpLoading("One sec...", "");
  const url = `https://borracho.cash${
    Routes.routePathname.SBCH
  }#project=${encodeURI(name.toLowerCase())}`;
  Util.popUpInfo(
    `Share ${name} with someone!`,
    `<a href=${url}>Click to view ${name}'s page</a>
      <table width="100%" style="border: none;">
        <tr>
          <td  style="border: none;">
            <input readonly type="text" name="urlText" class="inline" style="width: 100%" value="${url}" />
          </td>
          <td width="1rem" style="border: none;">
            <button id="share-button" class="material-icons-outlined button-clear inline" style="vertical-align: middle;" data-toggle="popover" data-placement="top" data-content="Copied!">content_copy</button>
          </td>
        </tr>
      </table>`,
    "modal-pop-up-info"
  );
  // setTimeout(function () {
  //   $("#loadingoverlay").modal("hide");
  // }, 100);
  document.getElementById("share-button").addEventListener("click", () => {
    copyTextToClipboard(url, "share-button");
    setTimeout(function () {
      $("#share-button").popover("hide");
    }, 1000);
  });
}

function fallbackCopyTextToClipboard(text, button) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    if (msg === "successful") {
      $(`#${button}`).popover("show");
    }
  } catch (err) {
    Util.popUpInfo(
      "Error in fallbackCopyTextToClipboard",
      JSON.stringify(err),
      "modal-pop-up-info"
    );
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text, button) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text, button);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      $(`#${button}`).popover("show");
    },
    function (err) {
      Util.popUpInfo(
        "Error in copyTextToClipboard",
        JSON.stringify(err),
        "modal-pop-up-info"
      );
    }
  );
}
