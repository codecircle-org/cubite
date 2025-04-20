import { prisma } from "@/prisma/client";

interface SiteResponse {
  status: number;
  message: string;
  site?: any;
}

export const getSiteData = async (
  domainName: string,
  userEmail: string
): Promise<SiteResponse> => {
  try {
    // Check if domainName and userEmail are provided
    if (!domainName) {
      return {
        status: 400,
        message: "Domain name is required.",
      };
    }

    if (!userEmail) {
      return {
        status: 400,
        message: "User email is required.",
      };
    }

    // Fetch the site data including admin details
    const site = await prisma.site.findUnique({
      where: { domainName },
      include: {
        admins: true,
        languages: true,
        siteRoles: {
          include: {
            user: true,
          },
        },
        courses: true,
        features: true,
      },
    });

    // fetch the user data
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    // Check if the site exists
    if (!site) {
      return {
        status: 404,
        message: "Site not found.",
      };
    }

    // Check if the userEmail is in the list of admins
    const isAdmin = site.admins.some((admin) => admin.email === userEmail);
    // check if the user is a global admin
    const isGlobalAdmin = user?.isGlobalAdmin;
    
    if (!isAdmin && !isGlobalAdmin) {
      return {
        status: 401,
        message: "Unauthorized: You are not an admin of this site.",
      };
    }

    return {
      status: 200,
      message: "Site data retrieved successfully.",
      data: site,
    };
  } catch (error) {
    console.error("Error fetching site data:", error);
    return {
      status: 500,
      message: "An error occurred while fetching the site data.",
    };
  }
};
