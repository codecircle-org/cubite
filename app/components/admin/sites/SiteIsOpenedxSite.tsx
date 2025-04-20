"use client";

import React, { useState } from 'react'

function SiteIsOpenedxSite() {
  const [isOpenedx, setIsOpenedx] = useState(false);
  const [isNewOpenedx, setIsNewOpenedx] = useState(true);
  const [openedxUrl, setOpenedxUrl] = useState("");

  return (
    <>
    <div className="form-control sm:col-span-2 justify-center">
      <label className="label cursor-pointer">
          <span className="label-text">Is this an Open edX site?</span>
          <input name="isOpenedxSite" type="checkbox" defaultChecked={isOpenedx} onChange={() => setIsOpenedx(!isOpenedx)} className="checkbox" />
      </label>
    </div>
    {
      isOpenedx && 
      <div className="form-control sm:col-span-2 justify-end">
        <label className="label cursor-pointer">
            <span className="label-text">This is a new Open edX site</span>
            <input name="isNewOpenedxSite" type="checkbox" defaultChecked={isNewOpenedx} onChange={() => setIsNewOpenedx(!isNewOpenedx)} className="checkbox" />
        </label>
      </div>
    }
    {
      isOpenedx && !isNewOpenedx && (
        <label className="form-control sm:col-span-2">
            <div className="label">
                <span className="label-text">Please enter the existing Open edX site URL</span>
            </div>
            <input name="openedxSiteUrl" type="text" placeholder="https://learn.acme.com" className="input input-bordered w-full max-w-xs" value={openedxUrl} onChange={(e) => setOpenedxUrl(e.target.value)} />
        </label>
      )
    }
    </>    
  )
}

export default SiteIsOpenedxSite