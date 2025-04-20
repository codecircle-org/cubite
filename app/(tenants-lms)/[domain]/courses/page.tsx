import React from "react";
import CoursesHero from "@/app/components/courses/Hero";
import CoursesFilter from "@/app/components/courses/Filter";
import RenderEditorComponents from "@/app/components/editorjsToReact/RenderEditorComponents";
interface Props {
  params: {
    domain: string;
  };
}

async function getSites() {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/getSitesPublicData`,
    { cache: "no-store" }
  );
  const result = await response.json();
  return result;
}

async function getSiteCoursesPage(siteId: string) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/getSitePublicData?siteId=${siteId}`,
    { cache: "no-store" }
  );
  const result = await response.json();
  // loop over the pages and find the one with the title "Courses"
  const coursesPage = result.site.pages.find(
    (page) => page.title.toLowerCase() === "courses"
  );
  if (coursesPage) {
    const coursesPageId = coursesPage.id ;
    const coursesPageContentResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/content/page/${coursesPageId}`,
      {
        cache: "no-store",
      }
    );
    const coursesPageContentResult = await coursesPageContentResponse.json();
    if (coursesPageContentResult.status === 200 && coursesPageContentResult.contents.content) {
      const coursesPageContent = coursesPageContentResult.contents.content;
      return coursesPageContent;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

const Courses = async ({ params }: Props) => {
  const result = await getSites();
  let site;
  let coursesPageContent;
  if (result.status === 200) {
    site = result.sites.find(
      (s) =>
        s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === params.domain
    );
    coursesPageContent = await getSiteCoursesPage(site.id);
  }
  return (
    <>
      {coursesPageContent && coursesPageContent.blocks.length > 0 ? (
        <div className="mx-12 courses-page-content">
          <RenderEditorComponents
            blocks={coursesPageContent.blocks}
            site={site}
          />
        </div>
      ) : (
        <CoursesHero />
      )}
      <CoursesFilter courses={site.courses.filter((course: any) => course.isVisibleInCatalog)} site={site} />
    </>
  );
};

export default Courses;
