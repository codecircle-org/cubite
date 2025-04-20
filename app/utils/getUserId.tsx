import { prisma } from "@/prisma/client";

export const getUserId = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: { id: true },
  });

  if (!user) {
    return {
      status: 404,
      message: "user not found",
    };
  }
  return {
    status: 200,
    message: "Successfully fetched user id",
    id: user.id,
  };
};
