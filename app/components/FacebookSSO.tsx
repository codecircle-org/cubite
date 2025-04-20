"use client";

import React from "react";
import { Facebook } from "lucide-react";
import { Site } from "@prisma/client";
import { useRouter } from "next/navigation";

function FacebookSSO({ site }: { site: Site }) {
    const router = useRouter();
    const handleSignIn = () => {
        const redirectDomain = process.env.NODE_ENV === "production" ? `${site.customDomain ? `https://${site.customDomain}` : `https://${site.domainName}`}` : `http://${site.domainName.split(".")[0]}.localhost:3000`;
        const scope = "email,public_profile";
        const state = JSON.stringify({
            siteId: site.id,
            redirectDomain: redirectDomain
        });

        const authorizationUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${site.ssoProviders?.facebookClientId}&redirect_uri=${redirectDomain}/api/authentication/callback/facebook&scope=${scope}&state=${state}`;
        // redirect user to the authorization url
        router.push(authorizationUrl);
    }
  return (
    <button
      className={`btn bg-[#24292e] hover:bg-[#2f363d] text-white flex items-center justify-center gap-2 w-full`}
      onClick={handleSignIn}
    >
      <Facebook className="w-5 h-5" />
      <span>Facebook</span>
    </button>
  );
}

export default FacebookSSO;
