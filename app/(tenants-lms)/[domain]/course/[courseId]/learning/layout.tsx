"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/app/components/openedx/navigation";
import { useSession } from "next-auth/react";
import { decryptSecret } from "@/app/utils/secretManager";
import { PanelTopOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import getOpenedxContentStructure from "@/app/utils/getOpenedxContentStructure";
import { useParams } from "next/navigation";

export default function LearningPage({
  children,
  params: { courseId, domain },
}: {
  children: React.ReactNode;
  params: { courseId: string; domain: string };
}) {
  const { data: session } = useSession();
  const [site, setSite] = useState<any>(null);
  const [blocks, setBlocks] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [course, setCourse] = useState({});
  const [courseStructure, setCourseStructure] = useState({});
  const [openedxAccessToken, setOpenedxAccessToken] = useState("");
  const [openedxUrl, setOpenedxUrl] = useState("");
  const [lastVisitedContent, setLastVisitedContent] = useState<string | null>(
    null
  );
  const [adjacentUnits, setAdjacentUnits] = useState<{
    prevUnit: any;
    nextUnit: any;
  }>({ prevUnit: null, nextUnit: null });
  const { blockId } = useParams();

  useEffect(() => {
    const getSiteData = async () => {
      const siteDataResponse = await fetch(
        `/api/getSitePublicData?domainName=${domain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
      );
      const siteData = await siteDataResponse.json();
      setSite(siteData.site);
      // get the openedx access token
      const formData = new URLSearchParams({
        client_id: decryptSecret(siteData.site.openedxOauthClientId),
        client_secret: decryptSecret(siteData.site.openedxOauthClientSecret),
        grant_type: "client_credentials",
        token_type: "jwt",
      });
      const accessTokenResponse = await fetch(
        `${siteData.site.openedxSiteUrl}/oauth2/access_token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const accessTokenResponseJson = await accessTokenResponse.json();
      setOpenedxAccessToken(accessTokenResponseJson.access_token);
    };
    getSiteData();
  }, []);

  useEffect(() => {
    const getCourseAttributes = async () => {
      if (!openedxAccessToken || !site || !session) return;
      // get course attributes from the cubite api
      const courseAttributesApiUrl = `${
        process.env.NODE_ENV === "development" ? "http://" : "https://"
      }${domain}.${
        process.env.NEXT_PUBLIC_ROOT_URL_WITHOUT_PROTOCOL
      }/api/course/${courseId}`;
      const coursesResponse = await fetch(courseAttributesApiUrl);
      const coursesData = await coursesResponse.json();
      setCourseName(coursesData.course.name);
      setCourse(coursesData.course);

      // get the openedx course outline
      const openedxUrl = site.openedxSiteUrl;
      setOpenedxUrl(openedxUrl);

      const courseStructureData = await getOpenedxContentStructure(
        openedxAccessToken,
        openedxUrl,
        coursesData.course.externalId,
        session?.user?.email,
        courseId
      );
      setCourseStructure(courseStructureData);
    };
    getCourseAttributes();
  }, [openedxAccessToken, site, courseId, session]);

  // Add function to handle last visited content updates
  const handleLastVisitedContent = async (unitId: string) => {
    const lastVisitedContentResponse = await fetch(
      "/api/last-visited-content",
      {
        method: "POST",
        body: JSON.stringify({
          courseId,
          lastVisitedContent: unitId,
          siteId: site?.id,
        }),
      }
    );
    const lastVisitedContent = await lastVisitedContentResponse.json();
    setLastVisitedContent(lastVisitedContent.lastVisitedContent);
    // Refresh content structure
    if (openedxAccessToken && site && session?.user?.email) {
      const updatedCourseStructure = await getOpenedxContentStructure(
        openedxAccessToken,
        openedxUrl,
        course.externalId,
        session.user.email,
        courseId
      );
      setCourseStructure(updatedCourseStructure);
    }
  };

  // Update effect to find adjacent units when blockId changes
  useEffect(() => {
    if (!courseStructure?.chapters) return;

    // Decode the blockId from the URL since it might be encoded
    const decodedBlockId = blockId ? decodeURIComponent(blockId as string) : null;

    // Flatten all units into a single array while maintaining order
    const allUnits = courseStructure.chapters.flatMap((chapter: any) =>
      chapter.subsections.flatMap((subsection: any) => subsection.units)
    );

    if (!decodedBlockId) {
      // If there's no blockId, set the next unit to the first unit
      setAdjacentUnits({
        prevUnit: null,
        nextUnit: allUnits.length > 0 ? allUnits[0] : null,
      });
    } else {
      // Find current unit index using decoded blockId
      const currentIndex = allUnits.findIndex((unit: any) => unit.id === decodedBlockId);

      if (currentIndex !== -1) {
        setAdjacentUnits({
          prevUnit: currentIndex > 0 ? allUnits[currentIndex - 1] : null,
          nextUnit: currentIndex < allUnits.length - 1 ? allUnits[currentIndex + 1] : null,
        });
      }
    }
  }, [blockId, courseStructure]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="course-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Page content */}
        <div className="flex items-center justify-start px-6 py-4 lg:hidden">
          <label
            htmlFor="course-drawer"
            className="btn btn-square btn-ghost drawer-button"
          >
            <PanelTopOpen className="text-secondary w-8 h-8" />
          </label>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-start justify-start w-full gap-4 border border-dashed border-base-300 rounded-lg px-8 py-4">
            <h1 className="text-lg font-medium antialiased">{courseName}</h1>
            <div className="flex items-start justify-start gap-4 ">
              <Link
                href={`/course/${course.id}/tools/progress`}
                className="hover:text-secondary hover:bg-transparent text-base tracking-wide font-light"
              >
                Progress
              </Link>
              {/* <Link
                href={`/course/${course.id}/tools/bookmarks`}
                className="hover:text-secondary hover:bg-transparent text-base tracking-wide font-light"
              >
                Bookmarks
              </Link> */}
            </div>
          </div>
                  {/* Navigation bar with prev/next buttons */}
        <nav className="flex justify-between items-center py-4 my-4">
          <div className="flex items-center gap-2">
            <Link
              href={adjacentUnits.prevUnit ? `/course/${courseId}/learning/block/${adjacentUnits.prevUnit.id}` : '#'}
              className={`btn btn-sm btn-outline gap-2 ${!adjacentUnits.prevUnit ? 'btn-disabled' : ''}`}
              onClick={() => {
                if (adjacentUnits.prevUnit) {
                  handleLastVisitedContent(adjacentUnits.prevUnit.id);
                }
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Link>

            <Link
              href={adjacentUnits.nextUnit ? `/course/${courseId}/learning/block/${adjacentUnits.nextUnit.id}` : '#'}
              className={`btn btn-sm btn-outline gap-2 px-6 ${!adjacentUnits.nextUnit ? 'btn-disabled' : ''}`}
              onClick={() => {
                if (adjacentUnits.nextUnit) {
                  handleLastVisitedContent(adjacentUnits.nextUnit.id);
                }
              }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
          <div className="">{children}</div>
        </div>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="course-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="bg-base-100 min-h-full shadow-md">
          {courseStructure && Object.keys(courseStructure).length > 0 && (
            <Navigation
              courseStructure={courseStructure}
              siteId={site?.id}
              openedxAccessToken={openedxAccessToken}
              openedxUrl={site.openedxSiteUrl}
              openedxCourseId={course.externalId}
              courseId={courseId}
              currentBlockId={blockId as string}
            />
          )}
        </div>
      </div>
    </div>
  );
}
