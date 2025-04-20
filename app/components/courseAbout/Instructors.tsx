import React from "react";
import { CldImage } from "next-cloudinary";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Instructors = ({ instructors }) => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl text-balance font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Course Instructors
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            Learn from real-world instructors with extensive experience who actively work in the roles they teach. They are committed to helping you succeed by sharing practical insights.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:max-w-4xl lg:gap-x-8 xl:max-w-none"
        >
          {instructors.map((instructor) => (
            <li key={instructor.user.id} className="flex flex-col gap-6 xl:flex-row">
              {instructor.user.image ? (
                <CldImage
                  width={208}
                  height={260}
                  className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
                  src={instructor.user.image}
                  alt={instructor.user.name}
                />
              ) : (
                <div className="aspect-[4/5] w-52 flex-none rounded-2xl bg-gray-100 flex items-center justify-center">
                  <UserCircleIcon className="w-24 h-24 text-gray-400" />
                </div>
              )}
              <div className="flex-auto">
                <h3 className="text-lg/8 font-semibold tracking-tight text-gray-900 capitalize">
                  {instructor.user.name}
                </h3>
                {instructor.user.title && (
                  <p className="text-base/7 text-gray-600">{instructor.user.title}</p>
                )}
                {instructor.user.bio && (
                  <p className="mt-6 text-base/7 text-gray-600">{instructor.user.bio}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Instructors;
