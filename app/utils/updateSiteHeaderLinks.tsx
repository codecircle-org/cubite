import { prisma } from "@/prisma/client";

export async function updateSiteHeaderLinks(siteId: string, headerLinks: any) {
    try {
        const existingData = await prisma.site.findUnique({
            where: { id: siteId },
            select: { layout: true }
        });
        if (!existingData) {
            return {
                status: 404,
                message: "Site not found"
            }
        }
        if (!existingData.layout) {
            existingData.layout = {
                header: {
                    headerLinks: []
                }
            }
        }
        const updatedLayout = {
            ...existingData.layout,
            header: {
                ...existingData.layout.header,
                headerLinks: headerLinks
            }
        }
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: { layout: updatedLayout }
        });
        return {
            status: 200,
            message: "Site header links updated successfully",
            site: updatedSite
        };
    } catch (error) {
        console.error("Error updating site header links:", error);
        return {
            status: 500,
            message: "Failed to update site header links"
        }
    }
}