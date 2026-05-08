import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import {
  HiPlay,
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
  HiStar,
  HiCheck,
} from "react-icons/hi2";

import GlobalApi from "../Services/GlobalApi";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const MOVIE_SECTIONS = [
  {
    title: "Trending Movies",
    api: "trending",
    type: "banner",
  },

  {
    title: "Top Rated Movies",
    api: "toprated",
    type: "banner",
  },

  {
    title: "Action Movies",
    genre: 28,
    type: "poster",
  },

  {
    title: "Sci-Fi Universe",
    genre: 878,
    type: "poster",
  },

  {
    title: "Marvel Movies",
    genre: 12,
    type: "banner",
  },

  {
    title: "Documentary Films",
    genre: 99,
    type: "thumb",
  },
];

function Movies() {

  const [heroMovie, setHeroMovie] = useState(null);

  const [movieData, setMovieData] = useState({});

  const [watchlist, setWatchlist] = useState([]);

  const [hover, setHover] = useState(false);

  const [hoverMovie, setHoverMovie] = useState(null);

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
  });

  const sliderRefs = useRef({});

  const heroSliderRef = useRef(null);

  const navigate = useNavigate();

  // ─────────────────────────────────────
  // LOAD DATA
  // ─────────────────────────────────────

  useEffect(() => {

    GlobalApi.getTrendingMovies().then((resp) => {

      const data = resp.data.results;

      setMovieData((prev) => ({
        ...prev,
        "Trending Movies": data,
      }));

      setHeroMovie(
        data[Math.floor(Math.random() * data.length)]
      );
    });

    GlobalApi.getTopRatedMovies().then((resp) => {

      setMovieData((prev) => ({
        ...prev,
        "Top Rated Movies": resp.data.results,
      }));
    });

    MOVIE_SECTIONS.forEach((section) => {

      if (section.genre) {

        GlobalApi.getMoviesByGenre(section.genre)
          .then((resp) => {

            setMovieData((prev) => ({
              ...prev,
              [section.title]: resp.data.results,
            }));
          });
      }
    });

    const saved =
      JSON.parse(localStorage.getItem("watchlist"))
      || [];

    setWatchlist(saved);

  }, []);

  // ─────────────────────────────────────
  // WATCHLIST
  // ─────────────────────────────────────

  const addToWatchlist = (movie) => {

    const existing =
      JSON.parse(localStorage.getItem("watchlist"))
      || [];

    const alreadyExists = existing.find(
      (item) => item.id === movie.id
    );

    if (alreadyExists) {

      setWatchlist(existing);

      return;
    }

    const updated = [
      ...existing,
      {
        ...movie,
        progress: 0,
      },
    ];

    localStorage.setItem(
      "watchlist",
      JSON.stringify(updated)
    );

    setWatchlist(updated);

    window.dispatchEvent(
      new Event("watchlistUpdated")
    );
  };

  // ─────────────────────────────────────
  // SLIDERS
  // ─────────────────────────────────────

  const scroll = (title, dir) => {

    const slider = sliderRefs.current[title];

    if (slider) {

      slider.scrollBy({
        left: dir === "left" ? -900 : 900,
        behavior: "smooth",
      });
    }
  };

  const slideLeft = () => {

    heroSliderRef.current.scrollLeft -= 300;
  };

  const slideRight = () => {

    heroSliderRef.current.scrollLeft += 300;
  };

  // ─────────────────────────────────────
  // HOVER
  // ─────────────────────────────────────

  const handleHover = (e, movie) => {

    const rect =
      e.currentTarget.getBoundingClientRect();

    let left =
      rect.left + window.scrollX - 20;

    left = Math.max(20, left);

    left = Math.min(
      left,
      window.innerWidth - 460 - 20
    );

    setCoords({
      top: rect.top + window.scrollY - 50,
      left,
    });

    setHoverMovie(movie);

    setHover(true);
  };

  const handlePosterHover = (e, movie) => {

    const rect =
      e.currentTarget.getBoundingClientRect();

    let left =
      rect.left + window.scrollX - 40;

    left = Math.max(20, left);

    left = Math.min(
      left,
      window.innerWidth - 380
    );

    setCoords({
      top: rect.top + window.scrollY - 20,
      left,
    });

    setHoverMovie({
      ...movie,
      isPoster: true,
    });

    setHover(true);
  };

  return (

    <div className="bg-[#040714] text-white min-h-screen overflow-hidden">

      {/* ═══════════════════════════════
          HERO SECTION
      ═══════════════════════════════ */}

      {heroMovie && (

        <div className="relative h-[100svh] md:h-screen overflow-hidden">

          {/* BACKGROUND */}

          <img
            src={`${IMAGE_BASE_URL}${heroMovie.backdrop_path}`}
            className="
            absolute inset-0
            w-full h-full
            object-cover
            scale-110
            opacity-80
            animate-[slowMove_20s_ease-in-out_infinite_alternate]
            "
          />

          {/* OVERLAYS */}

          <div className="absolute inset-0 bg-black/60 z-10" />

          <div className="
          absolute inset-0
          bg-gradient-to-r
          from-[#040714]
          via-[#040714]/70
          to-transparent
          z-10
          " />

          <div className="
          absolute inset-0
          bg-gradient-to-t
          from-[#040714]
          via-transparent
          to-black/60
          z-10
          " />

          {/* CONTENT */}

          <div className="
          absolute
          left-4 md:left-16
          bottom-32 md:bottom-24
          z-20
          max-w-[92%] md:max-w-3xl
          ">

            <h1 className="
            text-5xl md:text-[95px]
            font-black
            leading-[0.9]
            tracking-[-3px]
            text-white
            drop-shadow-[0_0_35px_rgba(255,255,255,0.08)]
            mb-5 md:mb-8
            ">
              {heroMovie.title}
            </h1>

            <p className="
            text-gray-300
            text-sm md:text-[22px]
            leading-relaxed
            max-w-xl md:max-w-2xl
            mb-6 md:mb-10
            line-clamp-3
            ">
              {heroMovie.overview}
            </p>

            <div className="
            flex flex-wrap
            items-center gap-3
            text-gray-300
            mb-6
            ">
              <span>
                {heroMovie.release_date?.split("-")[0]}
              </span>

              <span>•</span>

              <span>U/A 16+</span>

              <span>•</span>

              <span>Movie</span>
            </div>

            <div className="
            flex items-center gap-4
            ">

              {/* WATCH */}

              <button
                onClick={() =>
                  navigate(`/player/${heroMovie.id}`)
                }
                className="
                group relative
                flex items-center justify-center gap-3
                h-[58px] md:h-[72px]
                px-8 md:px-12
                rounded-2xl overflow-hidden
                bg-gradient-to-r
                from-cyan-400
                via-blue-500
                to-pink-500
                hover:scale-105
                active:scale-95
                shadow-[0_0_40px_rgba(34,211,238,0.35)]
                transition-all duration-300
                "
              >

                <HiPlay className="text-[22px] text-white" />

                <span className="
                text-white
                font-bold
                text-xl md:text-2xl
                ">
                  Watch Now
                </span>

              </button>

              {/* WATCHLIST */}

              <button
                onClick={() =>
                  addToWatchlist(heroMovie)
                }
                className="
                group relative
                h-[58px] md:h-[72px]
                px-6 rounded-2xl
                overflow-hidden
                bg-white/10
                backdrop-blur-xl
                border border-white/10
                hover:border-cyan-400/40
                hover:bg-cyan-500/10
                hover:scale-105
                active:scale-95
                transition-all duration-300
                "
              >

                <div className="
                flex items-center gap-3
                ">

                  {watchlist.some(
                    (m) => m.id === heroMovie.id
                  ) ? (

                    <>
                      <HiCheck className="
                      text-[28px]
                      text-cyan-400
                      " />

                      <span className="
                      text-white
                      font-semibold
                      text-lg
                      ">
                        Added
                      </span>
                    </>

                  ) : (

                    <>
                      <HiPlus className="
                      text-[28px]
                      text-white
                      " />

                      <span className="
                      text-white
                      font-semibold
                      text-lg
                      ">
                        Watchlist
                      </span>
                    </>
                  )}

                </div>
              </button>
            </div>
          </div>

          {/* THUMBNAILS */}

          <div className="
          absolute
          bottom-5
          left-0
          md:right-8 md:left-auto
          md:bottom-8
          z-30
          w-full md:w-auto
          flex items-center justify-center
          gap-2 md:gap-4
          px-3 md:px-0
          ">

            {/* LEFT */}

            <button
              onClick={slideLeft}
              className="
              hidden md:flex
              w-12 h-12
              rounded-full
              bg-black/50
              backdrop-blur-xl
              border border-white/10
              items-center justify-center
              text-white
              hover:border-cyan-400/30
              hover:bg-cyan-500/10
              transition-all
              "
            >
              <HiChevronLeft />
            </button>

            {/* SLIDER */}

            <div
              ref={heroSliderRef}
              className="
              flex gap-2 md:gap-3
              overflow-x-auto
              scrollbar-hide
              max-w-full md:max-w-[500px]
              "
            >

              {movieData["Trending Movies"]
                ?.slice(0, 10)
                .map((movie) => (

                  <img
                    key={movie.id}

                    onClick={() =>
                      setHeroMovie(movie)
                    }

                    src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}

                    className={`
                    min-w-[90px]
                    h-[55px]
                    md:min-w-[140px]
                    md:h-[80px]
                    rounded-xl
                    object-cover
                    cursor-pointer
                    border-2
                    transition-all duration-300

                    ${
                      heroMovie.id === movie.id
                        ? "border-cyan-400 scale-105 shadow-[0_0_20px_rgba(34,211,238,0.45)]"
                        : "border-transparent hover:border-cyan-400/60"
                    }
                    `}
                  />
                ))}
            </div>

            {/* RIGHT */}

            <button
              onClick={slideRight}
              className="
              hidden md:flex
              w-12 h-12
              rounded-full
              bg-black/50
              backdrop-blur-xl
              border border-white/10
              items-center justify-center
              text-white
              hover:border-cyan-400/30
              hover:bg-cyan-500/10
              transition-all
              "
            >
              <HiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════
          MOVIE ROWS
      ═══════════════════════════════ */}

      <div className="py-10 px-4 md:px-10">

        {MOVIE_SECTIONS.map((section) => (

          <div
            key={section.title}
            className="mb-16"
          >

            <div className="
            flex items-center
            justify-between
            mb-5
            ">

              <h2 className="
              text-2xl md:text-4xl
              font-black
              ">
                {section.title}
              </h2>

              <div className="
              hidden lg:flex
              items-center gap-3
              ">

                <button
                  onClick={() =>
                    scroll(section.title, "left")
                  }
                  className="
                  w-12 h-12
                  rounded-full
                  bg-black/40
                  border border-white/10
                  flex items-center justify-center
                  hover:border-cyan-400/40
                  transition-all
                  "
                >
                  <HiChevronLeft className="text-2xl" />
                </button>

                <button
                  onClick={() =>
                    scroll(section.title, "right")
                  }
                  className="
                  w-12 h-12
                  rounded-full
                  bg-black/40
                  border border-white/10
                  flex items-center justify-center
                  hover:border-cyan-400/40
                  transition-all
                  "
                >
                  <HiChevronRight className="text-2xl" />
                </button>

              </div>
            </div>

            <div
              ref={(el) =>
                (sliderRefs.current[section.title] = el)
              }
              className="
              flex gap-4
              overflow-x-auto
              scrollbar-hide
              pb-4
              "
            >

              {movieData[section.title]?.map((movie) => (

                <div
                  key={movie.id}

                  onMouseEnter={(e) =>
                    section.type === "poster"
                      ? handlePosterHover(e, movie)
                      : handleHover(e, movie)
                  }

                  onMouseLeave={() =>
                    setHover(false)
                  }

                  className={`
                  relative overflow-hidden
                  cursor-pointer group
                  border border-white/5
                  hover:border-cyan-400/30
                  transition-all duration-500
                  hover:scale-105
                  rounded-2xl flex-shrink-0

                  ${
                    section.type === "poster"

                      ? "min-w-[210px] h-[380px]"

                      : section.type === "thumb"

                      ? "min-w-[320px] h-[180px]"

                      : "min-w-[380px] h-[220px]"
                  }
                  `}
                >

                  <img
                    src={`${IMAGE_BASE_URL}${
                      section.type === "poster"
                        ? movie.poster_path
                        : movie.backdrop_path
                    }`}
                    className="
                    w-full h-full
                    object-cover
                    group-hover:scale-110
                    group-hover:brightness-110
                    transition-all duration-700
                    "
                  />

                  <div className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black
                  via-black/10
                  to-transparent
                  " />

                  {section.type !== "thumb" && (

                    <div className="
                    absolute top-3 right-3
                    flex items-center gap-1
                    bg-black/70
                    px-3 py-1 rounded-full
                    border border-white/10
                    ">

                      <HiStar className="text-yellow-400" />

                      <span>
                        {movie.vote_average?.toFixed(1)}
                      </span>

                    </div>
                  )}

                  <div className="
                  absolute bottom-0
                  left-0 right-0
                  p-4
                  ">

                    <h3 className="
                    text-xl md:text-2xl
                    font-black
                    line-clamp-2
                    ">
                      {movie.title}
                    </h3>

                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════
          HOVER CARD
      ═══════════════════════════════ */}

      {hover && hoverMovie &&
        createPortal(

          <div
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: hoverMovie?.isPoster
                ? "340px"
                : "430px",
              zIndex: 9999,
            }}

            className={`
            bg-[#071028]
            rounded-[24px]
            border border-cyan-400/20
            shadow-[0_0_40px_rgba(0,255,255,0.15)]
            overflow-hidden
            ${
              hoverMovie?.isPoster
                ? "flex flex-col"
                : "flex"
            }
            `}
            onMouseEnter={() =>
              setHover(true)
            }
            onMouseLeave={() =>
              setHover(false)
            }
          >

            <img
              src={`${IMAGE_BASE_URL}${
                hoverMovie.poster_path ||
                hoverMovie.backdrop_path
              }`}
              className={`
              object-cover
              transition-all duration-700
              hover:scale-110

              ${
                hoverMovie?.isPoster
                  ? "w-full h-[190px]"
                  : "w-[160px]"
              }
              `}
            />

            <div className={`
            p-4 flex flex-col justify-between
            ${
              hoverMovie?.isPoster
                ? ""
                : "flex-1"
            }
            `}>

              <div>

                <h2 className="
                text-2xl font-black
                line-clamp-1
                ">
                  {hoverMovie.title}
                </h2>

                <div className="
                flex items-center gap-2
                mt-2 text-gray-300 text-sm
                ">

                  <span>
                    {hoverMovie.release_date?.split("-")[0]}
                  </span>

                  <span>•</span>

                  <div className="
                  flex items-center gap-1
                  ">

                    <HiStar className="text-yellow-400" />

                    <span>
                      {hoverMovie.vote_average?.toFixed(1)}
                    </span>

                  </div>
                </div>

                <p className="
                mt-3 text-gray-300 text-sm
                line-clamp-4 leading-relaxed
                ">
                  {hoverMovie.overview}
                </p>

              </div>

              <div className="
              flex items-center gap-3
              mt-5
              ">

                <button
                  onClick={() =>
                    navigate(`/player/${hoverMovie.id}`)
                  }
                  className="
                  flex items-center gap-2
                  px-5 py-3 rounded-2xl
                  bg-white text-black font-bold
                  hover:scale-105 transition-all
                  flex-1
                  "
                >
                  <HiPlay className="text-lg" />
                  Watch Now
                </button>

                <button
                  onClick={() =>
                    addToWatchlist(hoverMovie)
                  }
                  className="
                  w-14 h-14 rounded-2xl
                  bg-white/10 border border-white/10
                  flex items-center justify-center
                  hover:border-cyan-400/40
                  hover:bg-cyan-500/10
                  transition-all
                  "
                >

                  {watchlist.some(
                    (m) => m.id === hoverMovie.id
                  ) ? (

                    <HiCheck className="
                    text-2xl text-cyan-400
                    " />

                  ) : (

                    <HiPlus className="text-2xl" />
                  )}

                </button>

              </div>
            </div>
          </div>,

          document.body
        )}
    </div>
  );
}
export default Movies;