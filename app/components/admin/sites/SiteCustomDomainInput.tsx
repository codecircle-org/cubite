"use client";

import React, { useState } from "react";

interface SiteCustomDomainInputProps {
  siteCustomDomain: string;
  siteId: string;
  siteDomainName: string;
}

function SiteCustomDomainInput({
  siteCustomDomain,
  siteId,
  siteDomainName,
}: SiteCustomDomainInputProps) {
  const [customDomain, setCustomDomain] = useState(siteCustomDomain);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value);
  };

  const handleCustomDomainUpdate = async (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    try {
      const siteObject = {
        siteId,
        updateData: {
          customDomain: e.target.value,
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${siteDomainName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(siteObject),
        }
      );

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Site name updated successfully!",
        });
      } else {
        const errorData = await response.json();
        setStatus({
          type: "error",
          message: errorData.message || "Failed to update site name",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred while updating the site name",
      });
    }

    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatus({ type: null, message: "" });
    }, 3000);
  };

  return (
    <div className="sm:col-span-2">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Custom Domain</span>
        </div>
        <input
          type="text"
          name="customDomain"
          id="customDomain"
          onChange={handleCustomDomainChange}
          onBlur={handleCustomDomainUpdate}
          placeholder={!siteCustomDomain ? "example.com" : ""}
          defaultValue={siteCustomDomain ? siteCustomDomain : ""}
          className="input input-bordered w-full max-w-xs"
        />
        {status.type && (
          <div
            className={`label ${
              status.type === "success" ? "text-success" : "text-error"
            }`}
          >
            <span className="label-text-alt text-green-600">
              {status.message}
            </span>
          </div>
        )}
        {!status.type && (
          <div className="label">
            <span className="label-text-alt">Custom Domain of your site</span>
          </div>
        )}
      </label>
    </div>
  );
}

export default SiteCustomDomainInput;
