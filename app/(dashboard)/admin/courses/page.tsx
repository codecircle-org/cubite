"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { CldImage } from "next-cloudinary";
import { format } from "date-fns";

interface Site {
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  admins: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
  siteRoles?: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
}

interface Course {
  createdAt: string;
  updatedAt: string;
  name: string;
  coverImage?: string;
  isWaitList: boolean;
  sites: {
    name: string;
  }[];
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { status, data: session } = useSession();

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

  const handleDeleteCourse = async (courseId: string) => {
    const response = await fetch(`/api/courses`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId }),
    });
    const result = await response.json();
    if (result.status === 200) {
      setCourses(courses.filter((course) => course.id !== courseId));
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  const handleCopyCourse = async (courseId: string) => {
    const response = await fetch(`/api/courses/copyCourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId }),
    });
    const result = await response.json();
    if (result.status === 201) {
      setCourses([...courses, result.newCourse]);
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex-1 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Courses</h1>
              <p className="mt-2">
                In the following you can see all the courses you can manage.
              </p>
            </div>
          </div>
        </div>
        <div className="border-b mb-12">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 md:p-8">
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
          <div className="flex flex-col gap-4 w-52 mt-8">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="mt-2">
              In the following you can see all the courses you can manage.
            </p>
          </div>
          {courses.length > 0 && (
            <Link
              href="/admin/courses/new"
              className="h-10 w-auto btn btn-primary"
            >
              Create a Course
            </Link>
          )}
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>

      {courses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Updated</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <CldImage
                            width="960"
                            height="600"
                            src={
                              course.coverImage
                                ? course.coverImage
                                : "photo-1715967635831-f5a1f9658880_mhlqwu"
                            }
                            sizes="100vw"
                            alt="Description of my image"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{course.name} {course.isWaitList ? <span className="badge badge-warning mx-2">Waitlisted</span> : null}</div>
                        <div className="text-sm opacity-50">
                          {course.sites &&
                            course.sites.map((site) => site.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{format(new Date(course.createdAt), "PPP")}</td>
                  <td>{format(new Date(course.updatedAt), "PPP")}</td>
                  <th>
                    <Link
                      className="btn btn-outline btn-accent"
                      href={`/admin/courses/${course.id}`}
                    >
                      Details
                    </Link>
                  </th>
                  <td>
                    <button
                      className="btn btn-outline btn-secondary"
                      onClick={() => handleCopyCourse(course.id)}
                    >
                      Copy
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mx-auto max-w-md sm:max-w-3xl">
          <div>
            <div className="text-center">
              <BookOpenIcon className="h-12 w-12 mx-auto" />
              <h2 className="mt-2 text-base font-semibold leading-6">
                Create a Course
              </h2>
              <p className="mt-1 text-sm ">
                You don&apos;t have any course, create one.
              </p>
              <Link
                type="button"
                className="btn btn-outline btn-ghost mt-4"
                href="/admin/courses/new"
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Create a Course
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
