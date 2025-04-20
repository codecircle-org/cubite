import { prisma } from "@/prisma/client";

export async function updateSiteExtraRegistrationFields(siteId: string, extraRegistrationFields: any) {
    try {
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: { extraRegistrationFields }
        });
        return {
            status: 200,
            message: "Site extra registration fields updated successfully",
            site: updatedSite
        };
    } catch (error) {
        console.error("Error updating site extra registration fields:", error);
        return {
            status: 500,
            message: "Failed to update site extra registration fields"
        }
    }
}