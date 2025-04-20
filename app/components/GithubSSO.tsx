"use client";

import React from "react";
import { Github } from "lucide-react";
import { Site } from "@prisma/client";
import { useRouter } from "next/navigation";

function GithubSSO({ site }: { site: Site }) {
    const router = useRouter();
    const handleSignIn = () => {
        const redirectDomain = process.env.NODE_ENV === "production" ? `${site.customDomain ? `https://${site.customDomain}` : `https://${site.domainName}`}` : `http://${site.domainName.split(".")[0]}.localhost:3000`;
        const authorizationUrl = `https://github.com/login/oauth/authorize?client_id=${site.ssoProviders?.githubClientId}&redirect_uri=${redirectDomain}/api/authentication/callback/github&scope=user:email`;
        // redirect user to the authorization url
        router.push(authorizationUrl);
    }
  return (
    <button
      className={`btn bg-[#24292e] hover:bg-[#2f363d] text-white flex items-center justify-center gap-2 w-full`}
      onClick={handleSignIn}
    >
      <Github className="w-5 h-5" />
      <span>Github</span>
    </button>
  );
}

export default GithubSSO;
