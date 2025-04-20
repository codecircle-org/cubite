"use client";

import React, { useState } from "react";
import { FaFacebookF } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { BsInstagram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import NavigationLinks from "@/app/components/NavigationLinks";

interface Site {
  id: string;
  createdAt: string;
  updatedAt: string;
  logo?: string;
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

function SiteLayoutFooter({ site }: { site: Site }) {
  const [footerLinks, setFooterLinks] = useState(
    site.layout?.footer?.footerLinks || [{ text: "", type: "internal", url: "" }]
  );
  const [facebookUrl, setFacebookUrl] = useState(
    site.layout?.footer?.socialMedia?.facebook || ""
  );
  const [tiktokUrl, setTiktokUrl] = useState(
    site.layout?.footer?.socialMedia?.tiktok || ""
  );
  const [youtubeUrl, setYoutubeUrl] = useState(
    site.layout?.footer?.socialMedia?.youtube || ""
  );
  const [instagramUrl, setInstagramUrl] = useState(
    site.layout?.footer?.socialMedia?.instagram || ""
  );
  const [xUrl, setXUrl] = useState(site.layout?.footer?.socialMedia?.x || "");
  const [copyrightText, setCopyrightText] = useState(
    site.layout?.footer?.copyrightText || `Copyright © ${new Date().getFullYear()} ${site.name}. All rights reserved.`
  );


  const handleFooterLinks = React.useCallback(async (links: FooterLink[]) => {
    setFooterLinks(links);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}/layout/footer/links`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: site.id,
          footerLinks: links,
        }),
      }
    );
  }, [site.domainName, site.id]);

  const handleFacebookURL = (e) => {
    setFacebookUrl(e.target.value);
  };

  const handleInstagramURL = (e) => {
    setInstagramUrl(e.target.value);
  };

  const handleTiktokURL = (e) => {
    setTiktokUrl(e.target.value);
  };

  const handleYoutubeURL = (e) => {
    setYoutubeUrl(e.target.value);
  };

  const handleXURL = (e) => {
    setXUrl(e.target.value);
  };

  const handleCopyright = async (e) => {
    setCopyrightText(e.target.value);
  };
  const handleCopyrightUpdate = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}/layout/footer/copyright`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: site.id,
          copyrightText,
        }),
      }
    );
  };

  const handleSocialMediaUpdate = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}/layout/footer/socialmedia`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: site.id,
          socialMedias: {
            facebook: facebookUrl,
            tiktok: tiktokUrl,
            youtube: youtubeUrl,
            instagram: instagramUrl,
            x: xUrl,
          },
        }),
      }
    );
  };

  return (
    <div className="collapse collapse-arrow bg-base-200 my-2">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title text-xl font-semibold">Footer</div>
      <div className="collapse-content mx-4">
        <NavigationLinks
          title={"Links"}
          onLinksChange={handleFooterLinks}
          existingLink={footerLinks}
        />
        <div className="divider"></div>

        <div>
          <h3 className="font-medium my-2">Social Media</h3>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead></thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <FaFacebookF className="w-6 h-6" />
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Facebook URL"
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleFacebookURL}
                      onBlur={handleSocialMediaUpdate}
                      defaultValue={facebookUrl ? facebookUrl : ""}
                    />
                  </td>
                </tr>
                {/* row 1 */}
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <FaTiktok className="w-6 h-6" />
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="TikTok URL"
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleTiktokURL}
                      onBlur={handleSocialMediaUpdate}
                      defaultValue={tiktokUrl ? tiktokUrl : ""}
                    />
                  </td>
                </tr>
                {/* row 1 */}
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <IoLogoYoutube className="w-6 h-6" />
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Youtube URL"
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleYoutubeURL}
                      onBlur={handleSocialMediaUpdate}
                      defaultValue={youtubeUrl ? youtubeUrl : ""}
                    />
                  </td>
                </tr>
                {/* row 1 */}
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <BsInstagram className="w-6 h-6" />
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Instagram URL"
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleInstagramURL}
                      onBlur={handleSocialMediaUpdate}
                      defaultValue={instagramUrl ? instagramUrl : ""}
                    />
                  </td>
                </tr>
                {/* row 1 */}
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <BsTwitterX className="w-6 h-6" />
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="X URL"
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleXURL}
                      onBlur={handleSocialMediaUpdate}
                      defaultValue={xUrl ? xUrl : ""}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="divider"></div>

        <div>
          <h3 className="font-medium my-2 mb-6">Copyright Notice</h3>
          <input
            type="text"
            placeholder={`Copyright © ${new Date().getFullYear()} ${site.name}. All rights reserved.`}
            className="input input-bordered w-full max-w-lg"
            onChange={handleCopyright}
            onBlur={handleCopyrightUpdate}
            defaultValue={copyrightText ? copyrightText : `Copyright © ${new Date().getFullYear()} ${site.name}. All rights reserved.`}
          />
        </div>
      </div>
    </div>
  );
}

export default SiteLayoutFooter;
