import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword!
        );

        return passwordsMatch ? user : null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  callbacks: {
    async session({ session, token }) {
      // Fetch the user from the database using the email from the session
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          administratedSites: true,
          siteRoles: true,
          organizations: true,
        },
      });


      // Add the user image and id to the session object
      if (user) {
        session.user.image = user.image;
        session.user.id = user.id;
        session.user.username = user.username;
        session.user.administratedSites = user.administratedSites.map((site) => site.id);
        session.user.roles = user.siteRoles.map((role) => {
          return {
            siteId: role.siteId,
            role: role.role,
          };
        });
        session.user.organizations = user.organizations.map((organization) => organization.id);
        token.administratedSites = user.administratedSites.map((site) => site.id);
        token.roles = user.siteRoles.map((role) => ({
          siteId: role.siteId,
          role: role.role,
        }));
        token.organizations = user.organizations.map((organization) => organization.id);
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
