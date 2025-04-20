"use client";

import Link from "next/link";

export default function EmptyDashboard() {
  return (
    <div className="text-center my-16 border-2 border-dashed p-32">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        You are not enrolled in any course
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Visit our course catalog page to find courses.
      </p>
      <div className="mt-6">
        <Link href="/courses" className="btn btn-outline btn-primary">
          Go to Course Catalog
        </Link>
      </div>
    </div>
  );
}
