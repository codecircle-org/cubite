import RenderEditorComponents from "@/app/components/editorjsToReact/RenderEditorComponents";
import { GhostSignupForm } from "@/app/components/GhostSignupForm";
interface Props {
  params: {
    domain: string;
  };
}

async function pageContent(pageId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/content/page/${pageId}`,
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
  const indexPageId = site?.pages.find((page) => page.title === "Index")?.id;
  const pageContentData = indexPageId ? await pageContent(indexPageId) : null;
  const pageBlocks = pageContentData ? pageContentData.blocks : [];

  return (
    <div className="">
      {/* page content */}
      <div className="mx-auto px-8">
        {pageBlocks.length > 0 ? (
          <div>
            <RenderEditorComponents blocks={pageBlocks} site={site} />
          </div>
        ) : (
          <div>Welcome to {site.name}</div>
        )}
      </div>
      {
        site.domainName.includes("mrjohnstestprep") && (
          <GhostSignupForm />
        )
      }
    </div>
  );
}
