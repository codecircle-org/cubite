"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { CalendarOff } from "lucide-react";

const DashboardCourseCard = ({
  enrollment,
  site,
}: {
  enrollment: any;
  site: any;
}) => {
  const isEnrollmentExpirated = (enrollment: any) => {
    const enrolledAtDate = new Date(enrollment.course.enrolledAt);
    const expirationDate = new Date(
      enrolledAtDate.getTime() +
        enrollment.course.duration * 24 * 60 * 60 * 1000
    );
    // if there is no duration, then the enrollment is not expired
    if (!enrollment.course.duration) {
      return false;
    }
    return expirationDate < new Date();
  };
  return (
    <div
      key={enrollment.course.id}
      className="relative divide-y overflow-hidden rounded-md border border-ghost my-8"
    >
      <div className="grid grid-cols-3 gap-4 h-64">
        <div className="col-span-1 relative">
          {enrollment.course.coverImage ? (
            <CldImage
              height={250}
              width={250}
              sizes="100vw"
              src={enrollment.course.coverImage}
              alt={enrollment.course.name}
              className="relative"
            />
          ) : (
            <CldImage
              fill
              sizes="100vw"
              src="courseCovers/photo-1732119988788-a4c6840b2ccb_zjllwa"
              alt={`${enrollment.course.name} cover image`}
              className="relative"
            />
          )}
        </div>
        <div className="col-span-2 m-4">
          <div className="flex flex-col gap-4">
            {!enrollment.course.isWaitList && (
              <div className="absolute top-6 right-6 rounded-full">
                <div
                  className="radial-progress text-success text-xs"
                  style={{
                    "--value": `${
                      enrollment.course.CourseProgress.length > 0
                        ? enrollment.course.CourseProgress[0].progressPercentage
                        : 0
                    }`,
                    "--size": "3rem",
                    "--thickness": "0.2rem",
                  }}
                  role="progressbar"
                >
                  {enrollment.course.CourseProgress.length > 0
                    ? enrollment.course.CourseProgress[0].progressPercentage
                    : 0}
                  %
                </div>
              </div>
            )}
            {enrollment.course.banner && (
              <div role="alert" className="alert w-2/3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info h-6 w-6 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{enrollment.course.banner}</span>
              </div>
            )}

            <p className="text-lg font-light mt-4">{enrollment.course.name}</p>
            <div className="flex flex-row gap-x-2 gap-y-4">
              {enrollment.course.startDate && (
                <>
                  <CalendarCheck className="text-xs text-success" />
                  <span className="text-xs text-secondary">
                    Start Date
                    <span className="text-sm px-2">
                      {new Date(
                        enrollment.course.startDate
                      ).toLocaleDateString()}
                    </span>
                  </span>
                </>
              )}
              {enrollment.course.endDate && (
                <>
                  <CalendarOff className="text-xs text-error" />
                  <span className="text-xs text-secondary">
                    End Date
                    <span className="text-sm px-2">
                      {new Date(enrollment.course.endDate).toLocaleDateString()}
                    </span>
                  </span>
                </>
              )}
            </div>
            {!enrollment.course.isWaitList &&
              enrollment.course.startDate &&
              new Date(enrollment.course.startDate) < new Date() &&
              !isEnrollmentExpirated(enrollment) && (
                <Link
                  href={`/course/${enrollment.course.id}/courseware/`}
                  className="btn btn-primary flex-none w-40 justify-self-end"
                >
                  Resume Course
                </Link>
              )}
            {enrollment.course.duration && (
              <div className="flex flex-row bg-warning/50 py-2">
                <span className="text-xs font-extralight self-end">
                  <span className="text-sm px-2 font-bold">
                    You have{" "}
                    {`${
                      enrollment.course.duration < 24
                        ? enrollment.course.duration
                        : Math.floor(enrollment.course.duration / 24)
                    } ${
                      enrollment.course.duration < 24
                        ? enrollment.course.duration === 1
                          ? "hour"
                          : "hours"
                        : Math.floor(enrollment.course.duration / 24) === 1
                        ? "day"
                        : "days"
                    } left`}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCourseCard;
