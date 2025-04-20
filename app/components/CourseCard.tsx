"use client";

import React from "react";
import Enrollment from "@/app/components/Enrollment";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import {
  Gem,
  Clock,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Shield,
} from "lucide-react";
import CourseCardParley from "@/app/components/CourseCardParley";

const CourseCard = ({ course, site }) => {
  const levelIcon = course.level ? (
    course.level.toLowerCase() === "beginner" ? (
      <SignalLow className="w-4 h-4 mr-2" />
    ) : course.level.toLowerCase() === "intermediate" ? (
      <SignalMedium className="w-4 h-4 mr-2" />
    ) : (
      <SignalHigh className="w-4 h-4 mr-2" />
    )
  ) : null;
  return (
    <>
        <div className="grid border border-primary-200 shadow-md rounded-sm bg-base-200/40">
          <Link key={course.id} className="" href={`/course/${course.id}/about/`}>
        <div className="relative h-52 w-42">
          {course.coverImage ? (
            <CldImage
              src={
                course.coverImage
                  ? course.coverImage
                  : "photo-1715967635831-f5a1f9658880_mhlqwu"
              }
              fill
              alt="Course cover"
              sizes="100vw"
              className=""
            />
          ) : course.externalImageUrl ? (
            <Image
              src={course.externalImageUrl}
              fill
              alt={`${course.name} cover`}
            />
          ) : null}
          <div className="absolute bottom-0 left-0 m-4">
            <div className="">
              {course.topics?.map((topic) => (
                <div key={topic.id} className="badge bg-base-100 mx-1">
                  {topic.name}
                </div>
              ))}
              {course.subjects?.map((subject) => (
                <div key={subject.id} className="badge bg-base-100 mx-1">
                  {subject.name}
                </div>
              ))}
            </div>

            <div className="">
              {course.featured && (
                <span className="badge badge-base-200 mx-2">FEATURED</span>
              )}
            </div>
          </div>
        </div>
        {course.isWaitList && course.waitListMessage && (
          <div role="alert" className="alert w-full bg-primary/30 rounded-none">
            <Gem className="w-6 h-6 text-primary" />
            <span className="text-sm">{course.waitListMessage}</span>
          </div>
        )}
        <div className="px-4 py-8 border-b space-y-4">
          <div className="flex flex-row items-center gap-1">
            {course.duration && (
              <div className="my-2 text-sm font-light badge bg-secondary/10 p-3 py-4">
                <Clock className="w-4 h-4 mr-2" />{" "}
                {course.duration < 24
                  ? `${course.duration} ${
                      course.duration === 1 ? "hour" : "hours"
                    }`
                  : course.duration >= 24
                  ? `${Math.floor(course.duration / 24)} ${
                      Math.floor(course.duration / 24) === 1 ? "day" : "days"
                    }`
                  : ""}
              </div>
            )}
            {course.level && (
              <div className="my-2 text-sm badge bg-secondary/10 p-3 py-4">
                {levelIcon} <span className="text-xs">{course.level}</span>
              </div>
            )}
            {course.xp && (
              <div className="my-2 text-sm badge bg-secondary/10 p-3 py-4">
                <Shield className="w-4 h-4 mr-2" /> XP {course.xp}
              </div>
            )}
          </div>
          <p className="text-xl font-semibold mb-4">{course.name}</p>
          {course.price > 0 ? (
            <p className="text-sm text-base-content/80 mb-2">
              Price:{" "}
              <span className="text-base font-semibold">
                USD ${course.price}
              </span>
            </p>
          ) : (
            <p className="text-md text-base-content/80 font-semibold mb-2">
              Free Access
            </p>
          )}
          <p className="text-md font-light text-base-content/80 my-2">
            {course.description
              ? course.description
              : "Click on enroll now to see the course"}
          </p>
        </div>
      </Link>

      <div className="flex flex-row  px-4 py-8 gap-2 place-items-center">
        <Enrollment
          siteId={site.id}
          courseId={course.id}
          course={course}
          site={site}
        />
      </div>
        </div>
    </>
  );
};

export default CourseCard;
