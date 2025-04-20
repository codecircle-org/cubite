import SiteLayoutHeader from "./SiteLayoutHeader";
import SiteLayoutFooter from "./SiteLayoutFooter";
import SiteLayoutTheme from "./SiteLayoutTheme";
import SiteCustomCss from "./SiteCustomCss";
function LayoutTab({ site }: { site: Site }) {
  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Layout"
      />
      <div role="tabpanel" className="tab-content py-10">
        <SiteLayoutHeader site={site} />
        <SiteLayoutFooter site={site} />
        <SiteLayoutTheme site={site} />
        <SiteCustomCss site={site} />
      </div>
    </>
  );
}

export default LayoutTab;
