import { prisma } from "@/prisma/client";

export const getPagesBySiteDomain = async (domainName: string) => {
    try {
        const site = await prisma.site.findUnique({
          where: { domainName: domainName },
          select: {
            pages: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                    permalink: true,
                    image: true,
                    blurb: true,
                    isProtected: true,
                    isBlog: true,
                    subjects: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    topics: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    authors: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            }
          },
        });
        return {
          status: 200,
          site,
        };
      } catch (error) {
        console.error("Error fetching pages by domain name", error);
        return {
          status: 500,
          message: "Error fetching pages by domain name",
        };
      }
};
