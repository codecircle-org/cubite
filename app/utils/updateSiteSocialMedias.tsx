import { prisma } from "@/prisma/client";


export async function updateSiteSocialMedias(siteId: string, socialMedias: any) {
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
                    socialMedia: []
                }
            }
        }
        const updatedLayout = {
            ...existingData.layout,
            footer: {
                ...existingData.layout.footer,
                socialMedia: socialMedias
            }
        }
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: { layout: updatedLayout }
        });
        return {
            status: 200,
            message: "Site social medias updated successfully",
            site: updatedSite
        };
    } catch (error) {
        console.error("Error updating site social medias:", error);
        return {
            status: 500,
            message: "Failed to update site social medias"
        }
    }
}