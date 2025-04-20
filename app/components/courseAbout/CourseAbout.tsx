"use client";

import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import Attributes from "./Attributes";
import Syllabus from "./Syllabus";
import Instructors from "./Instructors";
import RelatedCourses from "./RelatedCourses";
import OpenedxSyllabus from "./OpenedxSyllabus";
import Divider from "../Divider";
import Requirements from "./Requirements";

const CourseAbout = ({ courseId, site, courses }) => {
  const [course, setCourse] = useState({
    coverImage: "",
    externalImageUrl: "",
    externalUrl: "",
    description: "",
    name: "",
    contents: [],
    level: "",
    topics: [],
    instructors: [],
    xp: "",
  });

  useEffect(() => {
    async function getCourse(courseId) {
      const response = await fetch(`/api/course/${courseId}`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        setCourse(result.course);
      }
    }
    getCourse(courseId);
  }, [courseId]);

  const getRelatedCourses = () => {
    const courseTopics = course.topics.map((topic) => topic.name);
    return courses.filter(
      (c) =>
        c.topics.some((topic) => courseTopics.includes(topic.name)) &&
        c.id !== courseId
    );
  };

  return (
    <>
      <Hero
        coverImage={course.coverImage}
        externalImageUrl={course.externalImageUrl}
        description={course.description}
        name={course.name}
      />
      <Attributes
        courseId={courseId}
        siteId={site.id}
        level={course.level}
        topics={course.topics}
        xp={course.xp}
        course={course}
        site={site}
      />
      <Instructors instructors={course.instructors} />
      <Divider color="secondary" height={4} style="double" />
      {course.isSyllabusVisible && course.externalUrl ? (
        <OpenedxSyllabus course={course} site={site} />

      ) : course.contents.length > 0  && (
        <Syllabus blocks={course.contents[0].content.blocks} />
      )}
      {course.requirements?.blocks?.length > 0 && (
        <Requirements requirements={course.requirements} site={site} />
      )}
      <RelatedCourses courses={getRelatedCourses()} site={site} />
    </>
  );
};

export default CourseAbout;
