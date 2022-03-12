import * as HomePage from "../viewpage/home_page.js";
import * as AboutPage from "../viewpage/about_page.js";
import * as WhitepaperPage from "../viewpage/whitepaper_page.js";

export const routePathname = {
  HOME: "/",
  ABOUT: "/about",
  WHITEPAPER: "/whitepaper",
};

export const routes = [
  { pathname: routePathname.HOME, page: HomePage.home_page },
  { pathname: routePathname.ABOUT, page: AboutPage.about_page },
  { pathname: routePathname.WHITEPAPER, page: WhitepaperPage.whitepaper_page },
];

export function routing(pathname, href) {
  let uir;
  const route = routes.find((r) => r.pathname == pathname);
  if (route) {
    route.page(uir);
  } else {
    routes[0].page();
  }
}
