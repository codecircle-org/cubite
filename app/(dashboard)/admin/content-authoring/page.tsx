"use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

interface Course {
  createdAt: string;
  updatedAt: string;
  name: string;
  coverImage?: string;
  sites: {
    name: string;
  }[];
}

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    async function getCourses() {
      const response = await fetch("/api/courses", {
        cache: "no-store",
      });
      const result = await response.json();

      if (result.status === 200) {
        setCourses(result.courses);
      }
    }
    getCourses();
  }, []);
  return (
    <div>
      {/* Courses */}
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="mt-2">
              Choose a course to edit or create content for.
            </p>
          </div>
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <div className="my-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {courses.map((course) => (
          <div
            className="card w-96 bg-base-100 shadow-xl image-full lg:col-span-3 2xl:col-span-2"
            key={course.id}
          >
            <figure>
              <CldImage
                width={500}
                height={500}
                src={course?.coverImage}
                alt="Description of my image"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{course.name}</h2>
              <p>{course.description}</p>
              <div className="card-actions justify-end">
                <Link
                  href={`/admin/content-authoring/course/${course.id}`}
                  className="btn btn-primary"
                >
                  Enter
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
