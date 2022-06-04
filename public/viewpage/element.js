export const menuHome = document.getElementById("menu-home");
export const menuLogin = document.getElementById("menu-login");
export const menuWhitepaper = document.getElementById("menu-whitepaper");
export const menuSmartBCH = document.getElementById("menu-smartBCH");
export const menuListings = document.getElementById("menu-listings");

export const mainContent = document.getElementById("main-content");
export const content = document.getElementById("content");
export const contentSidebar = document.getElementById("content-sidebar");

export const buttonDarkMode = document.getElementById("button-dark-mode");
export const buttonLightMode = document.getElementById("button-light-mode");

export const buttonSignOut = document.getElementById("button-sign-out");

export const twitterFeedLight = document.getElementById("twitter-feed-light");
export const twitterFeedDark = document.getElementById("twitter-feed-dark");

export const formSignIn = document.getElementById("form-sign-in");

// Pop-up Info
export const popUpInfoTitle = document.getElementById(
  "modal-pop-up-info-title"
);
export const popUpInfoBody = document.getElementById("modal-pop-up-info-body");

// Pop-up loading
export const popUpLoadTitle = document.getElementById(
  "modal-pop-up-loading-title"
);
export const popUpLoadBody = document.getElementById(
  "modal-pop-up-loading-body"
);

// For add project modal
export const imageTagAddProject = document.getElementById("form-add-image-tag");
export const formAddProject = document.getElementById("form-add-sbch-project");
export const formAddProjectError = {
  name: document.getElementById("error-add-name"),
  description: document.getElementById("error-add-description"),
  twosats: document.getElementById("error-add-two-sats"),
  logo: document.getElementById("error-add-logo"),
  bias: document.getElementById("error-add-bias"),
};
export const formImageAddButton = document.getElementById(
  "form-add-image-button"
);

// For edit project modal
export const formEditImageFileButton = document.getElementById(
  "form-edit-image-button"
);
export const formEditImageTag = document.getElementById("form-edit-image-tag");
export const formEditProject = document.getElementById(
  "form-edit-sbch-project"
);
export const formEditProjectError = {
  name: document.getElementById("error-edit-name"),
  description: document.getElementById("error-edit-description"),
  twosats: document.getElementById("error-edit-two-sats"),
  logo: document.getElementById("error-edit-logo"),
  bias: document.getElementById("error-edit-bias"),
};

// For Request sBCH Project Modal
export const formRequestSBCHProject = document.getElementById(
  "form-request-sbch-project"
);

// For add card modal
export const formAddCard = document.getElementById("form-add-card");
export const formAddCardError = {
  header: document.getElementById("error-add-header"),
  body: document.getElementById("error-add-body"),
};

// For edit card modal
export const formEditCard = document.getElementById("form-edit-card");
export const formEditCardError = {
  header: document.getElementById("error-edit-header"),
  body: document.getElementById("error-edit-body"),
};

export const floatingButtonHTML = `<i id="floating-button" class="float my-float">
                              <span id="floating-button-span" class="material-icons" style="margin: auto; vertical-align: middle; display:none;">vertical_align_top</span>
                            </i>`;

// Loading modal
export const loadingModalHeader = document.getElementById(
  "modal-loading-header"
);
export const loadingModalFooter = document.getElementById(
  "modal-loading-footer"
);
