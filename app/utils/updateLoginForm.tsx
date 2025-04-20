import { prisma } from "@/prisma/client";

export async function updateLoginForm(siteId: string, loginForm: any) {
    try {
        const existingData = await prisma.site.findUnique({
            where: { id: siteId },
            select: { loginForm: true }
        });
        if (!existingData) {
            return {
                status: 404,
                message: "Site not found"
            }
        }
        const updatedLoginForm = {
            ...existingData.loginForm,
            ...loginForm
        }
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: { loginForm: updatedLoginForm }
        });
        return {
            status: 200,
            message: "Site login form updated successfully",
            site: updatedSite
        };
    } catch (error) {
        console.error("Error updating site login form:", error);
        return {
            status: 500,
            message: "Failed to update site login form"
        }
    }
}