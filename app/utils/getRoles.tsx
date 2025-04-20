import { Role } from "@prisma/client";

export const getRoles = () => {
  return Object.values(Role);
};
