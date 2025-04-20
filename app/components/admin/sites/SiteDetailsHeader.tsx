import React from "react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import PublishButton from "@/app/components/admin/sites/PublishButton";

interface SiteDetailsHeaderProps {
  site: Site;
}

interface Site {
  name: string;
  createdAt: string;
  updatedAt: string;
  domainName: string;
  customDomain: string;
}

function SiteDetailsHeader({site} : SiteDetailsHeaderProps) {
  const createdAt = site?.createdAt && formatDateTime(site?.createdAt);
  const updatedAt = site?.updatedAt && formatDateTime(site?.updatedAt);
  return (
    <>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{site.name}</h1>
            <p className="text-sm text-gray-500">
              Created at {createdAt}
            </p>
            <p className="text-sm text-gray-500">Updated at {updatedAt}</p>
            <div className="flex items-center gap-x-4 mt-2">
              {/* <a
                className="text-sm text-secondary link block"
                href={`https://preview.${site.domainName}`}
                target="_blank"
                rel="noopener noreferrer"
              >{`preview.${site.site.domainName}`}</a> */}
              <a
                className="text-sm text-secondary link"
                href={`https://${site.customDomain || site.domainName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.customDomain || site.domainName}
              </a>
              {process.env.NODE_ENV === "development" && (
                <a
                  className="text-sm text-ghost link"
                  href={`http://${
                    site.domainName.split(
                      `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
                    )[0]
                  }.localhost:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${
                    site.domainName.split(
                      `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
                    )[0]
                  }.localhost:3000`}
                </a>
              )}
            </div>
          </div>
          <PublishButton />
        </div>
      </div>
      <div className="border-b mb-12 ">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
    </>
  );
}

export default SiteDetailsHeader;
