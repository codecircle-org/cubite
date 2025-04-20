"use client";

import React, { useState } from "react";
import MultiSelect from "@/app/components/MultiSelect";

interface SiteLanguagesInputProps {
    siteLanguages: [];
    siteId: string;
    siteDomainName: string;
}

function SiteLanguagesInput({ siteDomainName, siteId, siteLanguages }: SiteLanguagesInputProps) {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [languages, setLanguages] = useState(siteLanguages)

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguages(e.target.value);
  };

  const handleLanguagesUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      const siteObject = {
        siteId,
        updateData: {
          languages: languages,
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
          <MultiSelect title="Languages" isRequired options={siteLanguages} />
        </label>
        {status.type && (
          <div className={`label ${status.type === 'success' ? 'text-success' : 'text-error'}`}>
            <span className="label-text-alt text-green-600">{status.message}</span>
          </div>
        )}
    </div>
  );
}

export default SiteLanguagesInput;
