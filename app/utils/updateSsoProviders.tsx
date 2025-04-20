import { prisma } from "@/prisma/client";

export async function updateSsoProviders(siteId: string, ssoProviders: any) {
    try {
        const existingData = await prisma.site.findUnique({
            where: { id: siteId },
            select: { ssoProviders: true }
        });
        if (!existingData) {
            return {
                status: 404,
                message: "Site not found"
            }
        }
        const updatedSsoProviders = {
            ...existingData.ssoProviders,
            ...ssoProviders
        }
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: { ssoProviders: updatedSsoProviders }
        });
        return {
            status: 200,
            message: "Site sso providers updated successfully",
            site: updatedSite
        };
    } catch (error) {
        console.error("Error updating site sso providers:", error);
        return {
            status: 500,
            message: "Failed to update site sso providers"
        }
    }
}