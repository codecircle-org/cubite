import { prisma } from "@/prisma/client";

export async function updateSiteCopyright(siteId: string, copyrightText: string) {
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
                    copyrightText: ""
                }
            }
        }
        const updatedLayout = {
            ...existingData.layout,
            footer: {
                ...existingData.layout.footer,
                copyrightText: copyrightText
            }
        }
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: { layout: updatedLayout }
    });
    return {
        status: 200,
        message: "Site copyright updated successfully",
        site: updatedSite
    }
    } catch (error) {
        console.error("Error updating site copyright:", error);
        return {
            status: 500,
            message: "Failed to update site copyright"
        }
    }
}