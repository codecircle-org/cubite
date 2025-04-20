"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { CldImage } from "next-cloudinary";
import NavigationLinks from "@/app/components/NavigationLinks";

interface Site {
  id: string;
  createdAt: string;
  updatedAt: string;
  logo?: string;
  logoDark?: string;
  favicon?: string;
  headerLinks?: { text: string; type: string; url: string }[];
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  languages: string[];
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

function SiteLayoutHeader({ site }: { site: Site }) {
  const [logo, setLogo] = useState(site.logo || "");
  const [logoDark, setLogoDark] = useState(site.logoDark || "");
  const [favicon, setFavicon] = useState(site.favicon || "");
  const [headerLinks, setHeaderLinks] = useState(
    site.layout?.header?.headerLinks || [
      { text: "", type: "internal", url: "" },
    ]
  );
  const [logoStatus, setLogoStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [logoDarkStatus, setLogoDarkStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [FaviconStatus, setFaviconStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [navigationLinksStatus, setNavigationLinksStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isFaviconUpdating, setIsFaviconUpdating] = useState(false);
  const [isLogoUpdating, setIsLogoUpdating] = useState(false);
  const [isLogoDarkUpdating, setIsLogoDarkUpdating] = useState(false);

  const handleSiteLogo = async (imageSrc: string) => {
    if (isLogoUpdating) return;

    try {
      setIsLogoUpdating(true);
      setLogo(imageSrc);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            siteId: site.id,
            updateData: {
              logo: imageSrc,
              layout: {
                ...site.layout,
                header: {
                  ...site.layout?.header,
                },
              },
            },
          }),
        }
      );

      if (response.ok) {
        setLogoStatus({
          type: "success",
          message: "Logo updated successfully",
        });
      } else {
        setLogoStatus({
          type: "error",
          message: "Failed to update logo",
        });
      }
    } catch (error) {
      setLogoStatus({
        type: "error",
        message: "Error updating logo",
      });
    } finally {
      setIsLogoUpdating(false);
      // Clear status message after 3 seconds
      setTimeout(() => {
        setLogoStatus({ type: null, message: "" });
      }, 3000);
    }
  };

