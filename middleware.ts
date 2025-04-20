import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Define the protected routes
  const AdminSiteProtectedRoutes = ["/admin"];
  const tenantsProtectedRoutes = ["/dashboard", "/profile", "/settings", "/certificates"];


  // Define the public routes for login and register
  const publicRoutes = ["/auth/signin", "/auth/register", "/unauthorized"];

  
  // Find hostname, if the hostname is main domain or subdomain
  const hostname = request.headers.get("host");
  const mainDomain = process.env.ROOT_URL_WITHOUT_PROTOCOL;
  const isMainDomain = hostname === mainDomain;
  let isSubDomain = !isMainDomain && hostname?.endsWith(mainDomain!);
  let subDomain =
    isSubDomain && hostname?.split(`.${process.env.ROOT_URL_WITHOUT_PROTOCOL}`)[0];
  
  // redirect the user to unauthorized page if user is only student in all sites
  // and there is no administraed site for the user
  if (token && isMainDomain && !request.nextUrl.pathname.startsWith("/unauthorized") && token.roles.every((role: { role: string }) => role.role === "STUDENT") && token.administratedSites.length === 0 && token.organizations.length === 0) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (token && isMainDomain && request.nextUrl.pathname.startsWith("/admin/sites") && token.administratedSites.length === 0 && !token.roles.find((role: { role: string }) => role.role === "MANAGER") && token.organizations.length === 0) {
    return NextResponse.redirect(new URL("/admin/courses", request.url));
  }
  // If it is a subdomain rewrite the request to send it to the domain dynamic route
  // check if it is a custom domain and if yes find the mapped domain
  // const customDomainsResponse = await fetch(`${process.env.ROOT_URL}/api/getCustomDomainsMapping`);
  // const customDomainsData = await customDomainsResponse.json();
  // const customDomains = customDomainsData.customDomains
  const customDomains = [
      // {
      // "customDomain": "codecircle.org",
      // "domainName": "codecircle.cubite.io"
      // },
      {
      "customDomain": "codecircle.org",
      "domainName": "codecircle.codecircle-external.cubite.io"
      },
      {
      "customDomain": "mrjohnstestprep.com",
      "domainName": "mrjohnstestprep.cubite.io"
      },
      {
      "customDomain": "disco.nce.center",
      "domainName": "ncec.cubite.io"
      }
  ]
  // check if the host is a custom domain and if yes find the mapped domainName (which is our subdomain)
  const cutomDomainMap = customDomains.find((domain: { customDomain: string, domainName: string }) => domain.customDomain === hostname);
  const isCustomDomain = cutomDomainMap ? true : false;
  isSubDomain = isCustomDomain ? true : isSubDomain;
  subDomain = isCustomDomain ? cutomDomainMap.domainName.split(`.${process.env.ROOT_URL_WITHOUT_PROTOCOL}`)[0] : subDomain;


  if (isSubDomain) {
    let path = request.nextUrl.pathname;
    if (token && (path === "/auth/register" || path === "/auth/signin")) {
      path = "/";
    }
    if (
      !token &&
      tenantsProtectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      )
    ) {
      path = "/auth/signin";
    }
    return NextResponse.rewrite(new URL(`/${subDomain}${path}`, request.url));
  }

  // Redirect to login if the user is not authenticated and trying to access a protected route
  if (
    !token &&
    AdminSiteProtectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    )
  ) {
    const loginUrl = new URL("/api/auth/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
