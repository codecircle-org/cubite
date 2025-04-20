import React, { useState } from "react";
import SiteNameInput from "./SiteNameInput";
import SiteSubdomainInput from "./SiteSubdomainInput";
import SiteCustomDomainInput from "./SiteCustomDomainInput";
import SiteLanguagesInput from "./SiteLanguagesInput";
import SiteContactEmail from "./SiteContactEmail";
interface Site {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  languages: string[];
  isOpenedxSite: boolean;
  isNewOpenedxSite: boolean;
  openedxSiteUrl: string;
  contactEmail: string;
  admins: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
  siteRoles?: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
}

function ConfigsTab({ site }: { site: Site }) {
  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Configs"
        defaultChecked
      />
      <div role="tabpanel" className="tab-content py-10">
        <div className="space-y-12">
          <div className="pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <SiteNameInput
                siteName={site.name}
                siteId={site.id}
                siteDomainName={site.domainName}
              />
              <SiteSubdomainInput
                siteSubdomain={site.domainName}
                siteId={site.id}
                siteDomainName={site.domainName}
              />
              
              <SiteCustomDomainInput
                siteCustomDomain={site.customDomain || ""}
                siteId={site.id}
                siteDomainName={site.domainName}
              />
              <SiteContactEmail
                siteContactEmail={site.contactEmail}
                siteId={site.id}
                siteDomainName={site.domainName}
              />
              <SiteLanguagesInput
                siteLanguages={site.languages}
                siteId={site.id}
                siteDomainName={site.domainName}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfigsTab;
