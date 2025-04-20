import React from "react";
import Link from "next/link";
function TabHeader({
  title,
  description,
  showButton = false,
  buttonText = "",
  buttonLink = "",
}: {
  title: string;
  description: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}) {
  return (
    <>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-2">{description}</p>
          </div>
          {showButton && (
            <Link href={buttonLink} className="h-10 w-auto btn btn-primary">
              {buttonText}
            </Link>
          )}
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
    </>
  );
}

export default TabHeader;
