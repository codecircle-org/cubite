import { prisma } from "@/prisma/client";

export const deleteSite = async (domainName: string) => {
  try {
    const site = await prisma.site.findUnique({
      where: {
        domainName: domainName,
      },
    });

    if (!site) {
      return {
        status: 404,
        message: "Site not found",
      };
    }

    // Delete the associated pages
    const deletePages = await prisma.page.deleteMany({
      where: {
        sites: {
          some: {
            id: site.id,
          },
        },
      },
    });

    const deletedSite = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });

    // if the serverid is not empty, delete the server
    if (site.serverId !== "") {
      const response = await fetch(`https://api.hetzner.cloud/v1/servers/${site.serverId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.cubite_hetzner_api_key}`,
        },
      });
    }

    if (site.serverId !== "" && site.isNewOpenedxSite) {
    // Delete the DNS records
    const zoneId = process.env.MAIN_DOMAIN === "cubite.dev" ? process.env.CLOUDFLARE_CUBITE_DEV_ZONE_ID : process.env.CLOUDFLARE_CUBITE_IO_ZONE_ID;
    
    // First, list DNS records to get their IDs
    const recordsResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=learn.${domainName}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const recordsData = await recordsResponse.json();
    
    if (recordsData.success && recordsData.result.length > 0) {
      // Delete A record
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordsData.result[0].id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Get and delete wildcard CNAME record
    const cnameResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=*.learn.${domainName}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const cnameData = await cnameResponse.json();
    
    if (cnameData.success && cnameData.result.length > 0) {
      // Delete CNAME record
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${cnameData.result[0].id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
        );
      }
    }


    return {
      status: 200,
      message: "Site deleted successfully",
      site: deletedSite,
    };
  } catch (error) {
    console.error("Error deleting site:", error);
    return {
      status: 500,
      message: "Failed to delete site",
    };
  }
};
