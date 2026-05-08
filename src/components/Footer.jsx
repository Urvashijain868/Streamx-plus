import logo from "../assets/Images/logo.png";

import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

function Footer() {
  return (
    <footer
      className="
        w-full
        bg-[#07131f]
        text-white
        mt-16
        border-t border-white/10
      "
    >
      <div
        className="
          w-full
          max-w-[1920px]
          mx-auto
          px-6 md:px-10 lg:px-16
          py-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-10
          "
        >
          {/* LEFT */}
          <div>
            {/* LOGO */}
            <div className="overflow-hidden lg:-ml-4">
              <img
                src={logo}
                alt="Disney Logo"
                className="
                  block
                  w-[220px]
                  md:w-[280px]
                  lg:w-[330px]
                  object-contain
                  -mb-4
                  md:-mb-6
                  lg:-mb-8
                "
              />
            </div>

            {/* TEXT */}
            <p
              className="
                mt-0
                text-gray-300
                leading-[1.8]
                text-[16px]
                max-w-[340px]
              "
            >
              Your one-stop destination for movies,
              shows, originals and premium
              entertainment.
            </p>

            {/* SOCIAL */}
            <div className="mt-7">
              <h3
                className="
                  font-bold
                  text-[26px]
                "
              >
                Follow us
              </h3>

              <div
                className="
                  flex items-center
                  gap-3
                  mt-5
                  flex-wrap
                "
              >
                <button className="footerIcon">
                  <FaFacebookF />
                </button>

                <button className="footerIcon">
                  <FaTwitter />
                </button>

                <button className="footerIcon">
                  <FaYoutube />
                </button>

                <button className="footerIcon">
                  <FaLinkedinIn />
                </button>

                <button className="footerIcon">
                  <FaInstagram />
                </button>
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h2 className="footerTitle">
              Company
            </h2>

            <div className="footerLinks">
              <p>About Us</p>
              <p>Careers</p>
              <p>Contact</p>
              <p>Media</p>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h2 className="footerTitle">
              Legal
            </h2>

            <div className="footerLinks">
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
              <p>Cookies</p>
              <p>Compliance</p>
            </div>
          </div>

          {/* APP */}
          <div>
            <h2
              className="
                text-[30px]
                font-black
                leading-tight
              "
            >
              Install Our App
            </h2>

            <p
              className="
                mt-5
                text-gray-300
                leading-relaxed
                text-[15px]
                max-w-[300px]
              "
            >
              Download app for best streaming
              experience on mobile & desktop.
            </p>

            <div
              className="
                mt-7
                flex items-center
                gap-4
                flex-wrap
              "
            >
              <button
                className="
                  px-6 py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  font-semibold
                  text-[16px]
                  hover:scale-105
                  shadow-[0_0_35px_rgba(34,211,238,0.30)]
                  transition-all duration-300
                "
              >
                Google Play
              </button>

              <button
                className="
                  px-6 py-4
                  rounded-2xl
                  bg-white/10
                  backdrop-blur-xl
                  border border-white/10
                  font-semibold
                  text-[16px]
                  hover:border-cyan-400/40
                  hover:bg-cyan-500/10
                  transition-all duration-300
                "
              >
                App Store
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="
            mt-10
            pt-6
            border-t border-white/10
            flex flex-col
            md:flex-row
            items-center
            justify-between
            gap-4
          "
        >
          <p
            className="
              text-gray-400
              text-sm
            "
          >
            © 2026 Disney+ Clone. All rights reserved.
          </p>

          <p
            className="
              text-gray-500
              text-sm
            "
          >
            Made with React + Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;