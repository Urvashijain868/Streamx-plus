import { useState, useRef, useEffect } from "react";

import {
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiXMark,
} from "react-icons/hi2";

import { useNavigate } from "react-router-dom";

function ProfileMenu() {

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState(null);

  const menuRef = useRef();

  const navigate = useNavigate();

  // LOAD USER LIVE

  useEffect(() => {

    const loadUser = () => {

      const savedUser =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (savedUser) {

        setUser(savedUser);
      }
    };

    loadUser();

    window.addEventListener(
      "userUpdated",
      loadUser
    );

    return () => {

      window.removeEventListener(
        "userUpdated",
        loadUser
      );
    };

  }, []);

  // OUTSIDE CLICK

  useEffect(() => {

    const handler = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {

        setOpen(false);
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

  // LOGOUT

  const logout = () => {

    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  return (

    <div
      className="relative"
      ref={menuRef}
    >

      {/* AVATAR */}

      <button
        onClick={() => setOpen(!open)}

        className="
        relative

        w-[40px] h-[40px]
        md:w-[52px] md:h-[52px]

        rounded-full
        overflow-hidden

        border-2 border-cyan-400/60

        hover:scale-105

        transition-all duration-300

        shadow-[0_0_20px_rgba(34,211,238,0.35)]
        "
      >

        <img
          src={
            user?.image ||
            "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
          }

          className="
          w-full h-full
          object-cover
          "
        />

      </button>

      {/* DROPDOWN */}

      {open && (

        <div
          className="
          absolute right-0 top-16

          w-[340px]

          rounded-[32px]
          overflow-hidden

          border border-white/10

          bg-[#071028]/95
          backdrop-blur-2xl

          shadow-[0_0_50px_rgba(0,0,0,0.45)]

          z-[9999]

          animate-[fadeIn_.25s_ease]
          "
        >

          {/* TOP */}

          <div
            className="
            relative

            flex items-center gap-4

            p-5

            border-b border-white/10
            "
          >

            <img
              src={
                user?.image ||
                "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
              }

              className="
              w-16 h-16

              rounded-full

              border border-cyan-400/50

              object-cover
              "
            />

            <div>

              <h2
                className="
                text-white
                font-bold
                text-2xl
                "
              >
                {user?.name || "Guest"}
              </h2>

              <p
                className="
                text-gray-400
                text-sm
                "
              >
                {user?.email || "streamx@gmail.com"}
              </p>

              <p
                className="
                text-gray-500
                text-xs
                mt-1
                "
              >
                {user?.phone || "+91 XXXXX XXXXX"}
              </p>

              <p
                className="
                text-cyan-300/80
                text-xs
                mt-1
                "
              >
                Joined {user?.joined || "Recently"}
              </p>

            </div>

            {/* CLOSE BUTTON */}

            <button
              onClick={() =>
                setOpen(false)
              }

              className="
              absolute

              top-4
              right-4

              text-gray-400

              hover:text-white

              transition-all duration-300
              "
            >

              <HiXMark className="text-2xl" />

            </button>

          </div>

          {/* MENU */}

          <div className="p-3">

            {/* WATCHLIST */}

            <button
              onClick={() => {

                navigate("/watchlist");

                setOpen(false);
              }}

              className="
              w-full

              flex items-center gap-4

              px-4 py-5

              rounded-2xl

              text-white

              hover:bg-white/5

              transition-all duration-300
              "
            >

              <HiOutlineHeart className="text-3xl" />

              <span className="text-[22px]">
                Watchlist
              </span>

            </button>

            {/* CONTINUE WATCHING */}

            <button
              onClick={() => {

                const recentMovie =
                  JSON.parse(
                    localStorage.getItem(
                      "continueWatching"
                    )
                  );

                if (recentMovie?.id) {

                  navigate(
                    `/player/${recentMovie.id}`
                  );

                } else {

                  navigate("/watchlist");
                }

                setOpen(false);
              }}

              className="
              w-full

              flex items-center gap-4

              px-4 py-5

              rounded-2xl

              text-white

              hover:bg-white/5

              transition-all duration-300
              "
            >

              <HiOutlineClock className="text-3xl" />

              <span
                className="
                text-[22px]
                whitespace-nowrap
                "
              >
                Continue Watching
              </span>

            </button>

            {/* SETTINGS */}

            <button

              onClick={() => {

                navigate("/settings");

                setOpen(false);
              }}

              className="
              w-full

              flex items-center gap-4

              px-4 py-5

              rounded-2xl

              text-white

              hover:bg-white/5

              transition-all duration-300
              "
            >

              <HiOutlineCog6Tooth className="text-3xl" />

              <span className="text-[22px]">
                Settings
              </span>

            </button>

            {/* LOGOUT */}

            <button
              onClick={logout}

              className="
              w-full

              flex items-center gap-4

              px-4 py-5

              rounded-2xl

              text-red-400

              hover:bg-red-500/10

              transition-all duration-300
              "
            >

              <HiOutlineArrowRightOnRectangle className="text-3xl" />

              <span className="text-[22px]">
                Logout
              </span>

            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;