import { useParams, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import {
  HiArrowLeft,
} from "react-icons/hi2";

import GlobalApi from "../Services/GlobalApi";

function Player() {

  const { id } = useParams();

  const [videoKey, setVideoKey] =
    useState(null);

  const [movieData, setMovieData] =
    useState(null);

  const [showClose, setShowClose] =
    useState(true);

  const navigate = useNavigate();

  // 🎬 FETCH TRAILER

  useEffect(() => {

    GlobalApi.getMovieVideos(id).then(
      (resp) => {

        const trailer =
          resp.data.results.find(
            (v) =>
              v.type === "Trailer" &&
              v.site === "YouTube"
          );

        if (trailer) {

          setVideoKey(trailer.key);
        }
      }
    );

  }, [id]);

  // 🎥 FETCH MOVIE DATA + SAVE CONTINUE WATCHING

  useEffect(() => {

    GlobalApi.getTrendingVideos().then(
      (resp) => {

        const movie =
          resp.data.results.find(
            (m) => m.id == id
          );

        if (movie) {

          setMovieData(movie);

          const watchlist =
            JSON.parse(
              localStorage.getItem(
                "watchlist"
              )
            ) || [];

          const alreadyExists =
            watchlist.find(
              (item) =>
                item.id == movie.id
            );

          let updatedWatchlist;

          // ✅ UPDATE EXISTING

          if (alreadyExists) {

            updatedWatchlist =
              watchlist.map((item) => {

                if (item.id == movie.id) {

                  return {
                    ...item,

                    progress:
                      item.progress > 0
                        ? item.progress
                        : Math.floor(
                            Math.random() * 60
                          ) + 20,
                  };
                }

                return item;
              });

          } else {

            // ✅ AUTO ADD TO WATCHLIST

            updatedWatchlist = [

              ...watchlist,

              {
                ...movie,

                progress:
                  Math.floor(
                    Math.random() * 60
                  ) + 20,
              },
            ];
          }

          // SAVE WATCHLIST

          localStorage.setItem(
            "watchlist",
            JSON.stringify(
              updatedWatchlist
            )
          );

          // SAVE RECENT MOVIE

          localStorage.setItem(
            "recentMovie",

            JSON.stringify({

              ...movie,

              progress:
                Math.floor(
                  Math.random() * 60
                ) + 20,

              watchedAt:
                new Date().toISOString(),
            })
          );

          // SAVE CONTINUE WATCHING

          localStorage.setItem(

            "continueWatching",

            JSON.stringify({

              ...movie,

              progress:
                Math.floor(
                  Math.random() * 60
                ) + 20,

              watchedAt:
                new Date().toISOString(),
            })
          );

          // 🔥 UPDATE UI INSTANTLY

          window.dispatchEvent(
            new Event(
              "watchlistUpdated"
            )
          );
        }
      }
    );

  }, [id]);

  // ⌨ ESC EXIT

  useEffect(() => {

    const handleEsc = (e) => {

      if (e.key === "Escape") {

        navigate(-1);
      }
    };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEsc
      );

  }, []);

  // 👀 AUTO HIDE BUTTON

  useEffect(() => {

    let timer;

    if (showClose) {

      timer = setTimeout(() => {

        setShowClose(false);

      }, 3000);
    }

    return () => clearTimeout(timer);

  }, [showClose]);

  return (

    <div
      className="
      fixed
      inset-0

      bg-black

      z-[99999]

      flex
      items-center
      justify-center
      "
      onMouseMove={() =>
        setShowClose(true)
      }
    >

      {/* BG IMAGE */}

      {movieData && (

        <img
          src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`}
          className="
          absolute inset-0
          w-full h-full
          object-cover
          opacity-20
          blur-2xl
          scale-110
          "
        />
      )}

      {/* OVERLAY */}

      <div className="
      absolute inset-0
      bg-black/70
      " />

      {/* ⬅ BACK BUTTON */}

      <button
        onClick={() => navigate(-1)}

        className={`

        absolute
        top-5 md:top-8
        left-5 md:left-8

        z-50

        flex
        items-center
        gap-3

        px-5
        py-3

        rounded-full

        bg-black/40
        backdrop-blur-xl

        border
        border-white/10

        hover:border-cyan-400/40
        hover:bg-cyan-500/10

        text-white

        transition-all
        duration-300

        hover:scale-105

        ${
          showClose
            ? "opacity-100"
            : "opacity-0"
        }
        `}
      >

        <HiArrowLeft
          className="
          text-2xl
          "
        />

      </button>

      {/* 🎥 VIDEO */}

      {videoKey ? (

        <iframe
          className="
          relative z-20

          w-full
          h-full
          "
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&rel=0`}
          title="Trailer"
          allow="autoplay; fullscreen"
          allowFullScreen
        />

      ) : (

        <div className="
        relative z-20
        flex flex-col
        items-center justify-center
        text-center
        px-5
        ">

          <div className="
          w-16 h-16
          rounded-full
          border-4 border-cyan-400/30
          border-t-cyan-400
          animate-spin
          mb-5
          " />

          <h2 className="
          text-white
          text-2xl
          font-bold
          ">
            Loading Trailer...
          </h2>

        </div>
      )}

    </div>
  );
}

export default Player;