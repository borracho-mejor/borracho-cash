import * as Element from "./element.js";

export function popUpInfo(title, body, closeModal) {
  if (closeModal) {
    $("#" + closeModal).modal("hide");
  }
  Element.popUpInfoTitle.innerHTML = title;
  Element.popUpInfoBody.innerHTML = body;
  $("#modal-pop-up-info").modal("show");
}

export function popUpLoading(header, footer, closeModal) {
  if (closeModal) {
    $("#" + closeModal).modal("hide");
  }
  Element.loadingModalHeader.innerHTML = header;
  Element.loadingModalFooter.innerHTML = footer;
  $("#loadingoverlay").modal("show");
}

export function disableButton(button) {
  button.disabled = true;
  const label = button.innerHTML;
  button.innerHTML = "Wait...";
  return label;
}

export function enableButton(button, label) {
  if (label) {
    button.innerHTML = label;
    button.disabled = false;
  }
}

export function scrollToTop() {
  Element.content.scrollTo(0, 0);
  Element.contentSidebar.scrollTo(0, 0);
  window.scrollTo(0, 0);
  document.body.scrollTo(0, 0);
}

export function hideTwitterFeeds() {
  Element.twitterFeedDark.classList.add("hidden");
  Element.twitterFeedLight.classList.add("hidden");
}

export function showTwitterFeeds() {
  Element.twitterFeedDark.classList.remove("hidden");
  Element.twitterFeedLight.classList.remove("hidden");
}

export function hideHeader() {
  Element.contentSidebar.classList.add("hidden");
}

export function showHeader() {
  Element.contentSidebar.classList.remove("hidden");
}

export function unActivateLinks() {
  const navItems = document.getElementsByClassName("nav-link");
  for (const link of navItems) {
    link.classList.remove("active");
  }
}
