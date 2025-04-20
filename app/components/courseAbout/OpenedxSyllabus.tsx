"use client";

import React, { useState, useEffect } from "react";
import { decryptSecret } from "@/app/utils/secretManager";
import getOpenedxContentStructure from "@/app/utils/getOpenedxContentStructure";
import { PenLine, PlayCircle, FileText, Blocks } from "lucide-react";

const OpenedxSyllabus = ({ course, site }: { course: any; site: any }) => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSyllabus = async () => {
      // get the openedx access token
      const formData = new URLSearchParams({
        client_id: decryptSecret(site.openedxOauthClientId),
        client_secret: decryptSecret(site.openedxOauthClientSecret),
        grant_type: "client_credentials",
        token_type: "jwt",
      });
      const accessTokenResponse = await fetch(
        `${site.openedxSiteUrl}/oauth2/access_token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const accessTokenResponseJson = await accessTokenResponse.json();

      const contentStructure = await getOpenedxContentStructure(
        accessTokenResponseJson.access_token,
        site.openedxSiteUrl,
        course.externalId,
        "devops@cubite.io",
        course.id
      );
      if (contentStructure) {
        setSyllabus(contentStructure);
      }
      setLoading(false);
    };

    getSyllabus();
  }, [course, site]);

  const getUnitIcon = (unit: any) => {
    // Check if unit has child blocks
    if (unit.childBlocks && unit.childBlocks.length > 0) {
      // Priority order: problem > video > html > others
      if (
        unit.childBlocks.some((block) => block.type.toLowerCase() === "problem")
      ) {
        return <PenLine className="w-4 h-4" />;
      }
      if (
        unit.childBlocks.some((block) => block.type.toLowerCase() === "video")
      ) {
        return <PlayCircle className="w-4 h-4" />;
      }
      if (
        unit.childBlocks.some((block) => block.type.toLowerCase() === "html")
      ) {
        return <FileText className="w-4 h-4" />;
      }
    }

    // Fallback to unit's own type or default icon
    switch (unit.type.toLowerCase()) {
      case "problem":
        return <PenLine className="w-4 h-4" />;
      case "video":
        return <PlayCircle className="w-4 h-4" />;
      case "html":
        return <FileText className="w-4 h-4" />;
      default:
        return <Blocks className="w-4 h-4" />;
    }
  };

  return (
    <div className="m-24">
      <div className="mx-auto max-w-2xl sm:text-center">
        <h2 className="text-3xl text-balance font-semibold tracking-tight text-gray-900 sm:text-5xl mb-12">
        Course Overview
        </h2>
      </div>
      {loading ? (
        <div className="flex w-full flex-col gap-4">
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>

        </div>
      ) : (
        <div className="space-y-2">
          {syllabus.chapters?.map((chapter) => (
            <div
              key={chapter.id}
              className="collapse collapse-arrow border border-dashed border-base-300 bg-base-100 rounded-lg"
            >
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium flex items-center justify-between gap-2">
                {chapter.title}
              </div>
              <div className="collapse-content">
                <div className="flex flex-col gap-1 pl-2">
                  {chapter.subsections.map((subsection) => (
                    <div key={subsection.id} className="space-y-1">
                      <div className="p-2 text-sm font-medium">
                        {subsection.title}
                      </div>
                      <div className="pl-4 space-y-1">
                        {subsection.units.map((unit) => (
                          <div
                            key={unit.id}
                            className="p-2 text-sm rounded-md flex items-center gap-2"
                          >
                            {getUnitIcon(unit)}
                            <span className="flex-grow">{unit.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenedxSyllabus;
