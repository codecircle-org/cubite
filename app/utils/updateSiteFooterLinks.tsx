import { prisma } from "@/prisma/client";

export async function updateSiteFooterLinks(siteId: string, footerLinks: any) {
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
                footer: {
                    footerLinks: []
                }
            }
        }
        const updatedLayout = {
            ...existingData.layout,
            footer: {
                ...existingData.layout.footer,
                footerLinks: footerLinks
            }
        }
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: { layout: updatedLayout }
        });
        return {
            status: 200,
            message: "Site footer links updated successfully",
            site: updatedSite
        };
    } catch (error) {
        console.error("Error updating site footer links:", error);
        return {
            status: 500,
            message: "Failed to update site footer links"
        }
    }
}