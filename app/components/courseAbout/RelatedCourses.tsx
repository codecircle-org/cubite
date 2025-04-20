"use client";

import React from "react";
import CourseCard from "../CourseCard";

const RelatedCourses = ({ courses, site }) => {
  return (
    courses.length > 0 && (
      <div className="m-12">
        <p className="text-3xl font-semibold mb-8">Related Courses</p>
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} site={site} />
          ))}
        </div>
      </div>
    )
  );
};

export default RelatedCourses;
