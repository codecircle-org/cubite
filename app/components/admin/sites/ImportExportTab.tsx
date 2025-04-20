"use client";

import React, { useState } from "react";
import LiftedTab from "@/app/components/admin/sites/LiftedTab";
import { encryptSecret, decryptSecret } from '@/app/utils/secretManager';

interface Site {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  languages: string[];
  openedxSiteUrl: string;
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
  openedxLtiConsumerKey?: string;
  openedxLtiConsumerSecret?: string;
  openedxOauthClientId?: string;
  openedxOauthClientSecret?: string;
}

function ImportExportTab({ site }: { site: Site }) {
  const [openEdXURL, setOpenEdXURL] = useState<string>(site.openedxSiteUrl || "");
  const [openedxLtiConsumerKey, setOpenedxLtiConsumerKey] = useState<string>(site.openedxLtiConsumerKey || "");
  const [openedxLtiConsumerSecret, setOpenedxLtiConsumerSecret] = useState<string>(site.openedxLtiConsumerSecret || "");
  const [openedxOauthClientId, setOpenedxOauthClientId] = useState<string>(site.openedxOauthClientId || "");
  const [openedxOauthClientSecret, setOpenedxOauthClientSecret] = useState<string>(site.openedxOauthClientSecret || "");
  const [openedxCourses, setOpenedxCourses] = useState<any[]>([]);
  const [status, setStatus] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [siteUpdateMessage, setSiteUpdateMessage] = useState<string>("");
  const [siteUpdateStatus, setSiteUpdateStatus] = useState<number>(0);

  const handleSyncCourses = async () => {
    try {
      // Encode the URL parameters
      const encodedUrl = encodeURIComponent(openEdXURL);
      const encodedSiteId = encodeURIComponent(site.id);

      const response = await fetch(
        `/api/upsertOpenedxCourses?openedxUrl=${encodedUrl}&siteId=${encodedSiteId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setOpenedxCourses(data.result.results || []);
        setMessage(`${data.result.message}`);
        setStatus(200);
        const siteUpdateResponse = await fetch(`/api/site/${site.domainName}`, {
          method: "PUT",
          body: JSON.stringify({
            siteId: site.id,
            updateData: {
              openedxSiteUrl: openEdXURL,
            },
          }),
        });
      } else {
        setMessage(data.message || "Failed to sync courses");
        setStatus(data.status || 500);
      }
    } catch (error) {
      setMessage(`Error syncing courses`);
      setStatus(500);
    }
  };

  const handleOpenEdXURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      let url = e.target.value;
      if (url.endsWith("/")) {
        url = url.slice(0, -1);
      }
      if (!url.includes("http://") && !url.includes("https://")) {
        url = "https://" + url;
      }
      setOpenEdXURL(url);
     
    } catch (error) {
      setMessage("Invalid URL format");
      setStatus(400);
    }
  };

  const handleOpenEdxLtiConsumerKey = (e) => {
    setOpenedxLtiConsumerKey(e.target.value);
  };

  const handleOpenEdxLtiConsumerSecret = (e) => {
    setOpenedxLtiConsumerSecret(e.target.value);
  };

  const handleOpenEdxOauthClientId = (e) => {
    setOpenedxOauthClientId(e.target.value);
  };

  const handleOpenEdxOauthClientSecret = (e) => {
    setOpenedxOauthClientSecret(e.target.value);
  };

  const handleUpdateSite = async () => {
    const response = await fetch(`/api/site/${site.domainName}`, {
      method: "PUT",
      body: JSON.stringify({
        siteId: site.id,
        updateData: {
          openedxLtiConsumerKey: encryptSecret(openedxLtiConsumerKey),
          openedxLtiConsumerSecret: encryptSecret(openedxLtiConsumerSecret),
          openedxOauthClientId: encryptSecret(openedxOauthClientId),
          openedxOauthClientSecret: encryptSecret(openedxOauthClientSecret),
        },
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setSiteUpdateMessage(data.message || "Site updated successfully");
      setSiteUpdateStatus(200);;
    } else {
      setSiteUpdateMessage(data.message || "Failed to update site");
      setSiteUpdateStatus(data.status || 500);
    }
    setTimeout(() => {
      setSiteUpdateMessage("");
      setSiteUpdateStatus(0);
    }, 1000);
  };

  return (
    <>
      <LiftedTab tabName="Import">
        <h3 className="text-2xl font-bold uppercase">Open edX</h3>
        <div className="mt-4 flex gap-x-2">
          {/* Open edX URL input */}
          <div className="">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">
                  What is your existing Open edX site URL?
                </span>
              </div>
              <input
                type="text"
                placeholder="edx.org"
                className="input input-bordered w-full max-w-xs"
                name="openEdXURL"
                onChange={handleOpenEdXURL}
                value={openEdXURL || ""}
              />
              <div className="label">
                {status === 0 && (
                  <span className="label-text-alt">
                    Please make sure the site is accessible
                  </span>
                )}
                {status === 400 && (
                  <span className="label-text-alt text-error">{message}</span>
                )}
                {status === 500 && (
                  <span className="label-text-alt text-error">{message}</span>
                )}
                {status === 200 && (
                  <span className="label-text-alt text-green-600">{message}</span>
                )}
              </div>
            </label>
          </div>

          <div className="mt-5">
            <button
              className={`btn btn-outline btn-primary mt-4 ${
                !openEdXURL ? "btn-disabled" : ""
              }`}
              onClick={handleSyncCourses}
              disabled={!openEdXURL}
            >
              Sync Courses
            </button>
          </div>
        </div>
        {/* Integration Setup */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <p className="text-xl font-bold uppercase col-span-full mb-4">Integration Setup</p>
          {/* Alert */}
          {siteUpdateMessage && (
            <div role="alert" className="alert col-span-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
              <span>{siteUpdateMessage}</span>
            </div>
          )}
          {/* Consumer Key */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Consumer Key</span>
            </div>
            <input type="password" className="input input-bordered" defaultValue={openedxLtiConsumerKey} onChange={handleOpenEdxLtiConsumerKey} placeholder="xxxxxxx"/>
            <div className="label">
              <span className="label-text-alt">LTI Consumer Key</span>
            </div>
          </label>
          {/* Consumer Secret */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Consumer Secret</span>
            </div>
            <input type="password" className="input input-bordered" defaultValue={openedxLtiConsumerSecret} onChange={handleOpenEdxLtiConsumerSecret} placeholder="xxxxxxx" />
            <div className="label">
              <span className="label-text-alt">LTI Consumer Secret</span>
            </div>
          </label>
          {/* Oauth Client Id */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">OAuth Client Id</span>
            </div>
            <input type="password" className="input input-bordered" type="password" defaultValue={openedxOauthClientId} onChange={handleOpenEdxOauthClientId} placeholder="xxxxxxx"/>
            <div className="label">
              <span className="label-text-alt">JWT OAuth Provider Client Id</span>
            </div>
          </label>
          {/* Oauth Client Secret */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">OAuth Client Secret</span>
            </div>
            <input type="password" className="input input-bordered" defaultValue={openedxOauthClientSecret} onChange={handleOpenEdxOauthClientSecret} placeholder="xxxxxxx"  />
            <div className="label">
              <span className="label-text-alt">JWT OAuth Provider Client Secret</span>
            </div>
          </label>
          <div className="col-span-full">
            <button className="btn btn-primary mt-4" onClick={handleUpdateSite}>
              Save Integration Values
            </button>
          </div>
        </div>
      </LiftedTab>
    </>
  );
}

export default ImportExportTab;
