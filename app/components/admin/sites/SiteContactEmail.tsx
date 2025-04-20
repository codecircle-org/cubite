"use client";

import React, { useState } from "react";

interface SiteContactEmailProps {
  siteContactEmail: string;
  siteId: string;
  siteDomainName: string;
}

function SiteContactEmail({ siteContactEmail, siteId, siteDomainName }: SiteContactEmailProps) {
  const [contactEmail, setContactEmail] = useState(siteContactEmail);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleContactEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactEmail(e.target.value);
  };

  const handleContactEmailUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      if (e.target.value.length == 0) {
        return;
      }

      const siteObject = {
        siteId,
        updateData: {
          contactEmail: e.target.value,
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
        setStatus({ type: 'success', message: 'Contact email updated successfully!' });
      } else {
        const errorData = await response.json();
        setStatus({ type: 'error', message: errorData.message || 'Failed to update contact email' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred while updating the contact email' });
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
          <span className="label-text">Contact Email</span>
        </div>
        <input
          type="text"
          name="contactEmail"
          id="contactEmail"
          value={contactEmail}
          placeholder="contact@example.com"
          className="input input-bordered w-full max-w-xs"
          onChange={handleContactEmailChange}
          onBlur={handleContactEmailUpdate}
        />
        {status.type && (
          <div className={`label ${status.type === 'success' ? 'text-success' : 'text-error'}`}>
            <span className={`label-text-alt ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</span>
          </div>
        )}
        {!status.type && (
          <div className="label">
          <span className="label-text-alt">an address where users receive emails from the site</span>
          </div>
        )}
      </label>
    </div>
  );
}

export default SiteContactEmail;