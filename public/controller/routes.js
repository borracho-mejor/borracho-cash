import * as HomePage from "../viewpage/home_page.js";
import * as WhitepaperPage from "../viewpage/whitepaper_page.js";
import * as SBCHPage from "../viewpage/smartBCH_page.js";
import * as LoginPage from "../viewpage/login_page.js";
import * as CashTokensPage from "../viewpage/cashTokens_page.js";

export const routePathname = {
  HOME: "/",
  WHITEPAPER: "/whitepaper",
  LOGIN: "/login",
  SBCH: "/smartbch",
  CASHTOKENS: "/cashtokens",
};

export const routes = [
  { pathname: routePathname.HOME, page: HomePage.home_page },
  { pathname: routePathname.WHITEPAPER, page: WhitepaperPage.whitepaper_page },
  { pathname: routePathname.SBCH, page: SBCHPage.smartBCH_page },
  { pathname: routePathname.LOGIN, page: LoginPage.login_page },
  { pathname: routePathname.CASHTOKENS, page: CashTokensPage.cashTokens_page },
];

export function routing(pathname, href) {
  let searchIndex = href.indexOf(routePathname.SBCH);
  let uir;
  if (searchIndex > 0) {
    const len = routePathname.SBCH.length;
    uir = href
      .substr(searchIndex + len + 1)
      .split("+")
      .join(" ");
  } else {
    searchIndex = href.indexOf(routePathname.CASHTOKENS);
    if (searchIndex > 0) {
      const len = routePathname.CASHTOKENS.length;
      uir = href
        .substr(searchIndex + len + 1)
        .split("+")
        .join(" ");
    }
  }
  const route = routes.find((r) => r.pathname == pathname);
  if (route) {
    route.page(uir);
  } else {
    routes[0].page();
  }
}
