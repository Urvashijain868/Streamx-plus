import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiPlay,
  HiPlus,
  HiCheck
} from "react-icons/hi2";
import { createPortal } from "react-dom";

const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/original";

function MovieCard({ movie }) {
  const [hover, setHover] = useState(false);

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
  });

  // ✅ WATCHLIST STATE
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  const navigate = useNavigate();

  // ✅ CHECK IF ALREADY ADDED
  const isAdded = watchlist.some(
    (m) => m.id === movie.id
  );

  // ✅ ADD TO WATCHLIST
  const addToWatchlist = (movie) => {
    const existing =
      JSON.parse(localStorage.getItem("watchlist")) || [];

    // ❌ prevent duplicate
    if (existing.some((m) => m.id === movie.id))
      return;

    const updated = [...existing, movie];

    localStorage.setItem(
      "watchlist",
      JSON.stringify(updated)
    );

    setWatchlist(updated);
  };

  // ✅ SMART HOVER POSITION
  const handleMouseEnter = (e) => {
    const rect =
      e.currentTarget.getBoundingClientRect();

    const cardWidth =
      window.innerWidth < 768 ? 240 : 300;

    const padding = 20;

    // 🔥 CENTER ALIGN
    let left =
      rect.left +
      window.scrollX -
      (cardWidth - rect.width) / 2;

    // 🔥 PREVENT LEFT OVERFLOW
    left = Math.max(padding, left);

    // 🔥 PREVENT RIGHT OVERFLOW
    left = Math.min(
      left,
      window.innerWidth - cardWidth - padding
    );

    setCoords({
      top: rect.top + window.scrollY - 35,
      left,
    });

    setHover(true);
  };

  return (
    <>
      {/* 🎬 POSTER */}
      <div
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHover(false)}
      >
        <img
          src={IMAGE_BASE_URL + movie.poster_path}
          onClick={() =>
            navigate(`/player/${movie.id}`)
          }
          className="
            w-[150px] min-w-[150px]
            md:w-[200px] md:min-w-[200px]
            rounded-lg object-cover
            border border-transparent
            hover:border-gray-500
            hover:scale-105
            transition-all duration-200
            cursor-pointer
          "
        />
      </div>

      {/* 🔥 HOVER CARD */}
      {hover &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width:
                window.innerWidth < 768
                  ? "240px"
                  : "300px",
              zIndex: 9999,
            }}
            className="
              bg-[#0f172a]
              rounded-2xl
              shadow-2xl
              border border-gray-700
              p-4
              animate-fadeIn
            "
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {/* IMAGE */}
            <div className="rounded-xl overflow-hidden mb-3">
              <img
                src={
                  IMAGE_BASE_URL + movie.poster_path
                }
                className="
                  w-full
                  h-[160px] md:h-[200px]
                  object-cover
                  rounded-xl
                "
              />
            </div>

            {/* TITLE */}
            <h2 className="text-white text-lg font-semibold">
              {movie.title}
            </h2>

            {/* META */}
            <p className="text-gray-400 text-sm mt-1">
              {movie.release_date?.split("-")[0]} • ⭐{" "}
              {movie.vote_average?.toFixed(1)}
            </p>

            {/* BUTTONS */}
            <div className="flex items-center gap-3 mt-3">

              {/* ▶ WATCH NOW */}
              <button
                onClick={() =>
                  navigate(`/player/${movie.id}`)
                }
                className="
                  flex items-center gap-2
                  bg-white text-black
                  px-3 md:px-4 py-2
                  text-sm font-medium
                  rounded-md
                  hover:bg-gray-200
                  transition-all
                "
              >
                <HiPlay />
                Watch Now
              </button>

              {/* ➕ / ✅ WATCHLIST */}
              <button
                onClick={() =>
                  addToWatchlist(movie)
                }
                className={`
                  p-2.5
                  rounded-full
                  transition-all duration-300
                  ${
                    isAdded
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }
                `}
              >
                {isAdded ? (
                  <HiCheck className="text-lg" />
                ) : (
                  <HiPlus className="text-lg" />
                )}
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-300 text-sm mt-2 line-clamp-2">
              {movie.overview}
            </p>
          </div>,
          document.body
        )}
    </>
  );
}

export default MovieCard;