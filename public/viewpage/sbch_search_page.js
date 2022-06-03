import * as Routes from "../controller/routes.js";
import { smartBCH_page } from "./smartBCH_page.js";

export async function sbch_search_page(routeKeywords) {
  console.log(routeKeywords);
  const keywordsArray = routeKeywords.toLowerCase().match(/\S+/g);
  const joinedSearchKeys = keywordsArray.join("+");
  history.pushState(
    null,
    null,
    Routes.routePathname.SBCH_SEARCH + "#" + joinedSearchKeys
  );
  smartBCH_page(routeKeywords);
}
