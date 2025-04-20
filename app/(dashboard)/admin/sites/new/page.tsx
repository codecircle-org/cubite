import PageHeader from "@/app/components/admin/PageHeader";
import SectionHeader from "@/app/components/admin/SectionHeader";
import CreateSiteForm from "./CreateSiteForm";

const SitesNew = () => {
  return (
    <div className="">
      <PageHeader title="Create a New Site" description="Fill the following information to create a new site" />
        <div className="space-y-12">
          <div className="border-b pb-12">
            <SectionHeader
              title="Site Information"
              description="Please fill this information. This is basic info after creating the site you can provide more info."
            />
              <CreateSiteForm />
          </div>
        </div>
    </div>
  );
};

export default SitesNew;
