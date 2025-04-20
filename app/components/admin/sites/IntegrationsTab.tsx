"use client";

import React, { useState } from "react";

function IntegrationsTab({ site }: { site: Site }) {
  const [googleTagManager, setGoogleTagManager] = useState("");
  const [googleAnalytics, setGoogleAnalytics] = useState("");

  const handleGoogleAnalytics = (e) => {
    setGoogleAnalytics(e.target.value);
  };
  const handleGoogleTagManager = (e) => {
    setGoogleTagManager(e.target.value);
  };
  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Integrations"
      />
      <div role="tabpanel" className="tab-content py-10">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Google Analytics ID</span>
              </div>
              <input
                type="text"
                name="googleAnalytics"
                id="googleAnalytics"
                defaultValue={site.googleAnalytics}
                placeholder="UA-xxxxx"
                className="input input-bordered w-full max-w-xs"
                onChange={handleGoogleAnalytics}
              />
              <div className="label">
                <span className="label-text-alt"></span>
              </div>
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Google Tag Manager ID</span>
              </div>
              <input
                type="text"
                name="googleTagManager"
                id="googleTagManager"
                defaultValue={site.googleTagManager}
                placeholder="GTM-xxxxx"
                className="input input-bordered w-full max-w-xs"
                onChange={handleGoogleTagManager}
              />
              <div className="label">
                <span className="label-text-alt"></span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default IntegrationsTab;
