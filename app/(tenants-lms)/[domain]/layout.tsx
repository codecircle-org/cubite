import React, { ReactNode } from "react";
import { Image } from "@/app/components/Image";
import { FaFacebookF } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { BsTwitterX } from "react-icons/bs";
import "../../globals.css";
import AuthProvider from "./auth/Provider";
import SiteNavbar from "@/app/components/SiteNavbar";
import { Inter } from "next/font/google";
import { Roboto } from "next/font/google";
import { Poppins } from "next/font/google";
import { Montserrat } from "next/font/google";
import { Lato } from "next/font/google";
import { Nunito } from "next/font/google";
import { Open_Sans } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Metadata } from 'next'
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import localFont from 'next/font/local'

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  children: ReactNode;
  params: {
    domain: string;
  };
}

async function getSites() {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/getSitesPublicData`,
    { cache: "no-store" }
  );
  const result = await response.json();
  return result;
}

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });
const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400", "700", "900"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });
const openSans = Open_Sans({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const nunito = Nunito({ subsets: ["latin"] });
const tradeGothic = localFont({
  src: [
    {
      path: '../../../public/fonts/TradeGothic.woff2',
      weight: "400",
      style: "normal",
    },
    {
      path: '../../../public/fonts/TradeGothic-BoldCondTwenty.woff',
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-trade-gothic",
});

// Move the decode function outside the component
const decodeHtmlEntities = (str: string) => {
  if (typeof window === 'undefined') {
    // Server-side decoding
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  } else {
    // Client-side decoding using DOM
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }
};

const SitesLayout = async ({ children, params }: Props) => {
  const result = await getSites();
  let site;
  let footerColumns = [];
  let facebook, instagram, tiktok, youtube, x;
  let headerLinks = [];
  const locale = await getLocale();
  const messages = await getMessages();
  
  // Get dark mode preference from cookie
  const darkModeEnabled = cookies().get('darkModeEnabled')?.value === 'true';

  if (result.status === 200) {
    site = result.sites.find(
      (s) =>
        s.domainName.split(`.${process.env.MAIN_DOMAIN}`)[0] === params.domain
    );
  }

  const isOpenedxSite = site?.isOpenedxSite || false;
  if (site?.layout?.header?.headerLinks) {
    headerLinks = site.layout.header.headerLinks;
  }

  if (site?.layout?.footer) {
    ({ x, tiktok, youtube, facebook, instagram } =
      site.layout.footer.socialMedia || {});
    // Calculate the number of columns and distribute footer links across columns
    const footerLinks = site.layout.footer.footerLinks || [];
    const columns = Math.ceil(footerLinks.length / 3);
    footerColumns = Array.from({ length: columns }, (_, index) =>
      footerLinks.slice(index * 3, index * 3 + 3)
    );
  }
  const fontFamily = site?.fontFamily || "Inter";
  const fontClass = fontFamily === "Inter"
    ? inter
    : fontFamily === "Roboto"
    ? roboto
    : fontFamily === "Poppins"
    ? poppins
    : fontFamily === "Lato"
    ? lato
    : fontFamily === "Montserrat"
    ? montserrat
    : fontFamily === "Open Sans"
    ? openSans
    : fontFamily === "Playfair Display"
    ? playfairDisplay
    : fontFamily === "Trade Gothic"
    ? tradeGothic
    : nunito;

  // Decode custom CSS
  const decodedCustomCss = site?.customCss ? decodeHtmlEntities(site.customCss) : '';

  return (

    <html data-theme={site.themeName} lang={locale}>
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href={
            site.favicon
              ? `https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_3840/f_auto/q_auto/v1/${site.favicon}`
              : "/favicon.ico"
          }
        />
        <style dangerouslySetInnerHTML={{ __html: decodedCustomCss }} />
        <title>{site?.name}</title>
      </head>
      <body className={fontClass.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
          <Toaster position="top-right" />
            <div className="">
              {site ? (
                <div className="min-h-screen">
                  <SiteNavbar site={site} headerLinks={headerLinks} />
                  {/* page content */}
                  <div className="mx-auto max-w-7xl">{children}</div>
                  {/* Footer Content */}
                  <div className="bg-base-200 sticky top-[100vh]">
                    <div className="mx-auto max-w-7xl">
                      <footer className="footer p-10 text-base-content">
                        <nav className="grid grid-cols-1 md:grid-cols-3 gap-12">
                          {footerColumns.map((column, index) => (
                            <div
                              key={index}
                              className="flex flex-col space-y-2"
                            >
                              {column.map((link) => (
                                <a
                                  key={link.url}
                                  href={link.url}
                                  className="hover:text-primary"
                                >
                                  {link.text}
                                </a>
                              ))}
                            </div>
                          ))}
                        </nav>
                      </footer>
                      <footer className="footer px-10 py-4 border-t text-base-content border-base-300">
                        <aside className="items-center grid-flow-col">
                          <Image
                            src={
                              darkModeEnabled && site?.logoDark
                                ? site.logoDark
                                : site?.logo || "courseCovers/600x400_er61hk"
                            }
                            width={120}
                            height={120}
                            alt="test"
                            sizes="100vw"
                          />
                          <p className="mx-2">
                            {site?.layout?.footer?.copyrightText &&
                              site.layout.footer.copyrightText}
                          </p>
                        </aside>
                        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end" aria-label="Social Media Links">
                          {facebook && (
                            <a 
                              href={facebook} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="Visit our Facebook page"
                              className="hover:opacity-80 transition-opacity"
                            >
                              <FaFacebookF className="w-6 h-6" aria-hidden="true" />
                              <span className="sr-only">Facebook</span>
                            </a>
                          )}
                          {instagram && (
                            <a 
                              href={instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="Visit our Instagram profile"
                              className="hover:opacity-80 transition-opacity"
                            >
                              <BsInstagram className="w-6 h-6" aria-hidden="true" />
                              <span className="sr-only">Instagram</span>
                            </a>
                          )}
                          {tiktok && (
                            <a 
                              href={tiktok} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="Visit our TikTok profile"
                              className="hover:opacity-80 transition-opacity"
                            >
                              <FaTiktok className="w-6 h-6" aria-hidden="true" />
                              <span className="sr-only">TikTok</span>
                            </a>
                          )}
                          {youtube && (
                            <a 
                              href={youtube} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="Visit our YouTube channel"
                              className="hover:opacity-80 transition-opacity"
                            >
                              <IoLogoYoutube className="w-8 h-8" aria-hidden="true" />
                              <span className="sr-only">YouTube</span>
                            </a>
                          )}
                          {x && (
                            <a 
                              href={x} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label="Visit our X (formerly Twitter) profile"
                              className="hover:opacity-80 transition-opacity"
                            >
                              <BsTwitterX className="w-6 h-6" aria-hidden="true" />
                              <span className="sr-only">X (Twitter)</span>
                            </a>
                          )}
                        </nav>
                      </footer>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Site not found</p>
              )}
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default SitesLayout;
