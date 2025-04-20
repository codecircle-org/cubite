"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Site } from "@prisma/client";
import { useRouter } from "next/navigation";

function GoogleSSO({ site }: { site: Site }) {
    const router = useRouter();
    const handleSignIn = () => {
        const redirectDomain = process.env.NODE_ENV === "production" ? `${site.customDomain ? `https://${site.customDomain}` : `https://${site.domainName}`}` : `http://${site.domainName.split(".")[0]}.localhost:3000`;
        const scope = "openid email profile";

        const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${site.ssoProviders?.googleClientId}&redirect_uri=${redirectDomain}/api/authentication/callback/google&scope=${scope}&response_type=code&access_type=offline`;
        // redirect user to the authorization url
        router.push(authorizationUrl);
    }
  return (
    <button
      className={`btn bg-[#24292e] hover:bg-[#2f363d] text-white flex items-center justify-center gap-2 w-full`}
      onClick={handleSignIn}
    >
      <FcGoogle className="w-5 h-5" />
      <span>Google</span>
    </button>
  );
}

export default GoogleSSO;
