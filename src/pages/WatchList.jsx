import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import {
  HiOutlineBookmark,
  HiPlay,
  HiXMark,
  HiChevronLeft,
  HiChevronRight,
  HiStar,
  HiPlus,
  HiCheck
} from "react-icons/hi2";

import GlobalApi from "../Services/GlobalApi";
import watchListPoster from "../assets/Images/watchListPoster.png";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

function WatchList() {
  const [watchlist, setWatchlist] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [heroRecent, setHeroRecent] = useState(null);

  const [hover, setHover] = useState(false);
  const [hoverMovie, setHoverMovie] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const navigate = useNavigate();

  // 1. INITIAL LOAD & HERO LOGIC
  useEffect(() => {

    const loadData = () => {

      const data =
        localStorage.getItem("watchlist");

      if (data) {

        const parsedData =
          JSON.parse(data);

        setWatchlist(parsedData);

        const progressing =
          parsedData
            .filter((m) => m.progress > 0)
            .sort((a, b) => b.progress - a.progress)[0];

        setHeroRecent(progressing);
      }

      GlobalApi.getTrendingVideos()
        .then((resp) => {
          setRecommended(resp.data.results);
        });
    };

    loadData();

    window.addEventListener("watchlistUpdated", loadData);
    window.addEventListener("userUpdated", loadData);

    return () => {
      window.removeEventListener("watchlistUpdated", loadData);
      window.removeEventListener("userUpdated", loadData);
    };

  }, []);

  // 2. REMOVE MOVIE
  const removeMovie = (id) => {
    const updated = watchlist.filter((item) => item.id !== id);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("watchlistUpdated"));
    setWatchlist(updated);
    if (heroRecent?.id === id) setHeroRecent(null);
  };

  // 3. PLAY LOGIC
  const handlePlay = (movie) => {
    const existing = JSON.parse(localStorage.getItem("watchlist")) || [];
    const already = existing.find((item) => item.id === movie.id);

    let updated;
    if (already) {
      updated = existing.map((item) =>
        item.id === movie.id
          ? { ...item, progress: item.progress > 0 ? item.progress : Math.floor(Math.random() * 60) + 20 }
          : item
      );
    } else {
      updated = [...existing, { ...movie, progress: Math.floor(Math.random() * 60) + 20 }];
    }

    localStorage.setItem("watchlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("watchlistUpdated"));
    setWatchlist(updated);
    navigate(`/player/${movie.id}`);
  };

  // 4. SCROLL HELPER
  const scroll = (id, direction) => {
    const el = document.getElementById(id);
    if (el) el.scrollBy({ left: direction === "left" ? -700 : 700, behavior: "smooth" });
  };

  // 5. SMART HOVER POSITION FUNCTION
  const handleMouseEnter = (e, movie) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cardWidth = window.innerWidth < 768 ? 240 : 300;
    const padding = 20;

    let left = rect.left + window.scrollX - (cardWidth - rect.width) / 2;
    left = Math.max(padding, left);
    left = Math.min(left, window.innerWidth - cardWidth - padding);

    setCoords({ top: rect.top + window.scrollY - 35, left });
    setHoverMovie(movie);
    setHover(true);
  };

  return (
    <div className="min-h-screen bg-[#040714] text-white overflow-hidden pb-20">
      {/* HERO SECTION */}
      <div className="relative w-full h-[95vh] overflow-hidden">
        <img src={watchListPoster} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
          <h1 className="text-5xl md:text-7xl font-black text-white transition-all duration-500 hover:scale-105 hover:text-cyan-300 hover:drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] cursor-default">
            My Watchlist
          </h1>
          <p className="mt-5 text-lg md:text-2xl text-gray-200 max-w-[700px] transition-all duration-500 hover:text-white hover:tracking-wide">
            Save your favorite content to watch later.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-12">
            <div className="relative overflow-hidden group w-[82px] hover:w-[240px] md:hover:w-[280px] h-[92px] md:h-[105px] rounded-[34px] bg-black/30 backdrop-blur-xl border border-white/[0.03] hover:border-cyan-400/30 transition-all duration-700 cursor-pointer">
              <div className="absolute left-0 top-0 w-[82px] h-full flex items-center justify-center">
                <div className="w-[52px] h-[52px] rounded-[20px] bg-black/40 flex items-center justify-center transition-all duration-500 group-hover:bg-[#081120] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                  <HiOutlineBookmark className="text-[24px] text-cyan-400" />
                </div>
              </div>
              <div className="absolute left-[95px] top-1/2 -translate-y-1/2 opacity-0 translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-left">
                <h2 className="text-4xl font-black">{watchlist.length}</h2>
                <p className="text-gray-300">Total Saved</p>
              </div>
            </div>

            {heroRecent && (
              <div
                onClick={() => navigate(`/player/${heroRecent.id}`)}
                className="relative overflow-hidden group w-[82px] hover:w-[320px] md:hover:w-[430px] h-[92px] md:h-[105px] rounded-[34px] bg-black/30 backdrop-blur-xl border border-white/[0.03] hover:border-cyan-400/30 transition-all duration-700 cursor-pointer"
              >
                <div className="absolute left-0 top-0 w-[82px] h-full flex items-center justify-center">
                  <div className="w-[52px] h-[52px] rounded-[20px] bg-black/40 flex items-center justify-center transition-all duration-500 group-hover:bg-[#081120] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                    <HiPlay className="text-[24px] text-cyan-400 ml-1" />
                  </div>
                </div>
                <div className="absolute left-[95px] top-1/2 -translate-y-1/2 opacity-0 translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 w-[210px] md:w-[300px] text-left">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg md:text-2xl font-bold truncate">{heroRecent.title}</h2>
                    <span className="text-cyan-300 text-sm font-semibold">{heroRecent.progress}%</span>
                  </div>
                  <div className="w-full h-[5px] bg-white/10 rounded-full overflow-hidden mt-3">
                    <div style={{ width: `${heroRecent.progress}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  </div>
                  <p className="text-gray-400 text-sm mt-3">Continue Watching</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. CONTINUE WATCHING */}
      {watchlist.filter(m => m.progress > 0).length > 0 && (
        <div className="px-4 md:px-8 lg:px-10 mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white hover:text-cyan-300 hover:tracking-wide transition-all duration-500 w-fit">
                Continue Watching
              </h2>
              <p className="text-gray-400 mt-2 text-sm md:text-lg">Pick up where you left off</p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => scroll("continueSlider", "left")} className="group relative overflow-hidden w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-400/20 blur-2xl transition-all duration-500" />
                <HiChevronLeft className="relative z-10 text-3xl" />
              </button>
              <button onClick={() => scroll("continueSlider", "right")} className="group relative overflow-hidden w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-400/20 blur-2xl transition-all duration-500" />
                <HiChevronRight className="relative z-10 text-3xl" />
              </button>
            </div>
          </div>

          <div id="continueSlider" className="flex gap-5 overflow-x-auto scrollbar-hide pb-5">
            {watchlist.filter(m => m.progress > 0).map((movie) => (
              <div key={movie.id} className="relative min-w-[320px] md:min-w-[520px] h-[260px] md:h-[320px] rounded-[28px] overflow-hidden group cursor-pointer border border-white/[0.04] hover:border-cyan-400/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,255,255,0.12)]">
                <button onClick={(e) => { e.stopPropagation(); removeMovie(movie.id); }} className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:border-red-400/40 hover:scale-110 hover:rotate-90 transition-all duration-300">
                  <HiXMark className="text-2xl text-white" />
                </button>
                <img src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt={movie.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                <div className="absolute bottom-0 left-0 w-full p-5 md:p-7">
                  <h2 className="text-2xl md:text-4xl font-black text-white transition-all duration-500 group-hover:text-cyan-300 mb-3 truncate">{movie.title}</h2>
                  <div className="mb-3">
                    <div className="w-full h-[5px] bg-white/10 rounded-full overflow-hidden">
                      <div style={{ width: `${movie.progress}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                    </div>
                    <p className="text-gray-300 text-sm mt-2">{movie.progress}% watched</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button onClick={() => handlePlay(movie)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_25px_rgba(34,211,238,0.2)] hover:scale-105 hover:shadow-[0_0_35px_rgba(34,211,238,0.7)] active:scale-95 transition-all duration-300">
                      <HiPlay className="text-lg ml-0.5" /><span className="font-bold text-lg">Play</span>
                    </button>
                    <div className="bg-black/70 backdrop-blur-xl px-3 py-2 rounded-full flex items-center gap-2">
                      <HiStar className="text-yellow-400 text-base" /><span className="font-bold text-lg">{movie.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SAVED COLLECTION */}
      {watchlist.filter(m => !m.progress || m.progress === 0).length > 0 && (
        <div className="px-4 md:px-8 lg:px-10 mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl md:text-5xl font-black text-white hover:text-cyan-300 transition-all duration-500">My Saved Collection</h2>
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => scroll("savedSlider", "left")} className="group relative overflow-hidden w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40_rgba(34,211,238,0.45)] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-400/20 blur-2xl transition-all duration-500" />
                <HiChevronLeft className="relative z-10 text-3xl" />
              </button>
              <button onClick={() => scroll("savedSlider", "right")} className="group relative overflow-hidden w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40_rgba(34,211,238,0.45)] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-400/20 blur-2xl transition-all duration-500" />
                <HiChevronRight className="relative z-10 text-3xl" />
              </button>
            </div>
          </div>
          <div id="savedSlider" className="flex gap-5 overflow-x-auto scrollbar-hide pb-5">
            {watchlist.filter(m => !m.progress || m.progress === 0).map(movie => (
              <div key={movie.id} className="relative min-w-[180px] md:min-w-[240px] h-[260px] md:h-[340px] rounded-[24px] overflow-hidden group border border-white/5 transition-all duration-500 hover:scale-[1.06] hover:-translate-y-2">
                <button onClick={(e) => { e.stopPropagation(); removeMovie(movie.id); }} className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"><HiXMark /></button>
                <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-50 transition-all duration-700" alt={movie.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute bottom-0 p-4 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="font-bold text-lg line-clamp-1">{movie.title}</h3>
                  <button onClick={() => handlePlay(movie)} className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500 text-sm hover:scale-105 transition-all"><HiPlay /> Play Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECOMMENDATIONS */}
      <div className="px-4 md:px-8 lg:px-10 mt-20 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white hover:text-cyan-300 transition-all duration-500">
              Recommended For You
            </h2>
            <p className="text-gray-400 mt-2">Movies you may like</p>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => scroll("recSlider", "left")} className="group relative overflow-hidden w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40_rgba(34,211,238,0.45)] transition-all duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-400/20 blur-2xl transition-all duration-500" />
              <HiChevronLeft className="relative z-10 text-3xl" />
            </button>
            <button onClick={() => scroll("recSlider", "right")} className="group relative overflow-hidden w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40_rgba(34,211,238,0.45)] transition-all duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-400/20 blur-2xl transition-all duration-500" />
              <HiChevronRight className="relative z-10 text-3xl" />
            </button>
          </div>
        </div>

        <div id="recSlider" className="flex gap-5 overflow-x-auto scrollbar-hide pb-5">
          {recommended.slice(0, 15).map((movie) => (
            <div
              key={movie.id}
              className="inline-block"
              onMouseEnter={(e) => handleMouseEnter(e, movie)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                className="w-[180px] min-w-[180px] md:w-[240px] md:min-w-[240px] h-[260px] md:h-[340px] rounded-[24px] object-cover border border-transparent hover:border-cyan-400/40 hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl"
                alt={movie.title}
              />
            </div>
          ))}
        </div>
      </div>

      {/* PORTAL HOVER CARD */}
      {hover && hoverMovie &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: window.innerWidth < 768 ? "240px" : "300px",
              zIndex: 9999,
            }}
            className="bg-[#071028] rounded-[28px] border border-cyan-400/20 shadow-[0_0_40px_rgba(0,255,255,0.15)] overflow-hidden animate-fadeIn"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <img src={`${IMAGE_BASE_URL}${hoverMovie.poster_path}`} className="w-full h-[180px] md:h-[220px] object-cover" alt="preview" />
            <div className="p-5">
              <h2 className="text-2xl font-black text-white line-clamp-1">{hoverMovie.title}</h2>
              <div className="flex items-center gap-2 mt-2 text-gray-300 text-sm font-medium">
                <span>{hoverMovie.release_date?.split("-")[0]}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <HiStar className="text-yellow-400" />
                  <span>{hoverMovie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
              <p className="mt-3 text-gray-300 text-sm line-clamp-3 leading-relaxed">{hoverMovie.overview}</p>
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => handlePlay(hoverMovie)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all duration-300 text-sm md:text-base flex-1"
                >
                  <HiPlay className="text-lg" />
                  Watch Now
                </button>
                <button
                  onClick={() => {
                    const existing = JSON.parse(localStorage.getItem("watchlist")) || [];
                    const alreadyExists = existing.find((item) => item.id === hoverMovie.id);
                    if (!alreadyExists) {
                      const updated = [...existing, { ...hoverMovie, progress: 0 }];
                      localStorage.setItem("watchlist", JSON.stringify(updated));
                      setWatchlist(updated);
                      setRecommended((prev) => prev.filter((item) => item.id !== hoverMovie.id));
                    }
                  }}
                  className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 transition-all duration-300"
                >
                  {watchlist.some((m) => m.id === hoverMovie.id) ? (
                    <HiCheck className="text-3xl text-cyan-400" />
                  ) : (
                    <HiPlus className="text-3xl" />
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

export default WatchList;