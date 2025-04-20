import React from "react";

const DashboardCourseCardLoader = () => {
  return (
    
    <div className="flex flex-col space-y-4 col-span-full border-2 border-dashed rounded-lg py-12 px-8">
      <div className="relative divide-y overflow-hidden rounded-md border border-ghost my-8">
        <div className="grid grid-cols-3 gap-2 border-2 border-ghost p-8 h-64 ">
          <div className="col-span-1 ">
            <div className="skeleton h-full w-full"></div>
          </div>
          <div className="col-span-2">
            <div className="skeleton h-4 w-full my-2"></div>
            <div className="skeleton h-4 w-full my-2"></div>
            <div className="skeleton h-4 w-full my-2"></div>
            <div className="skeleton h-4 w-28 my-2"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-2 border-ghost p-8 h-64">
        <div className="col-span-1 ">
          <div className="skeleton h-full w-full"></div>
        </div>
        <div className="col-span-2">
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-28 my-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-2 border-ghost p-8 h-64">
        <div className="col-span-1 ">
          <div className="skeleton h-full w-full"></div>
        </div>
        <div className="col-span-2">
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-full my-2"></div>
          <div className="skeleton h-4 w-28 my-2"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCourseCardLoader;
