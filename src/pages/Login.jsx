import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  HiXMark,
} from "react-icons/hi2";

import logo from "../assets/Images/logo.png";

function Login() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [image, setImage] = useState("");

  // POPUP

  const [popup, setPopup] =
    useState({
      show: false,
      message: "",
      type: "error",
    });

  // AUTO CLOSE

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

  // LOGIN

  const handleLogin = () => {

    // EMPTY CHECK

    if (
      !name ||
      !email ||
      !phone ||
      !image
    ) {

      setPopup({
        show: true,
        message:
          "Please fill all details",
        type: "error",
      });

      return;
    }

    // EMAIL CHECK

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

    // PHONE CHECK

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

    // USER

    const user = {

      name,

      email,

      phone,

      image,

      joined:
        new Date().toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        ),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setPopup({
      show: true,
      message:
        "Login Successful",
      type: "success",
    });

    setTimeout(() => {

      navigate("/");

      window.location.reload();

    }, 1200);
  };

  return (

    <div
      className="
      min-h-screen

      bg-[#040714]

      flex items-center justify-center

      overflow-hidden

      relative

      px-5 py-10
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
        max-w-[460px]

        rounded-[35px]

        border border-white/10

        bg-[#071028]/80

        backdrop-blur-2xl

        p-8

        shadow-[0_0_60px_rgba(0,0,0,0.45)]
        "
      >

        {/* LOGO */}

        <div className="flex justify-center mb-8">

          <img
            src={logo}

            className="
            w-[180px]
            object-contain
            "
          />

        </div>

        {/* TITLE */}

        <h1
          className="
          text-white

          text-5xl md:text-6xl

          font-black

          text-center

          mb-3
          "
        >
          Welcome Back
        </h1>

        <p
          className="
          text-gray-400

          text-center

          mb-10

          text-lg
          "
        >
          Login to continue watching
        </p>

        {/* IMAGE */}

        <div
          className="
          flex justify-center

          mb-8
          "
        >

          <label
            className="
            relative

            cursor-pointer

            group
            "
          >

            <input
              type="file"

              accept="image/*"

              className="hidden"

              onChange={handleImage}
            />

            <img
              src={
                image ||

                "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
              }

              className="
              w-32 h-32

              rounded-full

              object-cover

              border-4
              border-cyan-400/50

              shadow-[0_0_35px_rgba(34,211,238,0.45)]

              group-hover:scale-105

              transition-all duration-300
              "
            />

            <div
              className="
              absolute inset-0

              rounded-full

              bg-black/30

              opacity-0

              group-hover:opacity-100

              flex items-center justify-center

              text-white
              text-sm
              font-semibold

              transition-all
              "
            >
              Upload
            </div>

          </label>
        </div>

        {/* INPUTS */}

        <div className="space-y-5">

          {/* NAME */}

          <input
            type="text"

            placeholder="Your Name"

            value={name}

            onChange={(e) =>
              setName(e.target.value)
            }

            className="
            w-full h-[60px]

            rounded-2xl

            bg-white/5

            border border-white/10

            px-5

            text-white
            text-lg

            outline-none

            focus:border-cyan-400/40
            "
          />

          {/* EMAIL */}

          <input
            type="email"

            placeholder="Your Email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            className="
            w-full h-[60px]

            rounded-2xl

            bg-white/5

            border border-white/10

            px-5

            text-white
            text-lg

            outline-none

            focus:border-cyan-400/40
            "
          />

          {/* PHONE */}

          <input
            type="text"

            placeholder="Phone Number"

            value={phone}

            onChange={(e) =>
              setPhone(e.target.value)
            }

            className="
            w-full h-[60px]

            rounded-2xl

            bg-white/5

            border border-white/10

            px-5

            text-white
            text-lg

            outline-none

            focus:border-cyan-400/40
            "
          />

          {/* BUTTON */}

          <button
            onClick={handleLogin}

            className="
            w-full h-[62px]

            rounded-2xl

            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-pink-500

            text-white

            font-bold
            text-xl

            hover:scale-[1.02]

            active:scale-[0.98]

            transition-all duration-300

            shadow-[0_0_35px_rgba(34,211,238,0.35)]
            "
          >
            Continue
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;