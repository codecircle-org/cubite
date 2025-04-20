import { prisma } from "@/prisma/client";

export const getSiteIdByDomain = async (domain: string) => {
  try {
    const site = await prisma.site.findUnique({
      where: {
        domainName: `${domain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`,
      },
      select: {
        id: true,
      },
    });

    if (!site) {
      throw new Error("Site not found");
    }

    return site.id;
  } catch (error) {
    console.error("Error fetching site ID:", error);
    throw error;
  }
};
