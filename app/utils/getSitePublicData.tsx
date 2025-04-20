import { prisma } from "@/prisma/client";


export const getSitePublicData = async (siteId: string, domainName: string) => {
  const uniqueId = siteId ? { id: siteId } : { domainName }
  try {
    const site = await prisma.site.findUnique({
      where: uniqueId,
      select: {
        id: true,
        name: true,
        domainName: true,
        customDomain: true,
        logo: true,
        logoDark: true,
        themeName: true,
        darkModeTheme: true,
        pages: true,
        courses: true,
        openedxSiteUrl: true,
        openedxLtiConsumerKey: true,
        openedxLtiConsumerSecret: true,
        openedxOauthClientId: true,
        openedxOauthClientSecret: true,
        stripePublishableKey: true,
        contactEmail: true,
        customCss: true,
        ssoProviders: true,
        loginFormVisible: true,
        registrationFormVisible: true,
      },
    });
    const sanitizedSite = {
      ...site,
      ssoProviders: site?.ssoProviders ? {
        githubClientId: (site.ssoProviders as any).githubClientId || null,
        googleClientId: (site.ssoProviders as any).googleClientId || null,
        facebookClientId: (site.ssoProviders as any).facebookClientId || null,
      } : null
    };
    return {
      status: 200,
      site: sanitizedSite,
    };
  } catch (error) {
    console.error("Error fetching site public data:", error);
    return {
      status: 500,
      message: "Error fetching site public data",
    };
  }
};
