"use client";
import React, { useEffect, useState } from "react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import Alert from "@/app/components/Alert";
import MultiInput from "@/app/components/MultiInput";
import MultiSelect from "@/app/components/MultiSelect";
import { CldImage } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Props {
  params: {
    id: string;
  };
}

interface Page {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  isBlog: boolean;
}
interface Author {
  id: string;
  name: string;
}

const Page = ({ params: { id } }: Props) => {
  const [page, setPage] = useState<Page>();
  const [alertStatus, setStatus] = useState(0);
  const [message, setMessage] = useState("");
  const [authors, setAuthors] = useState([]);
  const [possibleAuthors, setPossibleAuthors] = useState<Author[]>([]);
  const [sites, setSites] = useState([]);
  const { status, data: session } = useSession();

  useEffect(() => {
    async function getPageData(id: string) {
      const response = await fetch(`/api/page/${id}`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        const fetchedPage = result.page;
        const authors = fetchedPage.authors.map((author) => ({
          name: author.user.name,
          id: author.user.id,
        }));
        fetchedPage.authors = authors;
        setPage(fetchedPage);
        setAuthors(authors);
        setMessage("Successfully fetched page data");
        setStatus(200);
      } else {
        setStatus(result.status);
        setMessage(result.message);
      }
    }
    async function getInstructor() {
      const response = await fetch("/api/instructors", {
        cache: "no-store",
      });
      if (response.status === 200) {
        const result = await response.json();
        const possibleInstructors = await result.instructors;
        setPossibleAuthors(possibleInstructors);
      }
    }
    async function getMysites(email: string) {
      try {
        const response = await fetch("/api/site/mysites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
          }),
        });
        const result = await response.json();
        if (result.status === 200) {
          setSites(result.sites);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getPageData(id);
    getInstructor();
    getMysites(session?.user?.email);
  }, [id, session]);

  const handleTitle = (e) => {
    page ? (page.title = e.target.value) : "";
    setPage(page);
  };

  const handleSubjects = (options) => {
    page ? (page.subjects = options) : "";
    setPage(page);
  };

  const handleTopics = (options) => {
    page ? (page.topics = options) : "";
    setPage(page);
  };

  const handlePermalink = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Create a map of site IDs to their page permalinks, excluding the current page
    const siteIdToPermalinks: { [key: string]: string[] } = {};
    sites.forEach((site: any) => {
      siteIdToPermalinks[site.name] = site.pages
        .filter((p: any) => p.id !== id) // Exclude current page
        .map((p: any) => p.permalink);
    });

    // Check if permalink is taken in any of the selected sites
    const isPermalinkTaken = Object.values(siteIdToPermalinks).some((permalinks) =>
      permalinks.includes(e.target.value)
    );

    if (isPermalinkTaken) {
      // Find which sites have the conflicting permalink
      const sitesWithPermalink = Object.keys(siteIdToPermalinks).filter((site) =>
        siteIdToPermalinks[site].includes(e.target.value)
      );
      
      toast.error("Permalink is already taken in sites: \n" + sitesWithPermalink.join("\n"));
    } else {
      // Update the page permalink if valid
      if (page) {
        setPage({ ...page, permalink: e.target.value });
      }
    }
  };

  const handleBlurb = (e) => {
    page ? (page.blurb = e.target.value) : "";
    setPage(page);
  };

  const handleAuthors = (options) => {
    page ? (page.authors = options) : "";
    setPage(page);
  };

  const handleDescription = (e) => {
    page ? (page.description = e.target.value) : "";
    setPage(page);
  };

  const handlePageImage = (imageSrc: string) => {
    if (page) {
      setPage({ ...page, image: imageSrc });
    } else {
      console.log("page not available");
    }
  };

  const handleSites = (options) => {
    page ? (page.sites = options) : "";
    setPage(page);
  };

  const handleIsBlog = (e) => {
    if (page) {
        setPage({ ...page, isBlog: e.target.checked });
    }
  };

  const handlePageUpdate = async () => {
    if (!page) return;
    const response = await fetch(`/api/page/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(page),
    });
    const result = await response.json();
    setStatus(result.status);
    setMessage(result.message);
  };

  return (
    <>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{page?.title}</h1>
            <p className="text-sm text-gray-500">
              Created at {page?.createdAt && formatDateTime(page?.createdAt)}
            </p>
            <p className="text-sm text-gray-500">
              Updated at {page?.updatedAt && formatDateTime(page?.updatedAt)}
            </p>

            <p className="mt-2">
              Fill the following information to create a new course.
            </p>
          </div>
          <div>
            <Link
              className="btn mx-2 btn-outline btn-ghost"
              href={`/admin/content-authoring/page/${id}`}
            >
              Content Authoring
            </Link>
            <button className="btn btn-primary" onClick={handlePageUpdate}>
              Save
            </button>
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
      <div>
        <div className="space-y-12">
          <div className="border-b pb-12">
            <h2 className="font-semibold leading-7 text-lg">
              Page Information
            </h2>
            <p className="mt-1 text-sm leading-6">
              Please fill this information. This is basic info after creating
              the page you can go to content authoring to add page content
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Title</span>
                  </div>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder={page?.title}
                    defaultValue={page?.title}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleTitle}
                    required={true}
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      Name to show as page title to the users
                    </span>
                  </div>
                </label>
              </div>
              <MultiInput
                title={"Subjects"}
                onChange={handleSubjects}
                preSelectedOptions={page?.subjects}
              />
              <MultiInput
                title={"Topics"}
                onChange={handleTopics}
                preSelectedOptions={page?.topics}
              />
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Permalink</span>
                  </div>
                  <input
                    type="text"
                    name="permalink"
                    id="permalink"
                    placeholder={page?.permalink}
                    defaultValue={page?.permalink}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handlePermalink}
                    required={true}
                    readOnly={page?.isProtected}
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      URL friendly identifier like "my-blog-post"
                    </span>
                  </div>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Blurb</span>
                  </div>
                  <input
                    type="text"
                    name="blurb"
                    id="blurb"
                    placeholder={page?.blurb}
                    defaultValue={page?.blurb}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleBlurb}
                    required={true}
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      Short preview/summary of this page
                    </span>
                  </div>
                </label>
              </div>
              <div className="form-control w-full sm:col-span-2 self-center">
                <label className="label cursor-pointer">
                  <span className="label-text">Is this a blog post?</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={page?.isBlog}
                    onChange={handleIsBlog}
                  />
                </label>
              </div>

              <div className="col-span-full">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Description</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder={page?.description}
                    defaultValue={page?.description}
                    onChange={handleDescription}
                  ></textarea>
                  <div className="label">
                    <span className="label-text-alt">
                      Write some description about this page
                    </span>
                  </div>
                </label>
              </div>
              {page && (
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
                    <div className="text-center">
                      {page?.image && (
                        <CldImage
                          width={500}
                          height={500}
                          src={page.image}
                          alt="Description of my image"
                        />
                      )}
                      <div className="mt-4 flex text-sm leading-6">
                        <CldUploadWidget
                          uploadPreset="dtskghsx"
                          options={{
                            multiple: false,
                          }}
                          onSuccess={(results, options) => {
                            handlePageImage(results.info?.public_id);
                          }}
                        >
                          {({ open }) => {
                            return (
                              <button
                                className="btn btn-outline btn-secondary"
                                onClick={() => open()}
                              >
                                Upload an Image
                              </button>
                            );
                          }}
                        </CldUploadWidget>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!page?.isProtected && (
                <MultiSelect
                  title={"Sites"}
                  onChange={handleSites}
                  options={sites}
                  preSelectedOptions={page?.sites}
                />
              )}
              <MultiSelect
                title="Authors"
                onChange={handleAuthors}
                options={possibleAuthors}
                preSelectedOptions={authors}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
