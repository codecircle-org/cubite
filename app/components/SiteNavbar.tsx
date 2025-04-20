"use client";

import React from "react";
import { CldImage } from "next-cloudinary";
import { Image } from "@/app/components/Image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
// import { useTranslation } from "@/app/hooks/useTranslation";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import HamburgerMenu from "@/app/components/HamburgerMenu";
import DarkModeToggle from "@/app/components/DarkModeToggle";

interface Site {
  name: string;
  logo: string;
  darkModeTheme: string;
  isOpenedxSite: boolean;
  openedxSiteUrl: string;
}

interface HeaderLinks {
  url: string;
  text: string;
  type: string;
}

interface Props {
  site: Site;
  headerLinks: HeaderLinks[];
}

const SiteNavbar = ({ site, headerLinks }: Props) => {
  // const translate = useTranslation();
  const { status, data: session } = useSession();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [isUserLoggedInOpenedx, setIsUserLoggedInOpenedx] =
    useState<boolean>(false);
  const [openedxUserInfo, setOpenedxUserInfo] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedLanguage = getLocalStorage("selectedLanguage");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    } else if (site.languages.length > 0) {
      // Set default language if no stored language
      setSelectedLanguage(site.languages[0].code);
    }

    if (site.isOpenedxSite) {
      setIsUserLoggedInOpenedx(getCookie("edxloggedin") == "true");

      const userInfoValue = getCookie("edx-user-info");
      if (userInfoValue) {
        try {
          const parsedUserInfo = JSON.parse(decodeURIComponent(userInfoValue));
          setOpenedxUserInfo(parsedUserInfo);
        } catch (error) {
          console.error("Failed to parse edxuserinfo:", error);
          setOpenedxUserInfo(null);
        }
      }
    }

    const darkModeEnabled = getCookie('darkModeEnabled');
    setIsDarkMode(darkModeEnabled === 'true');
  }, [site.languages, site.isOpenedxSite]);

  const handleSignout = async () => {
    deleteCookie("__Secure-next-auth.session-token");
    deleteCookie("next-auth.session-token");
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  const renderAvatar = () => {
    if (session?.user?.image) {
      return (
        <div className="avatar">
          <div className="w-12 h-12 rounded-xl">
            <CldImage
              fill
              className="rounded-full"
              src={session?.user?.image}
              sizes="100vw"
              alt="Description of my image"
            />
          </div>
        </div>
      );
    } else if (session?.user?.name) {
      const initial = session.user.name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 text-white">
          {initial}
        </div>
      );
    } else {
      return <div className="w-10 h-10 rounded-full bg-gray-300"></div>;
    }
  };
  return (
    <div className="bg-base-200 shadow-sm site-navbar">
      <div className="navbar mx-auto max-w-7xl p-6 lg:px-8">
        <div className="navbar-start">
          <HamburgerMenu
            menuItems={headerLinks}
          />
          <Link href={session?.user ? site.domainName.includes("ncec") ? "https://nce.center" : "/dashboard" : site.domainName.includes("ncec") ? "https://nce.center" : "/"} className="">
            <CldImage
              src={isDarkMode && site.logoDark ? site.logoDark : (site.logo || "courseCovers/600x400_er61hk")}
              width={140}
              height={100}
              alt={`${site.name} logo`}
              sizes="100vw"
              className="max-h-42"
              id="logo"
            />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {headerLinks
              .filter(
                (link) =>
                  !(
                    (link.text.toLocaleLowerCase() === "login" ||
                      link.text.toLocaleLowerCase() === "register") &&
                    site.isOpenedxSite &&
                    isUserLoggedInOpenedx
                  )
              )
              .map((link) => {
                if (
                  (link.url === "/auth/signin" ||
                    link.url === "/auth/register") &&
                  session
                ) {
                  return null;
                }
                return link.type === "internal" || link.type === "external" ? (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      className="navigation-link hover:text-primary hover:bg-transparent text-base tracking-wide font-medium"
                    >
                      {link.text}
                    </a>
                  </li>
                ) : null;
              })}
          </ul>
        </div>
        <div className="navbar-end hidden lg:flex">
          <DarkModeToggle 
            darkModeTheme={site.darkModeTheme} 
            onDarkModeChange={(isDark) => setIsDarkMode(isDark)}
          />
          {site.languages.length > 0 && (
            <select
              value={selectedLanguage}
              onChange={(e) => {
                const selectedLanguage = e.target.value;
                setLocalStorage("selectedLanguage", selectedLanguage);
                setCookie("selectedLanguage", selectedLanguage, {
                  maxAge: 30 * 24 * 60 * 60,
                }); // 30 days
                window.location.reload(); // Reload to apply the language change
              }}
              className="select select-bordered"
            >
              {site.languages.map((language) => (
                <option key={language.id} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          )}
          {headerLinks
            .filter(
              (link) =>
                !(
                  (link.text.toLocaleLowerCase() === "login" ||
                    link.text.toLocaleLowerCase() === "register") &&
                  site.isOpenedxSite &&
                  isUserLoggedInOpenedx
                )
            )
            .map((link, index) => {
              if (
                (link.url === "/auth/signin" ||
                  link.url === "/auth/register") &&
                session
              ) {
                return null;
              }

              return link.type === "neutral-button" ? (
                <a
                  key={index}
                  className="btn btn-ghost btn-outline mx-2 tracking-wide"
                  href={link.url}
                >
                  {link.text}
                </a>
              ) : link.type === "primary-button" ? (
                <a
                  key={index}
                  className="btn btn-primary mx-2 px-8 tracking-wide"
                  href={link.url}
                >
                  {link.text}
                </a>
              ) : null;
            })}
          {site.isOpenedxSite && isUserLoggedInOpenedx && (
            <>
              <a
                className="btn btn-primary mx-2"
                href={`${site.openedxSiteUrl.replace(
                  "https://",
                  "https://apps."
                )}/learner-dashboard/`}
              >
                Dashboard
              </a>
              <a
                className="btn btn-ghost btn-outline mx-2"
                href={`${site.openedxSiteUrl}/logout`}
              >
                Logout
              </a>
            </>
          )}
          {session && status === "authenticated" && (
            <>
              <button className="btn btn-ghost btn-circle mx-2">
                <div className="indicator">
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </div>
              </button>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="">
                  {renderAvatar()}
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link href={session?.user ? site.domainName.includes("ncec") ? "/portal" : "/dashboard" : "/"} className="justify-between">
                      {site.domainName.includes("ncec") ? "Portal" : "Dashboard"}
                    </Link>
                  </li>
                  <li>
                    <Link href={"/profile"} className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleSignout}>Logout</button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteNavbar;
