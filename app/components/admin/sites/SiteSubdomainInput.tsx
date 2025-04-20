"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SiteSubdomainInputProps {
  siteSubdomain: string;
  siteId: string;
  siteDomainName: string;
}

function SiteSubdomainInput({
  siteSubdomain,
  siteId,
  siteDomainName,
}: SiteSubdomainInputProps) {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState(siteSubdomain);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubdomain(`${e.target.value}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`);
  };

  const handleSubdomainUpdate = async (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    try {
      if (e.target.value.length == 0) {
        setStatus({ type: 'error', message: 'Subdomain is required' });
        return;
      }
      const cleanedSubdomain = e.target.value.replace(/^(https?:\/\/|http:\/\/|https:\/\/)/, '');
      const siteObject = {
        siteId,
        updateData: {
          domainName: `${cleanedSubdomain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
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
        router.push(`/admin/sites/${cleanedSubdomain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`);
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
          <span className="label-text">Site Subdomain</span>
        </div>
        <div className="relative flex">
          <input
            type="text"
            name="subDomain"
            id="subDomain"
            onChange={handleSubdomainChange}
            onBlur={handleSubdomainUpdate}
            defaultValue={
              siteDomainName.split(`.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`)[0]
            }
            className="input input-bordered w-full rounded-r-none"
          />
          <span className="inline-flex items-center px-3 bg-gray-200 text-gray-500 border border-l-0 border-gray-300 rounded-r-md">
            .{process.env.NEXT_PUBLIC_MAIN_DOMAIN}
          </span>
        </div>
        {status.type && (
          <div
            className={`label ${
              status.type === "success" ? "text-success" : "text-error"
            }`}
          >
            <span className={`label-text-alt ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {status.message}
            </span>
          </div>
        )}
        {!status.type && (
          <div className="label">
            <span className="label-text-alt">Subdomain of your site</span>
          </div>
        )}
      </label>
    </div>
  );
}

export default SiteSubdomainInput;
