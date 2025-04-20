"use client";

import React, { useState, useEffect } from "react";
import SiteSignin from "@/app/components/SiteSignin";

interface Props {
  params: {
    domain: string;
  };
}

const SignIn = ({ params: { domain } }: Props) => {
  const [site, setSite] = useState({});
  useEffect(() => {
    async function getSites() {
      const response = await fetch(`/api/getSitesPublicData`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        const siteData = result.sites.find(
          (s) =>
            s.domainName.split(`.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`)[0] ===
            domain
        );
        setSite(siteData);
      }
    }
    getSites();
  }, [domain]);
  return <SiteSignin siteId={site.id} site={site} />;
};

export default SignIn;
