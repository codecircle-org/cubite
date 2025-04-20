"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PencilIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { CldImage } from "next-cloudinary";

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleCopyPage = async (pageId: string) => {
    const response = await fetch(`/api/pages/copyPage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageId }),
    });
    const result = await response.json();
    if (result.status === 201) {
      setPages([...pages, result.newPage]);
    } else {
      setError(result.message);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    const response = await fetch(`/api/pages`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageId }),
    });
    const result = await response.json();
    if (result.status === 200) {
      setPages(pages.filter((page) => page.id !== pageId));
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    async function getPages() {
      const response = await fetch("/api/pages", {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        setPages(result.pages);
      }
    }
    getPages();
  }, []);

  return (
    <div>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pages</h1>
            <p className="mt-2">
              In the following you can see all the pages and pages you can
              manage.
            </p>
          </div>
          {pages.length > 0 && (
            <Link
              href="/admin/pages/new"
              className="h-10 w-auto btn btn-primary"
            >
              Create a Page
            </Link>
          )}
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      {pages.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Title</th>
                <th>Created</th>
                <th>Updated</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <CldImage
                            width="960"
                            height="600"
                            src={
                              page.image
                                ? page.image
                                : "photo-1715967635831-f5a1f9658880_mhlqwu"
                            }
                            sizes="100vw"
                            alt="Description of my image"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{page.title}</div>
                        <div className="text-sm opacity-50">
                          {page.sites &&
                            page.sites.map((site) => site.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{format(new Date(page.createdAt), "PPP")}</td>
                  <td>{format(new Date(page.updatedAt), "PPP")}</td>
                  <th>
                    <Link
                      className="btn btn-outline btn-ghost"
                      href={`/admin/content-authoring/page/${page.id}`}
                    >
                      <PencilIcon className="h-6 w-6 mx-auto" />
                    </Link>
                  </th>
                  {page.title !== "Index" && (
                    <th>
                      <Link
                        className="btn btn-outline btn-accent"
                        href={`/admin/pages/${page.id}`}
                      >
                        <InformationCircleIcon className="h-6 w-6 mx-auto" />
                      </Link>
                    </th>
                  )}
                  {!page.isProtected && (
                    <>
                      <td>
                        <button
                          className="btn btn-outline btn-secondary"
                          onClick={() => handleCopyPage(page.id)}
                        >
                          <DocumentDuplicateIcon className="h-6 w-6 mx-auto" />
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline btn-error"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <TrashIcon className="h-6 w-6 mx-auto" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mx-auto max-w-md sm:max-w-3xl">
          <div>
            <div className="text-center">
              <DocumentTextIcon className="h-12 w-12 mx-auto" />
              <h2 className="mt-2 text-base font-semibold leading-6">
                No page found
              </h2>
              <p className="mt-1 text-sm ">
                You don&apos;t have any pages, create one.
              </p>
              <Link
                type="button"
                className="btn btn-outline btn-ghost mt-4"
                href="/admin/pages/new"
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Create a Page
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pages;
