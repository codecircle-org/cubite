"use server";

import { createSite } from "@/app/utils/createSite"
import { createOpenedxSite } from "@/app/utils/createOpenedxSite"
import { prisma } from "@/prisma/client";

export const createSiteAction = async (prevState: any, formData: FormData) =>{
    // Extract relevant form data fields
    const siteName = formData.get("siteName")?.toString() || '';
    const subDomain = formData.get("subDomain")?.toString() || '';
    const customDomain = formData.get("customDomain")?.toString() || '';
    const theme = formData.get("theme")?.toString() || 'business';
    const darkModeTheme = formData.get("darkModeTheme")?.toString() || 'dim';
    const userEmail = formData.get("userEmail")?.toString() || '';
    const isOpenedxSite = formData.get("isOpenedxSite") === "on";
    const isNewOpenedxSite = formData.get("isNewOpenedxSite") === "on";
    const openedxSiteUrl = formData.get("openedxSiteUrl")?.toString() || '';

    // Ensure userEmail is provided
    if (!userEmail) {
        return {
            status: 400,
            message: "User email is missing. Please ensure you are logged in."
        };
    } else if (!siteName) {
        return {
            status: 400,
            message: "Site name is missing. Please ensure you have provided a site name."
        };
    } else if (!subDomain) {
        return {
            status: 400,
            message: "Subdomain is missing. Please ensure you have provided a subdomain."
        };
    }
    // Create a site object to pass to the createSite function
    const siteObject = {
        siteName,
        subDomain,
        customDomain,
        theme,
        darkModeTheme,
        userEmail,
        isOpenedxSite,
        isNewOpenedxSite,
        openedxSiteUrl,
    };

    const newSite = await createSite(siteObject)
    if (isNewOpenedxSite && newSite.status === 201) {
        const openedxSiteResponse = await createOpenedxSite({siteName: siteName, siteDomain: subDomain, userEmail: userEmail})
        if (openedxSiteResponse.status === 201) {
            const openedxServer = openedxSiteResponse.data
            await prisma.site.update({
                where: {
                    id: newSite.site?.id
                },
                data: {
                    serverId: openedxServer?.serverId,
                    serverIp: openedxServer?.serverIp
                }
            })
        } else {
            return {
                status: 500,
                message: "Failed to create openedx site"
            }
        }
    }
    return newSite
}