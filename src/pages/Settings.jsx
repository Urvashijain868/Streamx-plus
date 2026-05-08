import { useEffect, useState } from "react";

import {
  HiXMark,
} from "react-icons/hi2";

function Settings() {

  const [user, setUser] =
    useState(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [image, setImage] =
    useState("");

  // CUSTOM POPUP

  const [popup, setPopup] =
    useState({
      show: false,
      message: "",
      type: "success",
    });

  // LOAD USER

  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (saved) {

  requestAnimationFrame(() => {

    setUser(saved);

    setName(saved.name || "");

    setEmail(saved.email || "");

    setPhone(saved.phone || "");

    setImage(saved.image || "");

  });
}
}, []);

  // AUTO CLOSE POPUP

  useEffect(() => {

    if (popup.show) {

      const timer = setTimeout(() => {

        setPopup({
          ...popup,
          show: false,
        });

      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [popup]);

  // IMAGE

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // SAVE

  const saveChanges = () => {

    // EMAIL VALIDATION

    if (
      !email.includes("@gmail.com")
    ) {

      setPopup({
        show: true,
        message:
          "Email must contain @gmail.com",
        type: "error",
      });

      return;
    }

    // PHONE VALIDATION

    if (
      phone.length !== 10 ||
      isNaN(phone)
    ) {

      setPopup({
        show: true,
        message:
          "Phone number must be exactly 10 digits",
        type: "error",
      });

      return;
    }

    const updatedUser = {

      ...user,

      name,

      email,

      phone,

      image,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setPopup({
      show: true,
      message:
        "Profile Updated Successfully",
      type: "success",
    });

    // UPDATE WITHOUT RELOAD

    setUser(updatedUser);

    window.dispatchEvent(
      new Event("userUpdated")
    );
  };

  return (

    <div
      className="
      min-h-screen

      bg-[#040714]

      flex items-center justify-center

      px-5 py-10

      relative overflow-hidden
      "
    >

      {/* BG */}

      <div
        className="
        absolute inset-0

        bg-gradient-to-br
        from-cyan-500/10
        via-transparent
        to-pink-500/10
        "
      />

      <div
        className="
        absolute

        w-[400px] h-[400px]

        bg-cyan-500/20

        blur-[140px]

        rounded-full

        top-[-100px]
        left-[-100px]
        "
      />

      <div
        className="
        absolute

        w-[400px] h-[400px]

        bg-pink-500/20

        blur-[140px]

        rounded-full

        bottom-[-100px]
        right-[-100px]
        "
      />

      {/* POPUP */}

      {popup.show && (

        <div
          className={`
          fixed top-5 right-5

          z-[9999]

          min-w-[320px]

          rounded-2xl

          px-5 py-4

          flex items-center justify-between gap-4

          shadow-[0_0_40px_rgba(0,0,0,0.45)]

          border

          animate-[fadeIn_.25s_ease]

          ${
            popup.type === "success"

              ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"

              : "bg-red-500/10 border-red-400/30 text-red-300"
          }
          `}
        >

          <p className="font-medium">
            {popup.message}
          </p>

          <button
            onClick={() =>
              setPopup({
                ...popup,
                show: false,
              })
            }
          >

            <HiXMark className="text-2xl" />

          </button>

        </div>
      )}

      {/* CARD */}

      <div
        className="
        relative z-20

        w-full
        max-w-[650px]

        rounded-[40px]

        border border-white/10

        bg-[#071028]/80
        backdrop-blur-2xl

        p-10

        shadow-[0_0_60px_rgba(0,0,0,0.45)]
        "
      >

        {/* TITLE */}

        <h1
          className="
          text-white

          text-5xl md:text-7xl

          font-black

          mb-10
          "
        >
          Profile Settings
        </h1>

        {/* IMAGE */}

        <div
          className="
          flex justify-center

          mb-10
          "
        >

          <label
            className="
            cursor-pointer

            relative group
            "
          >

            <input
              type="file"

              className="hidden"

              accept="image/*"

              onChange={handleImage}
            />

            <img
              src={
                image ||

                "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
              }

              className="
              w-40 h-40

              rounded-full

              object-cover

              border-4
              border-cyan-400/40

              shadow-[0_0_35px_rgba(34,211,238,0.35)]

              group-hover:scale-105

              transition-all duration-300
              "
            />

            <div
              className="
              absolute inset-0

              rounded-full

              bg-black/40

              opacity-0

              group-hover:opacity-100

              flex items-center justify-center

              text-white
              font-semibold

              transition-all
              "
            >
              Change Photo
            </div>

          </label>
        </div>

        {/* INPUTS */}

        <div className="space-y-5">

          {/* NAME */}

          <input
            type="text"

            value={name}

            placeholder="Your Name"

            onChange={(e) =>
              setName(e.target.value)
            }

            className="
            w-full h-[65px]

            rounded-2xl

            bg-white/5

            border border-white/10

            px-7

            text-white
            text-lg

            outline-none

            focus:border-cyan-400/40
            "
          />

          {/* EMAIL */}

          <input
            type="email"

            value={email}

            placeholder="Your Email"

            onChange={(e) =>
              setEmail(e.target.value)
            }

            className="
            w-full h-[65px]

            rounded-2xl

            bg-white/5

            border border-white/10

            px-7

            text-white
            text-lg

            outline-none

            focus:border-cyan-400/40
            "
          />

          {/* PHONE */}

          <input
            type="text"

            value={phone}

            placeholder="Phone Number"

            onChange={(e) =>
              setPhone(e.target.value)
            }

            className="
            w-full h-[65px]

            rounded-2xl

            bg-white/5

            border border-white/10

            px-7

            text-white
            text-lg

            outline-none

            focus:border-cyan-400/40
            "
          />

          {/* BUTTON */}

          <button
            onClick={saveChanges}

            className="
            w-full h-[68px]

            rounded-2xl

            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-pink-500

            text-white

            font-bold
            text-2xl

            hover:scale-[1.01]

            active:scale-[0.98]

            transition-all duration-300

            shadow-[0_0_35px_rgba(34,211,238,0.35)]
            "
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}

export default Settings;