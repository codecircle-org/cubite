import React from "react";

const CoursesHero = () => {
  return (
    <div className="min-h-48 relative isolate overflow-hidden">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1621867430703-a1503873e53f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary opacity-70 -z-10"></div>

      <div className="flex flex-col px-12 py-36">
        <p className="text-4xl font-bold uppercase text-base-300">
          Course Catalog
        </p>
        <p className="py-4 text-lg capitalize text-base-200">
          Search and Browse Over 100 courses in various topics.
        </p>
      </div>
    </div>
  );
};

export default CoursesHero;
