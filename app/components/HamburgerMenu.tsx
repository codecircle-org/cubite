import React from "react";

interface MenuItem {
  text: string;
  url: string;
}

const HamburgerMenu = ({menuItems}: {menuItems: MenuItem[]}) => {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
      >
        { menuItems.map((item: MenuItem, index: number) => (
          <li key={index}>
            <a href={item.url}>{item.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HamburgerMenu;
