import "./App.css";

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";

import Header from "./components/Header.jsx";

import Slider from "./components/Slider.jsx";

import ProductionHouse from "./components/ProductionHouse.jsx";

import GenreMovieList from "./components/GenreMovieList.jsx";

import Footer from "./components/Footer";

import Search from "./pages/Search";

import Player from "./pages/Player";

import WatchList from "./pages/WatchList";

import Originals from "./pages/Originals";

import Movies from "./pages/Movies";

import Series from "./pages/Series";

import Settings from "./pages/Settings";

function App() {

  const location = useLocation();

  // 🔐 USER CHECK

  const user =
    JSON.parse(localStorage.getItem("user"));

  // ✅ SHOW LOGIN FIRST

  if (!user) {

    return <Login />;
  }

  // 🎥 HIDE HEADER & FOOTER ON PLAYER

  const hideLayout =
    location.pathname.includes("/player");

  return (

    <div
      className="
      bg-[#040714]

      min-h-screen

      overflow-x-hidden
      "
    >

      {/* HEADER */}

      {!hideLayout && <Header />}

      {/* ROUTES */}

      <Routes>

        {/* HOME */}

        <Route
          path="/"

          element={
            <>
              <Slider />

              <ProductionHouse />

              <GenreMovieList />
            </>
          }
        />

        {/* SEARCH */}

        <Route
          path="/search"

          element={<Search />}
        />

        {/* PLAYER */}

        <Route
          path="/player/:id"

          element={<Player />}
        />

        {/* WATCHLIST */}

        <Route
          path="/watchlist"

          element={<WatchList />}
        />

        {/* ORIGINALS */}

        <Route
          path="/originals"

          element={<Originals />}
        />

        {/* MOVIES */}

        <Route
          path="/movies"

          element={<Movies />}
        />

        {/* SERIES */}

        <Route
          path="/series"

          element={<Series />}
        />

        {/* SETTINGS */}

        <Route
          path="/settings"

          element={<Settings />}
        />

      </Routes>

      {/* FOOTER */}

      {!hideLayout && <Footer />}

    </div>
  );
}

export default App;