"use client";

import React, { useState } from "react";
import Link from "next/link";
function SiteLayoutTheme({ site }: { site: Site }) {
  const [theme, setTheme] = useState(site.themeName || "");
  const [fontFamily, setFontFamily] = useState(site.fontFamily || "");
  const [darkModeTheme, setDarkModeTheme] = useState(site.darkModeTheme || "");
  const handleThemeSelect = async (e) => {
    setTheme(e.target.value);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: site.id,
          updateData: {
            themeName: e.target.value,
          },
        }),
      }
    );
  };

  const handleDarkModeThemeSelect = async (e) => {
    setDarkModeTheme(e.target.value);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
      {
        method: "PUT",
        body: JSON.stringify({
          siteId: site.id,
          updateData: {
            darkModeTheme: e.target.value,
          },
        }),
      }
    );
  };

  const handleFontFamilySelect = async (e) => {
    setFontFamily(e.target.value);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
      {
        method: "PUT",
        body: JSON.stringify({
          siteId: site.id,
          updateData: {
            fontFamily: e.target.value,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return (
    <div className="collapse collapse-arrow bg-base-200 my-2">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title text-xl font-semibold">Theme</div>
      <div className="collapse-content">
        <div className="m-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Theme Name */}
          <div className="sm:col-span-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Theme Name</span>
              </div>
              <select
                name="theme"
                required
                className="select select-bordered"
                defaultValue={site.themeName}
                onChange={handleThemeSelect}
              >
                <option value="lofi">Lofi</option>
                <option value="winter">Winter</option>
                <option value="dark">Dark</option>
                <option value="luxury">Luxury</option>
                <option value="forest">Forest</option>
                <option value="autumn">Autumn</option>
                <option value="rmu">Rmu</option>
                <option value="ocean">Ocean</option>
                <option value="codeCircle">Code Circle</option>
                <option value="dim">Dim</option>
                <option value="lemonade">Lemonade</option>
                <option value="emerald">Emerald</option>
                <option value="ncec">NCEC</option>
                <option value="parley">Parley</option>
              </select>
            </label>
          </div>
          {/* Dark Mode Theme */}
          <div className="sm:col-span-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Dark Mode Theme</span>
              </div>
              <select
                name="darkModeTheme"
                required
                className="select select-bordered"
                defaultValue={site.darkModeTheme || "dim"}
                onChange={handleDarkModeThemeSelect}
              >
                  <option value="dark">Dark</option>
                  <option value="forest">Forest</option>
                  <option value="black">Black</option>
                  <option value="dracula">Dracula</option>
                  <option value="synthwave">Synthwave</option>
                  <option value="business">Business</option>
                  <option value="night">Night</option>
                  <option value="coffee">Coffee</option>
                  <option value="dim">Dim</option>
                  <option value="sunset">Sunset</option>
              </select>
            </label>
          </div>
          {/* Font Family */}
          <div className="sm:col-span-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Font Family <Link target="_blank" href="https://fonts.google.com/variablefonts" className="link link-primary text-xs">Google Variable Font</Link> </span>
              </div>
              <select
                name="fontFamily"
                required
                className="select select-bordered"
                defaultValue={site.fontFamily}
                onChange={handleFontFamilySelect}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Nunito">Nunito</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Trade Gothic">Trade Gothic</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteLayoutTheme;
