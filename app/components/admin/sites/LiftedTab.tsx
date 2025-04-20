import React from "react";

function PageHeader({ tabName, children }: { tabName: string; children: React.ReactNode }) {
  return (
    <>
      <input
        type="radio"
        name="sites_tabs"
        role="tab"
        className="tab"
        aria-label={tabName}
    />
    <div role="tabpanel" className="tab-content py-10">
        {children}
      </div>
    </>
  );
}

export default PageHeader;