  const handleSiteLogoDark = async (imageSrc: string) => {
    if (isLogoDarkUpdating) return;

    try {
      setIsLogoDarkUpdating(true);
      setLogoDark(imageSrc);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            siteId: site.id,
            updateData: {
              logoDark: imageSrc,
              layout: {
                ...site.layout,
                header: {
                  ...site.layout?.header,
                },
              },
            },
          }),
        }
      );

      if (response.ok) {
        setLogoDarkStatus({
          type: "success",
          message: "Logo dark updated successfully",
        });
      } else {
        setLogoDarkStatus({
          type: "error",
          message: "Failed to update logo dark",
        });
      }
    } catch (error) {
      setLogoDarkStatus({
        type: "error",
        message: "Error updating logo dark",
      });
    } finally {
      setIsLogoDarkUpdating(false);
      // Clear status message after 3 seconds
      setTimeout(() => {
        setLogoDarkStatus({ type: null, message: "" });
      }, 3000);
    }
  };

  const handleSiteFavicon = async (imageSrc: string) => {
    if (isFaviconUpdating) return;

    try {
      setIsFaviconUpdating(true);
      setFavicon(imageSrc);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            siteId: site.id,
            updateData: {
              favicon: imageSrc,
              layout: {
                ...site.layout,
                header: {
                  ...site.layout?.header,
                },
              },
            },
          }),
        }
      );

      if (response.ok) {
        setFaviconStatus({
          type: "success",
          message: "Logo updated successfully",
        });
      } else {
        setFaviconStatus({
          type: "error",
          message: "Failed to update logo",
        });
      }
    } catch (error) {
      setFaviconStatus({
        type: "error",
        message: "Error updating logo",
      });
    } finally {
      setIsFaviconUpdating(false);
      // Clear status message after 3 seconds
      setTimeout(() => {
        setFaviconStatus({ type: null, message: "" });
      }, 3000);
    }
  };

  const handleHeaderLinks = async (
    links: { text: string; type: string; url: string }[]
  ) => {
    setHeaderLinks(links);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}/layout/header/links`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: site.id,
          headerLinks: links,
        }),
      }
    );
  };

  return (
    <div className="collapse collapse-arrow bg-base-200 my-2">
      <input type="radio" name="my-accordion-2" defaultChecked />
      <div className="collapse-title text-xl font-semibold">Header</div>
      <div className="collapse-content mx-4">
        <div className="flex gap-x-32">
          <div>
            <h3 className="font-medium my-2 mb-8">
              Logo
              {logoStatus.type === "success" && (
                <span className="text-xs text-green-600 ml-4">
                  Logo updated successfully
                </span>
              )}
              {logoStatus.type === "error" && (
                <span className="text-xs text-red-600 ml-4">
                  Error updating logo
                </span>
              )}
            </h3>
            <div className="mx-4">
              <CldUploadWidget
                uploadPreset="dtskghsx"
                options={{
                  multiple: false,
                  cropping: true,
                }}
                onSuccess={(results: any) => {
                  if (results?.info?.public_id) {
                    handleSiteLogo(results.info.public_id);
                  }
                }}
              >
                {({ open }) => (
                  <div className="w-16">
                    <CldImage
                      width={250}
                      height={250}
                      className={`rounded-md ${
                        isLogoUpdating ? "opacity-50" : ""
                      }`}
                      src={logo ? logo : "courseCovers/600x400_er61hk"}
                      onClick={() => !isLogoUpdating && open()}
                      alt="Site logo"
                    />
                    {isLogoUpdating && (
                      <div className="text-xs text-gray-500 mt-1">
                        Updating...
                      </div>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>
          </div>
          {/* Logo dark */}
          <div>
            <h3 className="font-medium my-2 mb-8">
              Logo Dark
              {logoDarkStatus.type === "success" && (
                <span className="text-xs text-green-600 ml-4">
                  Logo dark updated successfully
                </span>
              )}
              {logoDarkStatus.type === "error" && (
                <span className="text-xs text-red-600 ml-4">
                  Error updating logo dark
                </span>
              )}
            </h3> 
            <div className="mx-4">
              <CldUploadWidget
                uploadPreset="dtskghsx"
                options={{
                  multiple: false,
                  cropping: true,
                }}
                onSuccess={(results: any) => {
                  if (results?.info?.public_id) {
                    handleSiteLogoDark(results.info.public_id);
                  }
                }}
              >
                {({ open }) => (
                  <div className="w-16">
                    <CldImage
                      width={250}
                      height={250}
                      className={`rounded-md ${
                        isLogoDarkUpdating ? "opacity-50" : ""
                      }`}
                      src={logoDark ? logoDark : "courseCovers/600x400_er61hk"}
                      onClick={() => !isLogoDarkUpdating && open()}
                      alt="Site logo dark"
                    />
                    {isLogoDarkUpdating && (
                      <div className="text-xs text-gray-500 mt-1">
                        Updating...
                      </div>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <div>
            <h3 className="font-medium my-2 mb-8">
              Favicon
              {FaviconStatus.type === "success" && (
                <span className="text-xs text-green-600 ml-4">
                  Favicon updated successfully
                </span>
              )}
              {FaviconStatus.type === "error" && (
                <span className="text-xs text-red-600 ml-4">
                  Error updating Favicon
                </span>
              )}
            </h3>
            <div className="mx-4">
              <CldUploadWidget
                uploadPreset="dtskghsx"
                options={{
                  multiple: false,
                  cropping: true,
                }}
                onSuccess={(results: any) => {
                  if (results?.info?.public_id) {
                    handleSiteFavicon(results.info.public_id);
                  }
                }}
              >
                {({ open }) => (
                  <div className="w-16">
                    <CldImage
                      width={250}
                      height={250}
                      className={`rounded-md ${
                        isFaviconUpdating ? "opacity-50" : ""
                      }`}
                      src={favicon ? favicon : "courseCovers/600x400_er61hk"}
                      onClick={() => !isFaviconUpdating && open()}
                      alt="Site favicon"
                    />
                    {isFaviconUpdating && (
                      <div className="text-xs text-gray-500 mt-1">
                        Updating...
                      </div>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>
        <div className="divider"></div>

        <NavigationLinks
          title={"Links"}
          onLinksChange={handleHeaderLinks}
          existingLink={headerLinks}
        />
      </div>
    </div>
  );
}

export default SiteLayoutHeader;
