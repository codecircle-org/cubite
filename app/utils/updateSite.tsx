import { prisma } from "@/prisma/client";

// Utility function to update site information
export const updateSite = async (siteId, updateData) => {
  try {
    // First, get the current site data
    const currentSite = await prisma.site.findUnique({
      where: { id: siteId },
    });

    // Merge the update data with existing data
    const mergedData = {
      ...currentSite,
      ...updateData,
      // Handle special cases like arrays if needed
      languages: updateData.languages || currentSite.languages,
      layout: {
        ...currentSite.layout,
        ...updateData.layout,
      },
    };

    const updatedSite = await prisma.site.update({
      where: {
        id: siteId,
      },
      data: mergedData,
    });

    return {
      status: 200,
      message: "Site updated successfully",
      site: updatedSite,
    };
  } catch (error) {
    console.error("Error updating site:", error);
    return {
      status: 500,
      message: "Failed to update site",
    };
  }
};
