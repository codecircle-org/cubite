import SiteDetailsHeader from "@/app/components/admin/sites/SiteDetailsHeader";
import ConfigsTab from "@/app/components/admin/sites/ConfigsTab";
import LayoutTab from "@/app/components/admin/sites/LayoutTab";
import AuthenticationTab from "@/app/components/admin/sites/AuthenticationTab";
import IntegrationsTab from "@/app/components/admin/sites/IntegrationsTab";
import AdminsTab from "@/app/components/admin/sites/AdminsTab";
import MembersTab from "@/app/components/admin/sites/MembersTab";
import ImportExportTab from "@/app/components/admin/sites/ImportExportTab";
import SiteDeletionTab from "@/app/components/admin/sites/SiteDeletionTab";
import EcommerceTab from "@/app/components/admin/sites/EcommerceTab";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

interface Props {
  params: {
    domainName: string;
  };
}

interface Site {
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  languages: string[];
  admins: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
  siteRoles?: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
}

const SitePage = async ({ params: { domainName } }: Props) => {
  const getSiteData = async (domainName: string) => {
    const session = await getServerSession(authOptions);
    const response = await fetch(
      `${process.env.ROOT_URL}/api/site/${domainName}`,
      {
        headers: {
          Authorization: `${session?.user.email}`,
        },
      }
    );
    const responseData = await response.json();
    return responseData;
  };

  const siteResponse = await getSiteData(domainName);
  const siteData = siteResponse.data;

  return (
    <div className="">
      <SiteDetailsHeader site={siteData} />

      <div className="p-6 md:p-8">
        <div role="tablist" className="tabs tabs-lifted">
          <ConfigsTab site={siteData} />
          <LayoutTab site={siteData} />
          <AuthenticationTab site={siteData} />
          <EcommerceTab site={siteData} />
          <IntegrationsTab site={siteData} />
          <AdminsTab site={siteData} />
          <MembersTab site={siteData} />
          <ImportExportTab site={siteData} />
          <SiteDeletionTab
            siteId={siteData.id}
            domainName={domainName}
            name={siteData.name}
          />
        </div>
      </div>
    </div>
  );
};

export default SitePage;
