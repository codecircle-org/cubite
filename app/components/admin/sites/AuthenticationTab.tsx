"use client";

import React, { useState } from "react";
import RegistrationFields from "@/app/components/RegistrationFields";
import RegistrationForm from "@/app/components/admin/sites/RegistrationForm";
import LoginForm from "@/app/components/admin/sites/LoginForm";
import SocialSSO from "./SocialSSO";

interface Field {
  text: string;
  type: string;
  required: boolean;
}

interface Site {
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  languages: string[];
  extraRegistrationFields: Field[];
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

function AuthenticationTab({ site }: { site: Site }) {
  const [extraRegistrationFields, setExtraRegistrationFields] = useState<Field[]>(site.extraRegistrationFields || [
    { text: "", type: "text", required: false },
  ]);

  const handleExtraRegistrationFields = async (fields: Field[], domainName: string) => {
    setExtraRegistrationFields(fields);
    // cleanup the fields in case text is empty
    const cleanedFields = fields.filter(field => field.text.trim() !== "");

    const response = await fetch(`/api/site/${site.domainName}/extraRegistrationFields`, {
      method: "PUT",
      body: JSON.stringify({
        siteId: site.id,
        extraRegistrationFields: cleanedFields
      }),
      headers: {
        "Content-Type": "application/json"
      }

    });
  };

  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label="Authentication"
      />
      <div role="tabpanel" className="tab-content py-10">
        <div className="sm:col-span-6">
          <RegistrationForm site={site} />
          <LoginForm site={site} />
          <RegistrationFields
            title={"Extra Registration Fields"}
            onFieldChange={handleExtraRegistrationFields}
            existingFields={extraRegistrationFields}
          />
          <SocialSSO site={site} />
        </div>
      </div>
    </>
  );
}

export default AuthenticationTab;
