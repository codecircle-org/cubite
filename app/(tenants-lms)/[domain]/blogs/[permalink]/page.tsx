import Link from "next/link";
import RenderEditorComponents from "@/app/components/editorjsToReact/RenderEditorComponents";
interface Props {
  params: {
    domain: string;
  };
}

async function blogContent(permalink: string, siteId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/getPageContentByPermalink?permalink=${permalink}&siteId=${siteId}`,
      { cache: "no-store" }
    );
    const result = await response.json();
    if (result.status === 200) {
      return result.contents.content;
    }
    return null;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return null;
  }
}

async function getSites() {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/getSitesPublicData`,
    { cache: "no-store" }
  );
  const result = await response.json();
  return result;
}

export default async function Home({ params }: Props) {
  const result = await getSites();
  let site;
  if (result.status === 200) {
    site = result.sites.find(
      (s) =>
        s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === params.domain
    );
  }
  const blogContentData = await blogContent(params.permalink, site.id);
  const blogBlocks = blogContentData ? blogContentData.blocks : [];
  const blogs = site.pages.filter(p => p.isBlog === true && p.permalink !== params.permalink);
  const recentBlogs = blogs.slice(0, 4);

  return (
    <div className="flex flex-row my-40 xl:mx-0 mx-12 gap-6">
      {/* page content */}
      {
        blogs.length > 0 && (
        <div className="w-1/6 lg:block hidden">
          <div className="justify-self-center mb-4">
            <p className="text-pretty text-xl font-semibold tracking-tight">Recent Blogs</p>
            {recentBlogs.map((blog: any) => (
              <Link className="" href={`/blogs/${blog.permalink}`} key={blog.id}>
                <p className="text-sm font-light text-ghost hover:text-primary mt-4">{blog.title}</p>
                <p className="text-sm text-secondary font-mono py-2 mb-4">{new Date(blog.createdAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </div>
        )
      }
      <div className="w-5/6 mx-auto px-8 lg:border-l border-gray-200">
        {blogBlocks.length > 0 ? (
          <RenderEditorComponents
            blocks={blogBlocks}
            site={site}
          />
        ) : (
          <div>Welcome to {site.name}</div>
        )}
      </div>
    </div>
  );
}
