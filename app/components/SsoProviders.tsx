"use client";

import React from "react";
import { Github, Mail, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Site } from "@prisma/client";
import GithubSSO from "./GithubSSO";
import GoogleSSO from "./GoogleSSO";
import FacebookSSO from "./FacebookSSO";
export default function SsoProviders({ site }: { site: Site }) {
  const providerStyles = {
    google: {
      icon: <FcGoogle className="w-5 h-5" />,
      className:
        "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300",
    },
    github: {
      icon: <Github className="w-5 h-5" />,
      className: "bg-[#24292e] hover:bg-[#2f363d] text-white",
    },
    facebook: {
      icon: <Facebook className="w-5 h-5" />,
      className: "bg-[#4267B2] hover:bg-[#365899] text-white",
    },
    email: {
      icon: <Mail className="w-5 h-5" />,
      className: "bg-gray-800 hover:bg-gray-900 text-white",
    },
  };
  return (
    <div className="flex flex-col gap-2 w-full col-span-full">
      <div className="space-y-2">
        {site.ssoProviders?.githubClientId && <GithubSSO site={site} />}
        {site.ssoProviders?.googleClientId && <GoogleSSO site={site} />}
        {site.ssoProviders?.facebookClientId && <FacebookSSO site={site} />}
      </div>
    </div>
  );
}
