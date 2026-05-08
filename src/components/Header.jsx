import {
  useState,
  useEffect,
  useRef
} from "react";
import ProfileMenu from "../components/ProfileMenu";
import logo from "./../assets/Images/logo.png";
import HeaderItem from "./HeaderItem.jsx";

import {
  HiHome,
  HiMagnifyingGlass,
  HiStar,
  HiPlayCircle,
  HiTv
} from "react-icons/hi2";

import { HiPlus, HiDotsVertical } from "react-icons/hi";

import { NavLink, useNavigate } from "react-router-dom";

function Header() {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef();

  // 🔥 SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // CLOSE MOBILE MENU
  useEffect(() => {

    const handler = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {

        setToggle(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );

  }, []);

  // ✅ MENU
  const menu = [
    { name: "HOME", icon: HiHome, path: "/" },
    { name: "SEARCH", icon: HiMagnifyingGlass, path: "/search" },
    { name: "WATCH LIST", icon: HiPlus, path: "/watchlist" },
    { name: "ORIGINALS", icon: HiStar, path: "/originals" },
    { name: "MOVIES", icon: HiPlayCircle, path:"/movies" },
    { name: "SERIES", icon: HiTv, path:"/series"}
  ];

  return (
    <>
      <div
        className={`
          fixed top-0 left-0
          w-full z-[999]

          flex items-center justify-between

          px-2 md:px-6
          h-[64px] md:h-[76px]

          transition-all duration-500

          ${
            scrolled
              ? `
                bg-[#040714]/55
                backdrop-blur-2xl
                border-b border-white/5
                shadow-[0_8px_35px_rgba(0,0,0,0.45)]
              `
              : `
                bg-gradient-to-b
                from-[#040714]/80
                via-[#040714]/40
                to-transparent
              `
          }
        `}
      >
        {/* LEFT SECTION */}
        <div className="flex items-center h-full">

          {/* LOGO */}
          <img
            src={logo}
            onClick={() => navigate("/")}
            className="
              w-[145px]
              md:w-[240px]

              object-contain
              cursor-pointer

              flex-shrink-0

              -ml-2 md:ml-0

              hover:scale-105

              transition-transform duration-300
            "
          />

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center h-full ml-2 lg:ml-8 gap-2 lg:gap-6 overflow-hidden">            
              {menu.map((item) =>
              item.path ? (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex items-center
                    h-full

                    text-[11px] lg:text-[15px]
                    font-semibold whitespace-nowrap

                    px-1

                    transition-all duration-300

                    hover:text-cyan-400
                    hover:scale-105

                    ${
                      isActive
                        ? "text-cyan-400"
                        : "text-white"
                    }
                  `
                  }
                >
                  <HeaderItem
                    name={item.name}
                    Icon={item.icon}
                  />
                </NavLink>
              ) : (
                <div
                  key={item.name}
                  className="
                    flex items-center
                    h-full

                    text-white

                    hover:text-cyan-400
                    hover:scale-105

                    transition-all duration-300
                  "
                >
                  <HeaderItem
                    name={item.name}
                    Icon={item.icon}
                  />
                </div>
              )
            )}
          </div>

          {/* MOBILE MENU */}
          <div className="flex md:hidden items-center ml-3 gap-5 h-full">
            {menu.slice(0, 3).map((item) =>
              item.path ? (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="
                    flex items-center justify-center
                    h-full
                    text-white

                    hover:text-cyan-400
                    hover:scale-110

                    transition-all duration-300
                  "
                >
                  <HeaderItem
                    name=""
                    Icon={item.icon}
                  />
                </NavLink>
              ) : (
                <div
                  key={item.name}
                  className="
                    flex items-center justify-center
                    h-full
                    text-white

                    hover:text-cyan-400
                    hover:scale-110

                    transition-all duration-300
                  "
                >
                  <HeaderItem
                    name=""
                    Icon={item.icon}
                  />
                </div>
              )
            )}

            {/* MORE */}
            <div
              ref={menuRef}

              onClick={() =>
                setToggle(!toggle)
              }
              className="
                relative

                flex items-center justify-center
                h-full

                cursor-pointer
                text-white

                hover:text-cyan-400
                hover:scale-110

                transition-all duration-300
              "
            >
              <HeaderItem
                name=""
                Icon={HiDotsVertical}
              />

              {toggle && (
                <div
                  className="
                    absolute right-0 top-[60px]

                    bg-[#0f172a]/90
                    backdrop-blur-2xl

                    border border-white/10

                    rounded-2xl
                    p-4

                    min-w-[180px]

                    shadow-[0_10px_40px_rgba(0,0,0,0.45)]
                  "
                >
                  {menu.slice(3).map((item) =>
                    item.path ? (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setToggle(false)}
                      >
                        <HeaderItem
                          name={item.name}
                          Icon={item.icon}
                        />
                      </NavLink>
                    ) : (
                      <div key={item.name}>
                        <HeaderItem
                          name={item.name}
                          Icon={item.icon}
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

{/* PROFILE */}

      <div className="flex items-center justify-center h-full flex-shrink-0 ml-auto pl-2">

        <ProfileMenu />

      </div>
      </div>

      {/* HEADER SPACER */}
      <div className="h-[64px] md:h-[76px]" />
    </>
  );
}

export default Header;