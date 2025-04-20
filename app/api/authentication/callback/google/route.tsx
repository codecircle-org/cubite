import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Site } from "@prisma/client";
import createSSOStudentUser from "@/app/utils/createSSOStudentUser";
import { encode } from "next-auth/jwt";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const accessTokenUrl = "https://oauth2.googleapis.com/token";
    const hostname = request.headers.get("host");
    const postLoginRedirect = `${
      process.env.NODE_ENV === "development" ? "http://" : "https://"
    }${hostname}/dashboard`;
    const mainDomain =
      process.env.NODE_ENV === "production"
        ? process.env.ROOT_URL_WITHOUT_PROTOCOL
        : "localhost:3000";
    const isMainDomain = hostname === mainDomain;
    let isSubDomain = !isMainDomain && hostname?.endsWith(mainDomain!);
    let subDomain =
      isSubDomain &&
      `${hostname?.split(`.${mainDomain}`)[0]}.${process.env.MAIN_DOMAIN}`;
    const customDomain = !isSubDomain && !isMainDomain;
    let site: Site | null = null;
    if (isSubDomain) {
      site = await prisma.site.findUnique({
        where: {
          domainName: subDomain,
        },
      });
    } else if (customDomain) {
      site = await prisma.site.findUnique({
        where: {
          customDomain: hostname,
        },
      });
    }
    const code = request.nextUrl.searchParams.get("code");
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    const googleClientId = site.ssoProviders?.googleClientId;
    const googleClientSecret = site.ssoProviders?.googleClientSecret;
    const accessTokenResponse = await fetch(accessTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: `${
          process.env.NODE_ENV === "development" ? "http://" : "https://"
        }${hostname}/api/authentication/callback/google`,
        grant_type: "authorization_code",
      }),
    });
    const accessTokenData = await accessTokenResponse.json();
    const accessToken = accessTokenData.access_token;
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userData = await userResponse.json();
    if (userResponse.status === 200) {
      const createUserResponse = await createSSOStudentUser({
        username: userData.email.split("@")[0],
        name: userData.name,
        email: userData.email,
        siteId: site.id,
      });
      if (
        createUserResponse.status === 201 ||
        createUserResponse.status === 409
      ) {
        // generate next auth session token and login the user to the dashboard
        const sessionToken = await encode({
          secret: process.env.NEXTAUTH_SECRET,
          token: {
            id: createUserResponse.user.id,
            name: userData.name,
            email: userData.email,
            accessToken,
          },
        });

        const response = NextResponse.redirect(
          new URL(postLoginRedirect, request.url)
        );

        // Set the cookie using NextResponse
        response.cookies.set({
          name:
            process.env.NODE_ENV === "production"
              ? "__Secure-next-auth.session-token"
              : "next-auth.session-token",
          value: sessionToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        return response;
      } else {
        return NextResponse.json(
          { error: "User creation failed" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
