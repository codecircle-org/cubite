"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MultiInput from "@/app/components/MultiInput";
import MultiSelect from "@/app/components/MultiSelect";
import DateTimeInput from "@/app/components/DateTimeInput";
import Alert from "@/app/components/Alert";
import { CldUploadWidget } from "next-cloudinary";
import { z } from "zod";
import { toast } from "react-hot-toast";

interface Option {
  id: string;
  name: string;
}

const pageSchema = z.object({
  title: z.string().nonempty({ message: "Title is requiered" }),
  description: z.string().optional(),
  image: z.string().optional(),
  authors: z
    .array(z.string())
    .nonempty({ message: "At least one author is required" }),
  subjects: z.array(z.object({ name: z.string() })).optional(),
  topics: z.array(z.object({ name: z.string() })).optional(),
  permalink: z.string().nonempty({ message: "Permalink is requiered" }),
  blurb: z.string().optional(),
});

const PageNew = () => {
  const { status, data: session } = useSession();
  const [title, seTitle] = useState("");
  const [description, setDescription] = useState("");
  const [permalink, setPermalink] = useState("");
  const [blurb, setBlurb] = useState("");
  const [image, setImage] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<Option[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Option[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [isBlog, setIsBlog] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState(new Date());
  const [isProtected, setIsProtected] = useState(false);

  const router = useRouter();

  const handleTitle = (e) => {
    seTitle(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handlePermalink = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. first check if the selceted site or sites has a page alreay with that permalink
    // 1.1 loop over administrated sites and created a list of sideId: [parmalinks]
    const siteIdToPermalinks: { [key: string]: string[] } = {};
    sites.forEach((site: any) => {
      siteIdToPermalinks[site.name] = site.pages.map((page: any) => page.permalink);
    });
    // 2. Check if that permalink is already taken in any of the sites
    // and tell the user permalink is already taking with a list of the sites
    const isPermalinkTaken = Object.values(siteIdToPermalinks).some((permalinks) =>
      permalinks.includes(e.target.value)
    );
    if(isPermalinkTaken){
      //which sites has the permalink
      const sitesWithPermalink = Object.keys(siteIdToPermalinks).filter((site) =>
        siteIdToPermalinks[site].includes(e.target.value)
      );
      toast.error("Permalink is already taken in sites: \n" + sitesWithPermalink.join("\n"));
    } else {
      setPermalink(e.target.value);
    }
  };

  const handleBlurb = (e) => {
    setBlurb(e.target.value);
  };

  const handleSites = (e) => {
    setSelectedSites(e);
  };

  const handleIsBlog = (e) => {
    setIsBlog(e.target.checked);
  };

  const handleIsPublished = (e) => {
    setIsPublished(e.target.checked);
  };

  const handleIsProtected = (e) => {
    setIsProtected(e.target.checked);
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const pageData = {
      title,
      description,
      image,
      authors: selectedAuthors.map((author) => author.id),
      subjects: selectedSubjects,
      topics: selectedTopics,
      permalink,
      blurb,
      selectedSites,
      isPublished: false,
      isProtected: false,
      isBlog: isBlog,
    };

    const response = await fetch("/api/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pageData),
    });

    const result = await response.json();
    if (result.status === 201) {
      setSuccess("Page created successfully");
      router.push("/admin/pages");
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    async function getInstructor() {
      const response = await fetch("/api/instructors", {
        cache: "no-store",
      });
      const result = await response.json();
      const instructors = result.instructors;
      setAuthors(instructors);
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
    getInstructor();
    getMysites(session?.user?.email);
    setSelectedAuthors([
      {
        name: session?.user?.name,
        id: session?.user?.id,
      },
    ]);
  }, [session]);

  return (
    <div className="">
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create a New Page</h1>
            <p className="mt-2">
              Fill the following information to create a new page.
            </p>
          </div>
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <div>
        <div className="space-y-12">
          {error && (
            <Alert
              status={400}
              message={error}
              onClose={() => setError(null)}
            />
          )}
          {success && (
            <Alert
              status={201}
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}
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
                    placeholder="How to ... ?"
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
              <MultiInput title={"Subjects"} onChange={setSelectedSubjects} />
              <MultiInput title={"Topics"} onChange={setSelectedTopics} />
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Permalink</span>
                  </div>
                  <input
                    type="text"
                    name="permalink"
                    id="permalink"
                    placeholder="Permalink"
                    className="input input-bordered w-full max-w-xs"
                    onChange={handlePermalink}
                    required={true}
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
                    placeholder="Blurb"
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
              <MultiSelect
                title="Authors"
                options={authors}
                onChange={setSelectedAuthors}
                preSelectedOptions={[
                  {
                    name: session?.user?.name,
                    id: session?.user?.id,
                  },
                ]}
              />
              <div className="col-span-full">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Description</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="This course is about ...."
                    onChange={handleDescription}
                  ></textarea>
                  <div className="label">
                    <span className="label-text-alt">
                      Write some description about this page
                    </span>
                  </div>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Cover Photo</span>
                  </div>
                  {image ? (
                    <CldUploadWidget
                      uploadPreset="dtskghsx"
                      options={{
                        multiple: false,
                      }}
                      onSuccess={(results, options) => {
                        setImage(results.info?.public_id);
                      }}
                    >
                      {({ open }) => {
                        return (
                          <button
                            className="btn btn-error btn-outline"
                            onClick={() => open()}
                          >
                            Change Cover Image
                          </button>
                        );
                      }}
                    </CldUploadWidget>
                  ) : (
                    <CldUploadWidget
                      uploadPreset="dtskghsx"
                      options={{
                        multiple: false,
                      }}
                      onSuccess={(results, options) => {
                        setImage(results.info?.public_id);
                      }}
                    >
                      {({ open }) => {
                        return (
                          <button
                            className="btn btn-ghost btn-outline"
                            onClick={() => open()}
                          >
                            Upload an Image
                          </button>
                        );
                      }}
                    </CldUploadWidget>
                  )}
                  <div className="label">
                    {image ? (
                      <span className="label-text-alt">
                        You uploaded an Image {image} or Click to change it
                      </span>
                    ) : (
                      <span className="label-text-alt">
                        Upload the Cover Image
                      </span>
                    )}
                  </div>
                </label>
              </div>
              <MultiSelect
                title={"Sites"}
                onChange={handleSites}
                options={sites}
              />
              <div className="form-control w-full sm:col-span-2 self-center">
                <label className="label cursor-pointer">
                  <span className="label-text">Is this a blog post?</span>
                  <input type="checkbox" className="toggle" defaultChecked={false} onChange={handleIsBlog} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="btn btn-primary px-8"
            onClick={handleCreatePage}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNew;
