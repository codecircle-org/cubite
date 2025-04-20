import { prisma } from "@/prisma/client";


export const getCustomDomainsMapping = async () => {
    try {
        const customDomains = await prisma.site.findMany({
            where: {
                customDomain: {
                    not: ""
                },
            },
            select: {
                customDomain: true,
                domainName: true
            }
        });
        return {
            status: 200,
            customDomains: customDomains
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: `Internal server error ${error}`
        };
    }
}