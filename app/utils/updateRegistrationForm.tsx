import { prisma } from "@/prisma/client";

export async function updateRegistrationForm(siteId: string, registrationForm: any) {
    try {
        const existingData = await prisma.site.findUnique({
            where: { id: siteId },
            select: { registrationForm: true }
        });
        if (!existingData) {
            return {
                status: 404,
                message: "Site not found"
            }
        }
        const updatedRegistrationForm = {
            ...existingData.registrationForm,
            ...registrationForm
        }
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: { registrationForm: updatedRegistrationForm }
        });
        return {
            status: 200,
            message: "Site registration form updated successfully",
            site: updatedSite
        };
    } catch (error) {
        console.error("Error updating site registration form:", error);
        return {
            status: 500,
            message: "Failed to update site registration form"
        }
    }
}