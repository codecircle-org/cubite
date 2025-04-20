import React from "react";
import SiteDeletion from "./SiteDeletion";

interface SiteDeletionTabProps {
    siteId: string;
    domainName: string;
    name: string;
}

function SiteDeletionTab({ siteId, domainName, name }: SiteDeletionTabProps) {

  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Danger"
      />
      <div role="tabpanel" className="tab-content py-10">
        <p>
          Deleting a site will remove all the site related data and users. You
          can also deactivate a site instead of delete it.
        </p>
        <SiteDeletion domainName={domainName} name={name} />
      </div>
    </>
  );
}

export default SiteDeletionTab;
