"use client";

import React, { useState } from "react";
import { encryptSecret } from "@/app/utils/secretManager";
import { toast } from "react-hot-toast"

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
  stripeSecretKey?: string;
  stripePublishableKey?: string;
  stripeWebhookSecret?: string;
}

const EcommerceTab = ({ site }: { site: Site }) => {
  const [stripeSecretKey, setStripeSecretKey] = useState<string>(
    site.stripeSecretKey || ""
  );
  const [stripePublishableKey, setStripePublishableKey] = useState<string>(
    site.stripePublishableKey || ""
  );
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState<string>(
    site.stripeWebhookSecret || ""
  );

  const handleStripeSecretKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStripeSecretKey(e.target.value);
  };

  const handleStripePublishableKey = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStripePublishableKey(e.target.value);
  };

  const handleStripeWebhookSecret = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStripeWebhookSecret(e.target.value);
  };

  const handleUpdateSite = async () => {
    const response = await fetch(`/api/site/${site.domainName}`, {
      method: "PUT",
      body: JSON.stringify({
        siteId: site.id,
        updateData: {
          stripeSecretKey: stripeSecretKey,
          stripePublishableKey: encryptSecret(stripePublishableKey),
          stripeWebhookSecret: stripeWebhookSecret,
        },
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(data.message || "Site updated successfully");
    } else {
      toast.error(data.message || "Failed to update site");
    }
  };

  
  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Ecommerce"
      />
      <div role="tabpanel" className="tab-content py-10">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">To learn about how to setup Stripe for your site, please visit the <a href="https://onboarding.cubite.io/pages/how-to-setup-stripe" className="link link-primary text-info" target="_blank" rel="noopener noreferrer">Stripe Setup Guide</a>.</div>
          <div className="sm:col-span-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Stripe Secret Key</span>
              </div>
              <input
                type="password"
                className="input input-bordered"
                defaultValue={site.stripeSecretKey}
                onChange={handleStripeSecretKey}
                placeholder="xxxxxxx"
              />
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Stripe Publishable Key</span>
              </div>
              <input
                type="password"
                className="input input-bordered"
                defaultValue={site.stripePublishableKey}
                onChange={handleStripePublishableKey}
                placeholder="xxxxxxx"
              />
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Stripe Webhook Secret</span>
              </div>
              <input
                type="password"
                className="input input-bordered"
                defaultValue={site.stripeWebhookSecret}
                onChange={handleStripeWebhookSecret}
                placeholder="xxxxxxx"
              />
            </label>
          </div>
        </div>
        <div className="col-span-full">
            <button className="btn btn-primary mt-4" onClick={handleUpdateSite}>
              Save Integration Values
            </button>
          </div>
      </div>
    </>
  );
};

export default EcommerceTab;
