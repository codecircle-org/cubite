import { prisma } from "@/prisma/client";

export const getLanguages = async () => {
  try {
    const languages = await prisma.language.findMany();
    return {
      status: 200,
      languages: languages.map((lang) => ({
        id: lang.id,
        code: lang.code,
        name: lang.name,
      })),
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error fetching languages",
    };
  }
};
