import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Site } from "@prisma/client";
import createSSOStudentUser from "@/app/utils/createSSOStudentUser";
import { encode } from "next-auth/jwt";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const accessTokenUrl = "https://github.com/login/oauth/access_token";
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
          domainName: subDomain || "",
        },
      });
    } else if (customDomain) {
      site = await prisma.site.findUnique({
        where: {
          customDomain: hostname || "",
        },
      });
    }
    const code = request.nextUrl.searchParams.get("code");
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    const githubClientId = site.ssoProviders?.githubClientId;
    const githubClientSecret = site.ssoProviders?.githubClientSecret;
    const accessTokenResponse = await fetch(accessTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: githubClientId,
        client_secret: githubClientSecret,
      }),
    });
    const accessTokenData = await accessTokenResponse.json();
    const accessToken = accessTokenData.access_token;
    
    // Fetch user data
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await userResponse.json();

    // If email is not available in userData, fetch it separately
    let userEmail = userData.email;
    if (!userEmail) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const emails = await emailResponse.json();
      
      // Find the primary email or the first verified email
      const primaryEmail = emails.find((email: any) => email.primary && email.verified);
      const verifiedEmail = emails.find((email: any) => email.verified);
      userEmail = primaryEmail?.email || verifiedEmail?.email;

      if (!userEmail) {
        return NextResponse.json(
          { error: "No verified email found for this GitHub account" },
          { status: 400 }
        );
      }
    }

    if (userResponse.status === 200) {
      const createUserResponse = await createSSOStudentUser({
        username: userData.login,
        name: userData.name || userData.login, // Use login as fallback if name is null
        email: userEmail,
        siteId: site.id,
      });
      
      if (createUserResponse.status === 201 || createUserResponse.status === 409) {
        // generate next auth session token and login the user to the dashboard
        const sessionToken = await encode({
          secret: process.env.NEXTAUTH_SECRET!,
          token: {
            id: createUserResponse.user?.id,
            name: userData.name || userData.login,
            email: userEmail,
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
    
    return NextResponse.json(
      { error: "Failed to fetch user data from GitHub" },
      { status: 500 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
