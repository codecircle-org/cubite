"use client";

import React, { useState, useEffect } from "react";
import RenderEditorComponents from "@/app/components/editorjsToReact/RenderEditorComponents";

interface PageProps {
  params: {
    permalink: string;
    domain: string;
  };
}

function page({ params: { permalink, domain } }: PageProps) {
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPageContent = async () => {
      // get siteId from domain
      const siteIdResponse = await fetch(`/api/getSiteId?domain=${domain}`);
      const siteIdData = await siteIdResponse.json();
      const siteId = siteIdData.siteId;
      const response = await fetch(
        `/api/getPageContentByPermalink?permalink=${permalink}&siteId=${siteId}`
      );
      const data = await response.json();
      if (data.status === 200) {
        setPageContent(data.contents.content.blocks);
        setIsLoading(false);
      }
    };
    fetchPageContent();
  }, [permalink]);
  return (
    <div className="mx-auto max-w-7xl">
      <div className="px-12 py-8">
        {isLoading ? (
          <div className="flex flex-col gap-4 h-full w-3/5 mx-auto my-36">
            <div className="skeleton h-52 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
          </div>
        ) : (
          <RenderEditorComponents blocks={pageContent} site="" />
        )}
      </div>
    </div>
  );
}

export default page;
