import React, { useState, useEffect, useCallback } from 'react';
import { Container, Dialog, Grid, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { fetchMovies, fetchMovieDetails } from '../src/api/movieApi';
import { Movie, MovieDetail, YearRange } from './types';

import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import WatchList from './components/WatchList';

const App: React.FC = () => {
  // State management for search functionality
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearRange, setYearRange] = useState<YearRange>({ startYear: 1970, endYear: 2024 });
  const [type, setType] = useState<'movie' | 'series' | 'episode' | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // State management for dialog
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  /**
   * Filters movies based on the year range
   * @param movies Array of movies to filter
   * @param allResults Total number of API results
   * @returns Filtered movies and adjusted total results
   */
  const filterMoviesByYearRange = useCallback((movies: Movie[], allResults: number) => {
    const filteredMovies = movies.filter(movie => {
      // Handle movies with year ranges (eg: 2020-2022)
      const yearParts = movie.Year.split('–');
      const movieYear = parseInt(yearParts[0]);

      // If it's a series with a range, check if any part of the range overlaps with selected range
      if (yearParts.length > 1) {
        const endYear = parseInt(yearParts[1]) || new Date().getFullYear();
        return (
          !isNaN(movieYear) && !isNaN(endYear) &&
          // Ensure both start and end years are valid numbers
           // Check if the movie year or the end year of the series overlaps with the selected range
          ((movieYear >= yearRange.startYear && movieYear <= yearRange.endYear) ||
           (endYear >= yearRange.startYear && endYear <= yearRange.endYear))
        );
      }
      // For movies without a year range, check if the movie year falls within the selected range
      return !isNaN(movieYear) &&
        movieYear >= yearRange.startYear &&
        movieYear <= yearRange.endYear;
    });

    // The percentage of current results that match the year filter
    const filterRatio = movies.length > 0 ? filteredMovies.length / movies.length : 0;

    // Estimate total results based on the filter ratio (but never less than actual filtered movies)
    const estimatedTotal = Math.max(filteredMovies.length, Math.floor(allResults * filterRatio));

    return { filteredMovies, filteredTotal: estimatedTotal };
  }, [yearRange]);

  /**
   * Searches for movies via OMDb API
   * @param page Page number for pagination
   */
  const searchMovies = useCallback(async (page: number = 1) => {
    if (!query.trim()) {
      setMovies([]);
      setError(null);
      setTotalResults(0);
      return;
    }

    // Set loading state and clear previous errors
    setLoading(true);
    setError(null);

    try {
      const response = await fetchMovies(query, page, type);

      if (response.Response === 'True') {
        const totalApiResults = parseInt(response.totalResults);
        const { filteredMovies, filteredTotal } = filterMoviesByYearRange(
          response.Search,
          totalApiResults
        );

        // Update movies state based on page
        setMovies(prevMovies =>
          page === 1 ? filteredMovies : [...prevMovies, ...filteredMovies]
        );
        // Update total results with filtered count
        setTotalResults(filteredTotal);

        // Display error only if no movies match the filter AND user is on the first page
        if (filteredMovies.length === 0 && page === 1) {
          setError(`No movies found between ${yearRange.startYear} and ${yearRange.endYear}`);
        } else {
          setError(null);
        }
      } else {
        // Handle no results scenario
        setError(response.Error || 'No results found');
        setMovies([]);
        setTotalResults(0);
      }
    } catch (error) {
      // Handle network or unexpected errors
      setError(error instanceof Error ? error.message : 'An error occurred while searching');
      setMovies([]);
      setTotalResults(0);
    } finally {
      // Always stop loading
      setLoading(false);
    }
  }, [query, type, yearRange, filterMoviesByYearRange]);

  /**
   * Fetches movie details based on IMDb ID
   * @param movie Selected movie object
   */
  const handleSelectMovie = useCallback(async (movie: Movie) => {
    try {
      const details = await fetchMovieDetails(movie.imdbID);
      setSelectedMovie(details);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }, []);

  /**
   * Initiates a new search
   */
  const onSearch = useCallback(() => {
    setCurrentPage(1);
    setSelectedMovie(null);
    searchMovies(1);
  }, [searchMovies]);

  /**
   * Loads additional movies for pagination
   */
  const loadMore = useCallback(() => {
    if (!loading && movies.length < totalResults) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchMovies(nextPage);
    }
  }, [loading, movies.length, totalResults, currentPage, searchMovies]);

  /**
   * Checks if a movie is in the watchlist
   * @param movieId IMDb ID of the movie
   * @returns Boolean indicating presence in watchlist
   */
  const isInWatchlist = useCallback((movieId: string): boolean => {
    return watchlist.some(movie => movie.imdbID === movieId);
  }, [watchlist]);

  /**
   * Adds or removes a movie from the watchlist
   * @param movie Movie details object
   */
  const addToWatchlist = useCallback((movie: MovieDetail) => {
    setWatchlist(prevWatchlist => {
      const isAlreadyInWatchlist = prevWatchlist.some(
        item => item.imdbID === movie.imdbID
      );

      return isAlreadyInWatchlist
        ? prevWatchlist.filter(item => item.imdbID !== movie.imdbID)
        : [...prevWatchlist, movie];
    });
  }, []);

  /**
   * Handles closing of the watchlist dialog
   */
  const handleCloseWatchlist = useCallback(() => {
    // Set the watchlist state to false when watchlist UI closes
    setWatchlistOpen(false);
  }, []);

  // Effect to show dialog when watchlist updates
  useEffect(() => {
    if (watchlist.length > 0) {
      setWatchlistOpen(true);
    }
  }, [watchlist]);

  // Effect to clear movies when query is empty
  useEffect(() => {
    if (query.trim() === '') {
      setMovies([]);
      setTotalResults(0);
      setSelectedMovie(null);
    }
  }, [query]);

  // Effect to handle year range changes
  useEffect(() => {
    if (movies.length > 0) {
      const { filteredMovies, filteredTotal } = filterMoviesByYearRange(movies, totalResults);
      setMovies(filteredMovies);
      setTotalResults(filteredTotal);

      if (filteredMovies.length === 0) {
        setError(`No movies found between ${yearRange.startYear} and ${yearRange.endYear}`);
      } else {
        setError(null);
      }
    }
  }, [yearRange, filterMoviesByYearRange, totalResults]);

  // Constant to determine if there are more results to load
  const hasMore = movies.length < totalResults;

  return (
    <Container>
      {/* SearchBar component */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={onSearch}
        loading={loading}
        yearRange={yearRange}
        setYearRange={setYearRange}
        type={type}
        setType={setType}
      />
      {/* Display error message if there is an error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* MovieList component */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <MovieList
            movies={movies}
            onSelectMovie={handleSelectMovie}
            totalResults={totalResults}
            onLoadMore={loadMore}
            hasMore={hasMore}
            loading={loading}
          />
          {/* MovieDetails component */}
        </Grid>
        <Grid item xs={8}>
          <MovieDetails
            movie={selectedMovie}
            addToWatchlist={addToWatchlist}
            isInWatchlist={isInWatchlist}
          />
        </Grid>
      </Grid>
      {/* Watchlist Dialog */}
      <Dialog
        open={watchlistOpen}
        onClose={handleCloseWatchlist}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            position: 'relative',
            p: 2
          }
        }}
      >
        <IconButton
          onClick={handleCloseWatchlist}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500'
          }}
        >
          <CloseIcon />
        </IconButton>
        <WatchList watchlist={watchlist} />
      </Dialog>
    </Container>
  );
};

export default React.memo(App);
