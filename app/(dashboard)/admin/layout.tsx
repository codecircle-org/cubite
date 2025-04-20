import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import {
  LinkIcon,
  WindowIcon,
  ChartPieIcon,
  UsersIcon,
  BookOpenIcon,
  MapIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  return (
    <div className="max-w-screen-2xl items-center mx-auto">
      <div className="flex h-screen w-full my-4">
        <div className="flex h-full w-[280px] flex-col border-r">
          <div className="flex h-[60px] items-center justify-between border-b px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Link href="/admin" className="text-lg">
                Administration
              </Link>
            </div>
            <button className="h-8 w-8">
              <span className="sr-only">Toggle notifications</span>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="grid gap-2">
              {
                (session?.user.administratedSites.length > 0 || session?.user.roles.some((role) => role.role === "MANAGER") || session?.user.organizations.length > 0) &&
                <Link
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-base-200"
                  href="/admin/sites"
                >
                  <WindowIcon className="h-6 w-6" />
                  <span>Sites</span>
                </Link>
              }
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-base-200"
                href="/admin/courses"
              >
                <BookOpenIcon className="h-6 w-6" />
                <span>Courses</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-base-200"
                href="/admin/pages"
              >
                <DocumentTextIcon className="h-6 w-6" />
                <span>Pages</span>
              </Link>
              <div className="grid grid-cols-6 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium">
                <MapIcon className="h-6 w-6" />
                <span className="col-span-5">Learning Path</span>
                <div className="badge badge-warning badge-xs rounded-md py-2 px-2 col-span-full">
                  <span className="text-xs font-light">Launching Soon</span>
                </div>
              </div>

              <div className="grid grid-cols-6 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium">
                <UsersIcon className="h-6 w-6" />
                <span className="col-span-5">Users</span>
                <div className="badge badge-warning badge-xs rounded-md py-2 px-2 col-span-full">
                  <span className="text-xs font-light">Launching Soon</span>
                </div>
              </div>
              <div className="grid grid-cols-6 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium">
                <ChartPieIcon className="h-6 w-6" />
                <span className="col-span-5">Reports</span>
                <div className="badge badge-warning badge-xs rounded-md py-2 px-2 col-span-full">
                  <span className="text-xs font-light">Launching Soon</span>
                </div>
              </div>
              <div className="grid grid-cols-6 items-center gap-1 rounded-md px-3 py-2 text-sm font-medium">
                <LinkIcon className="h-6 w-6" />
                <span className="col-span-5">APIs</span>
                <div className="badge badge-warning badge-xs rounded-md py-2 px-2 col-span-full">
                  <span className="text-xs font-light">Launching Soon</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
