"use client";

import React, { useState } from "react";

interface SiteNameInputProps {
  siteName: string;
  siteId: string;
  siteDomainName: string;
}

function SiteNameInput({ siteName, siteId, siteDomainName }: SiteNameInputProps) {
  const [name, setName] = useState(siteName);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {

      if (e.target.value.length == 0) {
        setStatus({ type: 'error', message: 'Site name is required' });
        return;
      }

      const siteObject = {
        siteId,
        updateData: {
          name: e.target.value,
        },
      };
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${siteDomainName}`,
        {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(siteObject),
        }
      );

      if (response.ok) {
        setStatus({ type: 'success', message: 'Site name updated successfully!' });
      } else {
        const errorData = await response.json();
        setStatus({ type: 'error', message: errorData.message || 'Failed to update site name' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred while updating the site name' });
    }

    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatus({ type: null, message: '' });
    }, 3000);
  };

  return (
    <div className="sm:col-span-2">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Site Name</span>
        </div>
        <input
          type="text"
          name="siteName"
          id="siteName"
          value={name}
          placeholder="Acme LMS"
          className="input input-bordered w-full max-w-xs"
          onChange={handleNameChange}
          onBlur={handleNameUpdate}
        />
        {status.type && (
          <div className={`label ${status.type === 'success' ? 'text-success' : 'text-error'}`}>
            <span className={`label-text-alt ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</span>
          </div>
        )}
        {!status.type && (
          <div className="label">
          <span className="label-text-alt">Name to show in Dashboard</span>
          </div>
        )}
      </label>
    </div>
  );
}

export default SiteNameInput;