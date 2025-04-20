import { prisma } from "@/prisma/client";
import { upsertOpenedxCourses } from "./upsertOpenedxCourses";

interface SiteData {
  siteName: string;
  subDomain: string;
  customDomain: string;
  theme: string;
  darkModeTheme: string;
  userEmail: string;
  isOpenedxSite: boolean;
  isNewOpenedxSite: boolean;
  openedxSiteUrl: string;
}

export const createSite = async (data: SiteData) => {
  // find amir@cubite.io user if it exists
  const globalAdminUsers = await prisma.user.findMany({
    where: {
      isGlobalAdmin: true,
    },
  });
  // Check if the site with the specified subdomain exists
  const existingSite = await prisma.site.findUnique({
    where: {
      domainName: `${data.subDomain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
    },
  });

  if (existingSite) {
    return {
      status: 400,
      message: "Site already exists. Please choose a different subdomain.",
    };
  }

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: {
      email: data.userEmail,
    },
  });

  // Ensure user exists
  if (!user) {
    return {
      status: 400,
      message: "User not found.",
    };
  }

  // Create a new site and assign the user as the site admin
  const newSite = await prisma.site.create({
    data: {
      name: data.siteName,
      domainName: `${data.subDomain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
      customDomain: data.customDomain,
      themeName: data.theme,
      darkModeTheme: data.darkModeTheme,
      isActive: true,
      frontendConfig: {},
      isOpenedxSite: data.isOpenedxSite,
      isNewOpenedxSite: data.isNewOpenedxSite,
      openedxSiteUrl: data.openedxSiteUrl,
      admins: {
        connect: [
          {
            id: user.id,
          },
          ...globalAdminUsers.map((user) => ({
            id: user.id,
          })),
        ],
      },
    },
  });

  // Create the index page for the new site
  const indexPage = await prisma.page.create({
    data: {
      title: "Index",
      permalink: `index-${newSite.id}`,
      isProtected: true,
      authors: {
        create: [{ user: { connect: { id: user.id } } }],
      },
      sites: {
        connect: { id: newSite.id },
      },
    },
  });

  // if it is an existing Open edX site, we need to sync the courses
  if (data.isOpenedxSite && !data.isNewOpenedxSite) {
    await upsertOpenedxCourses(data.openedxSiteUrl, newSite.id);
  }

  return {
    status: 201,
    message: "Successfully created a new site",
    site: {
      id: newSite.id,
      name: newSite.name,
      domainName: newSite.domainName,
      customDomain: newSite.customDomain,
      indexPageId: indexPage.id, // Include the ID of the index page
    },
  };
};
