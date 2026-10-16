import { useContext, useEffect } from "react";
import { AppContext } from "../store/context";
import { uiThemeHref } from "../service/theme-service";

const THEME_LINK_ID = "company-theme";

export const useApplyCompanyTheme = () => {
  const [{ companySlugName }] = useContext(AppContext);
  const href = uiThemeHref(companySlugName.uiThemeId);

  useEffect(() => {
    let link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;

    if (!href) {
      link?.remove();
      return;
    }

    if (!link) {
      link = document.createElement("link");
      link.id = THEME_LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    if (link.getAttribute("href") !== href) {
      link.setAttribute("href", href);
    }
  }, [href]);
};
