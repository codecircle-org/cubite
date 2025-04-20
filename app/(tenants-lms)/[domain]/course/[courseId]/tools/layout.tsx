"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function ToolsLayout({
  params,
  children,
}: {
  params: { courseId: string };
  children: React.ReactNode;
}) {
  const courseId = params.courseId;
  const [courseProgress, setCourseProgress] = useState({});
  const [course, setCourse] = useState({});
  const [site, setSite] = useState("");
  const [lastVisitedContent, setLastVisitedContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCourseData = async () => {
      const courseResponse = await fetch(`/api/course/${courseId}`);
      const courseData = await courseResponse.json();
      setCourse(courseData.course);
      setIsLoading(false);
    };
    const getLastVisitedContent = async () => {
      const lastVisitedContentResponse = await fetch(
        `/api/last-visited-content?courseId=${courseId}`
      );
      const lastVisitedContentData = await lastVisitedContentResponse.json();
      setLastVisitedContent(lastVisitedContentData.lastVisitedContent);
    };
    getCourseData();
    getLastVisitedContent();
  }, [courseId]);

  useEffect(() => {
    const getSite = async () => {
      const siteResponse = await fetch(
        `/api/getSitePublicData?domainName=${params.domain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
      );
      const siteData = await siteResponse.json();
      setSite(siteData.site);
    };
    getSite();
  }, [params.domain]);


  return (
    <>
      {isLoading ? (
        <div className="p-6">
          <div className="flex flex-col items-start justify-start w-full gap-4 border border-dashed border-base-300 rounded-lg px-8 py-4">
            <div className="skeleton h-4 w-1/3"></div>
            <div className="flex items-start justify-start gap-4 ">
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-4 w-24"></div>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col items-start justify-start w-full gap-4 border border-dashed border-base-300 rounded-lg px-8 py-4">
            <Link
              href={`/course/${course.id}/learning/block/${lastVisitedContent}`}
              className="text-3xl font-light hover:text-secondary"
            >
              {course.name}
            </Link>
            <div className="flex items-start justify-start gap-4 ">
              <Link
                href={`/course/${course.id}/tools/progress`}
                className="hover:text-secondary hover:bg-transparent text-base tracking-wide font-light disabled"
              >
                Progress
              </Link>
            </div>
          </div>
            {children}
        </div>
      )}
    </>
  );
}

export default ToolsLayout;