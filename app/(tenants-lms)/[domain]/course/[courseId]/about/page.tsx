import React from "react";
import CourseAbout from "@/app/components/courseAbout/CourseAbout";

interface Props {
  params: {
    courseId: string;
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

const About = async ({ params: { courseId, domain } }: Props) => {
  const result = await getSites();
  let site;
  if (result.status === 200) {
    site = result.sites.find(
      (s) => s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === domain
    );
  }
  return <CourseAbout courseId={courseId} site={site} courses={site.courses} />;
};

export default About;
