import { prisma } from "@/prisma/client";

// Utility function to get public site data
export const getSitesPublicData = async () => {
  try {
    // Fetch data for all sites
    const sites = await prisma.site.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        logoDark: true,
        favicon: true,
        domainName: true,
        customDomain: true,
        languages: true,
        themeName: true,
        darkModeTheme: true,
        fontFamily: true,
        openedxLtiConsumerKey: true,
        openedxLtiConsumerSecret: true,
        openedxOauthClientId: true,
        openedxOauthClientSecret: true,
        stripePublishableKey: true,
        customCss: true,
        courses: {
          include: {
            topics: true,
            subjects: true,
            instructors: true,
            contents: true,
          },
        },
        pages: true,
        features: true,
        isActive: true,
        frontendConfig: true,
        layout: true,
        extraRegistrationFields: true,
        isOpenedxSite: true,
        openedxSiteUrl: true,
        registrationForm: true,
        loginForm: true,
        contactEmail: true,
        ssoProviders: true,
        loginFormVisible: true,
        registrationFormVisible: true,
      },
    });

    // Filter out sensitive data from ssoProviders
    const sanitizedSites = sites.map(site => ({
      ...site,
      ssoProviders: site.ssoProviders ? {
        githubClientId: (site.ssoProviders as any).githubClientId || null,
        googleClientId: (site.ssoProviders as any).googleClientId || null,
        facebookClientId: (site.ssoProviders as any).facebookClientId || null,
      } : null
    }));

    return {
      status: 200,
      sites: sanitizedSites,
    };
  } catch (error) {
    console.error("Error fetching site data:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};
