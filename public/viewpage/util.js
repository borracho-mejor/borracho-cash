import * as Element from "./element.js";

export function scrollToTop() {
  Element.content.scrollTo(0, 0);
  window.scrollTo(0, 0);
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
