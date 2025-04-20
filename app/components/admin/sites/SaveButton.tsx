"use client";
import React from "react";
import { useSession } from "next-auth/react";

interface Site {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    domainName: string;
    customDomain?: string;
    isActive: boolean;
    languages: string[];
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

function SaveButton({ site }: { site: Site }) {
  return (
    <div className="self-center mb-2">
      <button  className="btn btn-secondary px-8">Save</button>
    </div>
  );
}

export default SaveButton;
