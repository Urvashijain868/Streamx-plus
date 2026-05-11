import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";

import {
  HiMagnifyingGlass,
  HiXMark,
  HiPlay,
  HiPlus,
  HiCheck,
  HiStar,
} from "react-icons/hi2";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

// Helper to read watchlist from localStorage safely
const getWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  } catch {
    return [];
  }
};

function Search() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [defaultMovies, setDefaultMovies] = useState([]);
  const [watchlist, setWatchlist] = useState(getWatchlist); // ✅ lazy init

  const [hover, setHover] = useState(false);
  const [hoverMovie, setHoverMovie] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    GlobalApi.getTrendingVideos().then((resp) => {
      setDefaultMovies(resp.data.results || []);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 2) {
        try {
          const resp = await GlobalApi.searchMovie(query);
          setResults(resp.data.results || []);
        } catch (err) {
          console.error(err);
        }
      } else {
        setResults([]);
      }
    };
    fetchData();
  }, [query]);

  const displayMovies = query.length > 2 ? results : defaultMovies;

  const handleMouseEnter = useCallback((e, movie) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 245 : 320;
    const cardHeight = isMobile ? 340 : 390;
    const padding = 16;

    let left = rect.left + window.scrollX - (cardWidth - rect.width) / 2;
    if (left < padding) left = padding;
    if (left + cardWidth > window.innerWidth - padding)
      left = window.innerWidth - cardWidth - padding;

    let top = rect.top + window.scrollY - (isMobile ? 0 : 20);
    const scrollBottom = window.scrollY + window.innerHeight;
    if (top + cardHeight > scrollBottom) top = scrollBottom - cardHeight - 20;

    setCoords({ top, left });
    setHoverMovie(movie);
    setHover(true);
  }, []);

  const handlePlay = useCallback((movie) => {
    localStorage.setItem("continueWatching", JSON.stringify(movie));
    navigate(`/player/${movie.id}`);
  }, [navigate]);

  // ✅ Unified watchlist toggle — keeps state + localStorage in sync
  const handleWatchlistToggle = useCallback((movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const updated = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, { ...movie, progress: 0 }];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isInWatchlist = useCallback(
    (id) => watchlist.some((m) => m.id === id),
    [watchlist]
  );

  return (
    <div className="p-5">
      {/* SEARCH BAR */}
      <div className="bg-[#1f2937] p-4 rounded-[22px] flex items-center gap-3">
        <HiMagnifyingGlass className="text-white text-2xl" />
        <input
          type="text"
          placeholder="Search movies..."
          className="bg-transparent w-full outline-none text-white placeholder:text-gray-400 text-[17px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <HiXMark
            className="text-white text-2xl cursor-pointer"
            onClick={() => setQuery("")}
          />
        )}
      </div>

      {/* MOVIES GRID */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-5">
        {displayMovies.map((movie) => {
          const image = movie.poster_path || movie.backdrop_path;
          if (!image) return null;

          return (
            <div
              key={movie.id}
              className="inline-block"
              onMouseEnter={(e) => handleMouseEnter(e, movie)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                src={`${IMAGE_BASE_URL}${image}`}
                alt={movie.title || movie.name}
                className="w-full h-[220px] md:h-[340px] rounded-[28px] object-cover cursor-pointer transition-all duration-300 hover:scale-105 border border-transparent hover:border-cyan-400/40 shadow-xl"
              />
            </div>
          );
        })}
      </div>

      {/* HOVER CARD */}
      {hover &&
        hoverMovie &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: window.innerWidth < 768 ? "245px" : "320px",
              zIndex: 9999,
            }}
            className="bg-[#071028] rounded-[26px] border border-cyan-400/20 shadow-[0_0_35px_rgba(0,255,255,0.12)] overflow-hidden"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <img
              src={`${IMAGE_BASE_URL}${hoverMovie.poster_path || hoverMovie.backdrop_path}`}
              alt="preview"
              className="w-full h-[160px] md:h-[190px] object-cover"
            />

            <div className="p-4">
              <h2 className="text-[20px] md:text-[26px] font-black text-white line-clamp-1 leading-tight">
                {hoverMovie.title || hoverMovie.name}
              </h2>

              <div className="flex items-center gap-2 mt-1 text-gray-300 text-[13px] md:text-[15px] font-medium">
                <span>
                  {hoverMovie.release_date?.split("-")[0] ||
                    hoverMovie.first_air_date?.split("-")[0]}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <HiStar className="text-yellow-400 text-sm" />
                  <span>{hoverMovie.vote_average?.toFixed(1)}</span>
                </div>
              </div>

              <p className="mt-2 text-gray-300 text-[13px] md:text-[15px] leading-[1.45] line-clamp-2">
                {hoverMovie.overview}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => handlePlay(hoverMovie)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] bg-white text-black font-bold text-[15px] md:text-[17px] hover:scale-105 transition-all duration-300"
                >
                  <HiPlay className="text-base" />
                  Watch
                </button>

                <button
                  onClick={() => handleWatchlistToggle(hoverMovie)}
                  className="w-[58px] h-[58px] rounded-[18px] bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300"
                >
                  {isInWatchlist(hoverMovie.id) ? (
                    <HiCheck className="text-2xl text-cyan-400" />
                  ) : (
                    <HiPlus className="text-2xl text-white" />
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

export default Search;