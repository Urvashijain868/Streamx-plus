import axios from "axios";

const movieBaseUrl = "https://api.themoviedb.org/3";
const api_key = "68999de6a3402e85790b54fd3ef86706";

// Trending videos get karne ke liye
const getTrendingVideos = () => {
  return axios.get(
    `${movieBaseUrl}/trending/all/day?api_key=${api_key}`
  );
};

// Genre ke basis pe movies get karne ke liye
const getMovieByGenreId = (id) => {
  return axios.get(
    `${movieBaseUrl}/discover/movie?api_key=${api_key}&with_genres=${id}`
  );
};

// Trending Movies
const getTrendingMovies = () =>
  axios.get(
    `${movieBaseUrl}/trending/movie/week?api_key=${api_key}`
  );

// Top Rated Movies
const getTopRatedMovies = () =>
  axios.get(
    `${movieBaseUrl}/movie/top_rated?api_key=${api_key}`
  );

// Popular Movies
const getPopularMovies = () =>
  axios.get(
    `${movieBaseUrl}/movie/popular?api_key=${api_key}`
  );

// Movies by Genre
const getMoviesByGenre = (id) =>
  axios.get(
    `${movieBaseUrl}/discover/movie?api_key=${api_key}&with_genres=${id}`
  );
  // Trending Series
const getTrendingSeries = () =>
  axios.get(
    `${movieBaseUrl}/trending/tv/week?api_key=${api_key}`
  );

// Top Rated Series
const getTopRatedSeries = () =>
  axios.get(
    `${movieBaseUrl}/tv/top_rated?api_key=${api_key}`
  );

// Popular Series
const getPopularSeries = () =>
  axios.get(
    `${movieBaseUrl}/tv/popular?api_key=${api_key}`
  );

// Series by Genre
const getSeriesByGenre = (id) =>
  axios.get(
    `${movieBaseUrl}/discover/tv?api_key=${api_key}&with_genres=${id}`
  );

const searchMovie = (query) => 
  axios.get(
    `${movieBaseUrl}/search/movie?api_key=${api_key}&query=${query}`
  );

const getMovieVideos = (movieId) => 
  axios.get(
    `${movieBaseUrl}/movie/${movieId}/videos?api_key=${api_key}`
  );

// 🆕 Network ke basis pe TV shows (Netflix, Disney+, Marvel)
const getTVByNetwork = (networkId) => 
  axios.get(
    `${movieBaseUrl}/discover/tv?api_key=${api_key}&with_networks=${networkId}&sort_by=popularity.desc`
  );

// 🆕 Provider ke basis pe movies (Disney+, Marvel)
const getMovieByProvider = (providerId) => 
  axios.get(
    `${movieBaseUrl}/discover/movie?api_key=${api_key}&with_watch_providers=${providerId}&watch_region=US&sort_by=popularity.desc`
  );


export default {
  getTrendingVideos,
  getMovieByGenreId,
  searchMovie,
  getMovieVideos,
  getTVByNetwork,
  getMovieByProvider,
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getMoviesByGenre,
  getTrendingSeries,
  getTopRatedSeries,
  getPopularSeries,
  getSeriesByGenre,
}