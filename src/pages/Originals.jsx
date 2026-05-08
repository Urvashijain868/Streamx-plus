import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  HiPlay, HiPlus, HiSpeakerWave, HiSpeakerXMark,
  HiChevronLeft, HiChevronRight, HiStar, HiCheck
} from "react-icons/hi2";
import GlobalApi from "../Services/GlobalApi";

const API_KEY = "68999de6a3402e85790b54fd3ef86706";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const ORIGINALS_SECTIONS = [
  { title: "Marvel Originals", networkId: 2739, type: "tv" },
  { title: "Netflix Originals", networkId: 213, type: "tv" },
  { title: "Disney+ Originals", networkId: 2739, type: "tv" },
];

function genreLabel(id) {
  const map = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western", 10759: "Action & Adventure",
    10762: "Kids", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy",
    10766: "Soap", 10767: "Talk", 10768: "War & Politics",
  };
  return map[id] || "Original";
}

function Originals() {
  // ── HERO STATES ──
  const [movies, setMovies] = useState([]);
  const [bannerMovie, setBannerMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [muted, setMuted] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const sliderRef = useRef(null);

  // ── TRENDING STATES ──
  const [sectionsData, setSectionsData] = useState({});
  const sliderRefs = useRef({});

  // ── TOP 10 STATES ──
  const [top10, setTop10] = useState([]);
  const top10Ref = useRef(null);

  // ── HOVER PORTAL STATES ──
  const [hover, setHover] = useState(false);
  const [hoverMovie, setHoverMovie] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [watchlist, setWatchlist] = useState([]);

  const navigate = useNavigate();

  // ── HERO: Fetch Netflix TV shows ──
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
        setBannerMovie(randomMovie);
      });
  }, []);

  // ── HERO: Fetch trailer + watchlist check ──
  useEffect(() => {
    if (!bannerMovie) return;
    fetch(`https://api.themoviedb.org/3/tv/${bannerMovie.id}/videos?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((videoData) => {
        const trailer = videoData.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      });
    const saved = JSON.parse(localStorage.getItem("watchlist")) || [];
    setIsSaved(saved.some((item) => item.id === bannerMovie.id));
  }, [bannerMovie]);

  // ── TRENDING + TOP 10: Load ──
  useEffect(() => {
    ORIGINALS_SECTIONS.forEach((section) => {
      GlobalApi.getTVByNetwork(section.networkId).then((resp) => {
        setSectionsData((prev) => ({
          ...prev,
          [section.title]: resp.data.results.slice(0, 10),
        }));
      });
    });

    fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setTop10(data.results.slice(0, 10)));

    const data = localStorage.getItem("watchlist");
    if (data) setWatchlist(JSON.parse(data));
  }, []);

  // ── HERO: Add to watchlist ──
  const addToWatchlist = () => {
    if (!bannerMovie) return;
    const saved = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (saved.some((item) => item.id === bannerMovie.id)) { setIsSaved(true); return; }
    const movieData = {
      id: bannerMovie.id, name: bannerMovie.name, title: bannerMovie.title,
      poster_path: bannerMovie.poster_path, backdrop_path: bannerMovie.backdrop_path,
      overview: bannerMovie.overview, vote_average: bannerMovie.vote_average,
      release_date: bannerMovie.first_air_date, progress: 0,
    };
    const updated = [...saved, movieData];
    localStorage.setItem("watchlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("watchlistUpdated"));
    setWatchlist(updated);
    setIsSaved(true);
  };

  const playMovie = () => { if (!bannerMovie) return; navigate(`/player/${bannerMovie.id}`); };
  const slideRight = () => { sliderRef.current.scrollLeft += 300; };
  const slideLeft = () => { sliderRef.current.scrollLeft -= 300; };

  const scroll = (sectionTitle, direction) => {
    const slider = sliderRefs.current[sectionTitle];
    if (slider) slider.scrollBy({ left: direction === "left" ? -800 : 800, behavior: "smooth" });
  };

  // ── HOVER ──
  const handleMouseEnter = (e, movie) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cardWidth = 460;
    const padding = 20;
    let left = rect.left + window.scrollX - (cardWidth - rect.width) / 2;
    left = Math.max(padding, left);
    left = Math.min(left, window.innerWidth - cardWidth - padding);
    const top = rect.top + window.scrollY - 80;
    setCoords({ top, left });
    setHoverMovie(movie);
    setHover(true);
  };

  const handleHoverPlay = (movie) => { navigate(`/player/${movie.id}`); };

  const handleHoverSave = (movie) => {
    const existing = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!existing.find((item) => item.id === movie.id)) {
      const updated = [...existing, { ...movie, progress: 0 }];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("watchlistUpdated"));
      setWatchlist(updated);
    }
  };

  return (
    <div className="bg-[#040714] text-white min-h-screen overflow-hidden">

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <div className="relative h-[100svh] md:h-screen overflow-hidden">

        {/* VIDEO */}
        {trailerKey && (
          <iframe
            className="absolute top-1/2 left-1/2 w-[320vw] md:w-[140vw] h-[140vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-80 scale-125"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&playlist=${trailerKey}`}
            title="Trailer" allow="autoplay"
          />
        )}

        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040714] via-[#040714]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-black/60 z-10" />

        {/* CONTENT */}
        <div className="absolute left-4 md:left-16 bottom-32 md:bottom-24 z-20 max-w-[92%] md:max-w-3xl">
          <h1 className="text-5xl md:text-[95px] font-black leading-[0.9] tracking-[-3px] text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.08)] mb-5 md:mb-8">
            {bannerMovie?.name}
          </h1>
          <p className="text-gray-300 text-sm md:text-[22px] leading-relaxed max-w-xl md:max-w-2xl mb-6 md:mb-10 line-clamp-3">
            {bannerMovie?.overview}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-gray-300 mb-6">
            <span>2025</span><span>•</span><span>U/A 16+</span><span>•</span><span>1 Season</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg text-gray-300 mb-8 md:mb-12">
            <span>Romance</span><span>|</span><span>Comedy</span><span>|</span><span>Reunion</span>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-4">
            <button
              onClick={playMovie}
              className="group relative flex items-center justify-center gap-3 h-[58px] md:h-[72px] px-8 md:px-12 rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all duration-300"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 blur-2xl transition-all duration-500" />
              <HiPlay className="text-[22px] text-white relative z-10" />
              <span className="text-white font-bold text-xl md:text-2xl relative z-10">Watch Now</span>
            </button>

            <button
              onClick={addToWatchlist}
              className="group relative h-[58px] md:h-[72px] px-6 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-400/10 blur-xl transition-all duration-500" />
              <div className="relative z-10 flex items-center gap-3">
                {isSaved ? <HiCheck className="text-[28px] text-cyan-400" /> : <HiPlus className="text-[28px] text-white" />}
                <span className="text-white font-semibold text-lg">{isSaved ? "Added" : "Watchlist"}</span>
              </div>
            </button>
          </div>
        </div>

        {/* 🔊 MUTE */}
        <button
          onClick={() => setMuted(!muted)}
          className="group absolute top-24 right-5 md:top-8 md:right-8 z-[999] w-[52px] h-[52px] md:w-[62px] md:h-[62px] rounded-full overflow-hidden bg-black/40 backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.35)] hover:scale-110 hover:bg-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-cyan-400/20 blur-2xl transition-all duration-500" />
          {muted
            ? <HiSpeakerXMark className="relative z-10 text-[26px] md:text-[32px] text-white" />
            : <HiSpeakerWave className="relative z-10 text-[26px] md:text-[32px] text-white" />
          }
        </button>

        {/* THUMBNAILS */}
        <div className="absolute bottom-5 left-0 md:left-auto md:right-8 md:bottom-8 z-30 w-full md:w-auto flex items-center justify-center gap-2 md:gap-4 px-3 md:px-0">
          <button onClick={slideLeft} className="hidden md:flex w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 items-center justify-center text-white hover:border-cyan-400/30 hover:bg-cyan-500/10 transition-all">❮</button>
          <div ref={sliderRef} className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide max-w-full md:max-w-[500px]">
            {movies.slice(0, 10).map((movie) => (
              <img
                key={movie.id}
                onClick={() => setBannerMovie(movie)}
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                alt={movie.name}
                className="min-w-[90px] h-[55px] md:min-w-[140px] md:h-[80px] rounded-xl object-cover cursor-pointer border-2 border-transparent hover:border-cyan-400 hover:scale-105 transition-all duration-300"
              />
            ))}
          </div>
          <button onClick={slideRight} className="hidden md:flex w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 items-center justify-center text-white hover:border-cyan-400/30 hover:bg-cyan-500/10 transition-all">❯</button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TRENDING ORIGINALS SECTIONS
      ══════════════════════════════════════ */}
      <div className="py-10 px-4 md:px-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Trending Originals</h1>
          <p className="text-gray-400 text-lg">Exclusive content you won't find anywhere else</p>
        </div>

        {ORIGINALS_SECTIONS.map((section) => (
          <div key={section.title} className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-4xl font-black">{section.title}</h2>
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => scroll(section.title, "left")}
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 transition-all duration-300"
                >
                  <HiChevronLeft className="text-2xl" />
                </button>
                <button
                  onClick={() => scroll(section.title, "right")}
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 transition-all duration-300"
                >
                  <HiChevronRight className="text-2xl" />
                </button>
              </div>
            </div>

            <div
              ref={(el) => (sliderRefs.current[section.title] = el)}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-5"
            >
              {sectionsData[section.title]?.map((movie) => (
                <div
                  key={movie.id}
                  onMouseEnter={(e) => handleMouseEnter(e, movie)}
                  onMouseLeave={() => setHover(false)}
                  className="relative min-w-[280px] md:min-w-[380px] h-[160px] md:h-[220px] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-cyan-400/30 transition-all duration-500 hover:scale-105"
                >
                  <img
                    src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    alt={movie.name || movie.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
                    <HiStar className="text-yellow-400 text-lg" />
                    <span className="font-bold text-lg">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl md:text-2xl font-black text-white line-clamp-1">
                      {movie.name || movie.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

{/* ══════════════════════════════════════
    TOP 10 ORIGINALS — Vertical Poster
══════════════════════════════════════ */}
<div className="pt-2 pb-10 px-4 md:px-10">
  {/* heading */}
  <div className="flex items-center justify-between mb-2">
    <div>
      <h1 className="text-4xl md:text-5xl font-black mb-1">
        Top 10 Originals
      </h1>
      <p className="text-gray-400 text-lg">
        Most watched this week
      </p>
    </div>

    <div className="hidden lg:flex items-center gap-3">
      <button
        onClick={() =>
          top10Ref.current?.scrollBy({
            left: -600,
            behavior: "smooth",
          })
        }
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 transition-all duration-300"
      >
        <HiChevronLeft className="text-2xl" />
      </button>

      <button
        onClick={() =>
          top10Ref.current?.scrollBy({
            left: 600,
            behavior: "smooth",
          })
        }
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 transition-all duration-300"
      >
        <HiChevronRight className="text-2xl" />
      </button>
    </div>
  </div>

  {/* cards */}
  <div
    ref={top10Ref}
    className="flex gap-8 overflow-x-auto scrollbar-hide pb-5 mt-2"
  >
    {top10.map((movie, index) => (
      <div
        key={movie.id}
        onMouseEnter={(e) => handleMouseEnter(e, movie)}
        onMouseLeave={() => setHover(false)}
        className="relative flex-shrink-0 cursor-pointer group"
        style={{ width: "210px" }}
      >
        <div className="flex items-end">
          
          {/* number */}
          <span
            className="font-black leading-none select-none pointer-events-none flex-shrink-0"
            style={{
              fontSize: "170px",
              color: "transparent",
              WebkitTextStroke: "2px rgba(255,255,255,0.15)",
              marginRight: "-18px",
              position: "relative",
              zIndex: 0,
            }}
          >
            {index + 1}
          </span>

          {/* poster */}
          <div
            className="relative rounded-2xl overflow-hidden border-2 border-transparent 
            group-hover:border-cyan-400/40 
            transition-all duration-300 
            group-hover:scale-[1.04]
            group-hover:-translate-y-2
            flex-shrink-0"
            style={{
              width: "180px",
              height: "255px",
              zIndex: 1,
            }}
          >
            <img
              src={`${IMAGE_BASE_URL}${
                movie.poster_path || movie.backdrop_path
              }`}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              alt={movie.name || movie.title}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-gray-300 text-[11px]">
                {movie.genre_ids?.[0]
                  ? genreLabel(movie.genre_ids[0])
                  : "Original"}
              </p>
            </div>
          </div>
        </div>

        {/* title */}
        <p className="text-white text-sm font-bold mt-3 line-clamp-1 px-1">
          {movie.name || movie.title}
        </p>
      </div>
    ))}
  </div>
</div>
      {/* ══════════════════════════════════════
          HOVER PORTAL CARD — Horizontal
      ══════════════════════════════════════ */}
      {hover && hoverMovie &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: "460px",
              zIndex: 9999,
            }}
            className="bg-[#071028] rounded-[24px] border border-cyan-400/20 shadow-[0_0_40px_rgba(0,255,255,0.15)] overflow-hidden flex flex-row"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {/* LEFT — Image */}
            <img
              src={`${IMAGE_BASE_URL}${hoverMovie.poster_path || hoverMovie.backdrop_path}`}
              className="w-[160px] min-h-full object-cover flex-shrink-0"
              alt="preview"
            />

            {/* RIGHT — Info */}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-xl font-black text-white line-clamp-1">
                  {hoverMovie.title || hoverMovie.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-gray-300 text-sm font-medium">
                  <span>
                    {hoverMovie.release_date?.split("-")[0] || hoverMovie.first_air_date?.split("-")[0]}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <HiStar className="text-yellow-400" />
                    <span>{hoverMovie.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
                <p className="mt-2.5 text-gray-300 text-sm line-clamp-4 leading-relaxed">
                  {hoverMovie.overview}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => handleHoverPlay(hoverMovie)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all duration-300 text-sm flex-1"
                >
                  <HiPlay className="text-base" />
                  Watch Now
                </button>
                <button
                  onClick={() => handleHoverSave(hoverMovie)}
                  className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:scale-110 transition-all duration-300 flex-shrink-0"
                >
                  {watchlist.some((m) => m.id === hoverMovie.id)
                    ? <HiCheck className="text-2xl text-cyan-400" />
                    : <HiPlus className="text-2xl" />
                  }
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      }

    </div>
  );
}

export default Originals;