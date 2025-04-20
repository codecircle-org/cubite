"use client";

import React, { useEffect, useState, useCallback } from "react";
import Editor from "@/app/components/Editor";
import Alert from "@/app/components/Alert";
import { useSession } from "next-auth/react";
import { formatDateTime } from "@/app/utils/formatDateTime";

interface Props {
  params: {
    id: string;
  };
}

interface Content {
  time: number;
  blocks: [];
  version: number;
}

const CourseAuthoring = ({ params: { id } }: Props) => {
  const [alertStatus, setStatus] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [content, setContent] = useState<Content | null>(null);
  const [changedContent, setChangedContent] = useState<Content | null>(null);
  const [pageContentVersions, setPageContentVersions] = useState([]);
  const { status, data: session } = useSession();
  const [userId, setUserId] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [page, setPage] = useState([]);
  const [siteId, setSiteId] = useState<string>("");
  const [sitePublicData, setSitePublicData] = useState<any>(null);

  const handleContentChange = useCallback((content: Content) => {
    setChangedContent(content);
    setHasUnsavedChanges(true);
  }, []);

  const handleContentSave = useCallback(async () => {
    try {
      const response = await fetch(`/api/content/page/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId: id,
          authorId: userId,
          content: changedContent ? changedContent : content,
        }),
      });
      const result = await response.json();
      setMessage(result.message);
      setStatus(result.status);
      setHasUnsavedChanges(false); // Reset unsaved changes flag after saving
    } catch (err) {
      console.log(err);
    }
  }, [changedContent, content, id, userId]);

  useEffect(() => {
    const getPageContent = async (pageId: string) => {
      const response = await fetch(`/api/content/page/${pageId}`, {
        cache: "no-store",
      });
      const result = await response.json();
      setStatus(result.status);
      setMessage(result.message);
      if (result.status === 200) {
        setContent(result.contents.content);
      }
      if (result.status === 404) {
        setStatus(0);
        setMessage("");
      }
    };

    const getUserId = async () => {
      const response = await fetch("/api/getUserById", {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        setUserId(result.id);
      }
    };

    const getPageContentVersions = async () => {
      const response = await fetch(`/api/page-content-versions/${id}`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        setPageContentVersions(result.changeLog);
      }
    };

    async function getPage() {
      const response = await fetch(`/api/page/${id}`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        setPage(result.page);
        result.page.title === "Index"
          ? setSiteId(result.page.sites[0].id)
          : setSiteId("");
      }
    }

    async function getSitePublicData() {
      const response = await fetch(`/api/getSitePublicData?siteId=${siteId}`);
      const result = await response.json();
      if (result.status === 200) {
        setSitePublicData(result.site);
      }
      if (result.status === 404) {
        setStatus(0);
        setMessage("");
      }
    }

    getPageContent(id);
    getUserId();
    getPageContentVersions();
    getPage();
    getSitePublicData();
  }, [id, siteId]);

  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        handleContentSave();
      }
    }, 180000); // Autosave every 3 minutes

    return () => clearInterval(autosaveInterval); // Cleanup interval on unmount
  }, [hasUnsavedChanges, handleContentSave]);

  return (
    <>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{page.title}</h1>
            <p className="mt-2">Write and Edit the course content</p>
          </div>
          <div className="flex items-end">
            <button
              className="btn btn-outline btn-primary px-6"
              onClick={handleContentSave}
              disabled={!hasUnsavedChanges} // Disable save button if there are no unsaved changes
            >
              Save
            </button>
            <button
              className="btn btn-outline btn-ghost mx-2"
              onClick={() => document.getElementById("change_log").showModal()}
            >
              Change log
            </button>
            <dialog id="change_log" className="modal">
              <div className="modal-box p-0">
                <ul className="menu min-h-full text-base-content p-0 list-disc">
                  <div className="text-xl font-bold bg-neutral px-4 py-8  text-gray-50">
                    Detail of Course Change
                    <p className="text-lg font-semibold text-gray-100 underline underline-offset-4">
                      #{pageContentVersions.length}
                      <span className="text-sm font-thin"> changes found</span>
                    </p>
                  </div>
                  <div className="p-2 m-4">
                    <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                      {pageContentVersions.map((version, index) => (
                        <div className="mb-8" key={index}>
                          <p className="border-b border-gray-300 text-md font-semibold">
                            #{pageContentVersions.length - index}
                          </p>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500 text-xs">
                              Updated by
                            </dt>
                            <dd className="text-gray-700">
                              {version.author.name}
                            </dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium border-b border-gray-300">
                            <dt className="text-gray-500 text-xs">
                              Updated at
                            </dt>
                            <dd className="text-gray-700">
                              {formatDateTime(version.createdAt)}
                            </dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  </div>
                </ul>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <Alert
        status={alertStatus}
        message={message}
        onClose={() => {
          setStatus(0), setMessage("");
        }}
      />
      <Editor
        savedContent={content}
        onChange={handleContentChange}
        siteId={siteId}
        siteThemeName={sitePublicData?.themeName}
      />
    </>
  );
};

export default CourseAuthoring;
