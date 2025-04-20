import React from "react";
import Image from "next/image";
import Link from "next/link";
import RenderEditorComponents from "@/app/components/editorjsToReact/RenderEditorComponents";

export default async function Blogs({
  params,
}: {
  params: { domain: string };
}) {
  async function getBlogs() {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/getPagesByDomainName?domainName=${params.domain}.${process.env.MAIN_DOMAIN}`,
      { cache: "no-store" }
    );
    const result = await response.json();
    const blogs = result.site.pages.filter((page: any) => page.isBlog);
    return blogs;
  }

  async function getSite() {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/getSitesPublicData`,
      { cache: "no-store" }
    );
    const result = await response.json();
    return result.sites.find(
      (s: any) => s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === params.domain
    );
  }
  const site = await getSite();
  async function getSiteBlogPage({site}: {site: any}) {
    try {
      const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/getSitePublicData?siteId=${site.id}`,
        { cache: "no-store" }
      );
      const result = await response.json();
      // loop over the pages and find the one with the title "Courses"
      const blogPage = result.site.pages.find(
        (page: any) => page.title.toLowerCase() === "blogs"
      );
      if (blogPage) {
        const blogPageId = blogPage.id ;
        const blogPageContentResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/content/page/${blogPageId}`,
          {
            cache: "no-store",
          }
        );
        const blogPageContentResult = await blogPageContentResponse.json();
        const blogPageContent = blogPageContentResult.contents.content;
        return blogPageContent;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching blog page content:", error);
      return null;
    }
  }

  const blogs = await getBlogs();
  const blogPageContent = await getSiteBlogPage({site});

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl mb-40">
          {
            blogPageContent && blogPageContent.blocks.length > 0 ? (
              <RenderEditorComponents
                blocks={blogPageContent.blocks}
                site={site}
              />
            ) : (
              <div className="mt-32">
                <h2 className="text-pretty text-4xl font-semibold tracking-tight sm:text-5xl pb-4">
                      From the blog
                </h2>
                <p className="mt-2 text-lg/8 mb-24">
                  Learn how to grow your business with our expert advice.
                </p>
              </div>
            )
          }
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {blogs.map((blog: any) => (
              <article
                key={blog.id}
                className="relative isolate flex flex-col gap-8 lg:flex-row border-b border-base-200 pb-16"
              >
                <div className="relative aspect-video sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                  <Image
                    alt={blog.title}
                    src={`https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${blog.image}?_a=BAVCluDW0`}
                    fill
                    className="absolute inset-0 size-full rounded-2xl object-cover"
                  />
                  <div className="absolute inset-0 rounded-2xl" />
                </div>
                <div>
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={blog.updatedAt} className="">
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </time>
                    {blog.topics.length > 0 && (
                      blog.topics.map((topic: any) => (
                        <span
                          key={topic.id}
                          className="relative z-10 rounded-full bg-base-200 px-3 py-1.5 font-medium uppercase"
                        >
                          {topic.name}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg/6 font-semibold">
                      <Link href={`/blogs/${blog.permalink}`}>
                        <span className="absolute inset-0" />
                        {blog.title}
                      </Link>
                    </h3>
                    <p className="mt-5 text-sm/6">
                      {blog.description}
                    </p>
                  </div>
                  <div className="mt-6 flex border-t pt-6">
                    {blog.authors.map((author: any) => (
                      <div key={author.id} className="relative flex items-center gap-x-4">
                        {author.user.image ? (
                          <Image
                            alt={author.user.name}
                            src={`https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${author.user.image}?_a=BAVCluDW0`}
                            width={40}
                            height={40}
                            className="size-10 rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center size-10 rounded-full bg-base-300">
                            <span className="text-sm font-medium">
                              {author.user.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </span>
                          </div>
                        )}
                        <div className="text-sm/6">
                          <p className="font-semibold text-neutral-600">
                              <span className="absolute inset-0" />
                              {author.user.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
