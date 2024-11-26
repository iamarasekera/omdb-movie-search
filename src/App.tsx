import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Container, Dialog, Grid, Alert, IconButton } from '@mui/material';
import { Movie, MovieDetail, SearchResponse, YearRange } from './types';
import { Close as CloseIcon } from '@mui/icons-material';
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

  // Memoize API key retrieval
  const API_KEY = useMemo(() => process.env.REACT_APP_OMDB_API_KEY, []);

  // Memoized year range filtering function
  const filterMoviesByYearRange = useCallback((movies: Movie[], allResults: number) => {
    const filteredMovies = movies.filter(movie => {
      // Handle movies with year ranges (eg: 2020-2022)
      const yearParts = movie.Year.split('–');
      const movieYear = parseInt(yearParts[0]);

      // If it's a series with a range, check if any part of the range overlaps with selected range
      if (yearParts.length > 1) {
        const endYear = parseInt(yearParts[1]) || new Date().getFullYear();
        return (
          // Ensure both start and end years are valid numbers
          !isNaN(movieYear) &&
          !isNaN(endYear) &&
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

    return {
      filteredMovies,
      filteredTotal: estimatedTotal
    };
  }, [yearRange]);

  // Async (Memoized) function to search movies via OMDb API 
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
      // API URL with optional filters
      let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;

      // Add optional type filter
      if (type) {
        url += `&type=${type}`;
      }

      // Fetch movies from OMDb API
      const response = await axios.get<SearchResponse>(url);

      // Handle successful response
      if (response.data.Response === 'True') {
        const totalApiResults = parseInt(response.data.totalResults);

        // Filter movies by year range and get updated total
        const { filteredMovies, filteredTotal } = filterMoviesByYearRange(
          response.data.Search,
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
        setError(response.data.Error || 'No results found');
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
  }, [query, type, yearRange, API_KEY, filterMoviesByYearRange]);

  // Function (Memoized) to fetches movie details
  const fetchMovieDetails = useCallback(async (imdbID: string) => {
    try {
      const response = await axios.get<MovieDetail>(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
      );
      // Update state if the response is valid
      if (response.data.Response !== 'False') {
        setSelectedMovie(response.data);
      }
    } catch (error) {
      // Log errors if the fetch fails
      console.error('Error fetching movie details:', error);
    }
  }, [API_KEY]);

  // Handle movie selection to fetch more details (Memoized event handlers)
  const handleSelectMovie = useCallback((movie: Movie) => {
    fetchMovieDetails(movie.imdbID);
  }, [fetchMovieDetails]);

  const onSearch = useCallback(() => {
    setCurrentPage(1);
    setSelectedMovie(null);
    searchMovies(1);
  }, [searchMovies]);
  // Load more results for pagination
  const loadMore = useCallback(() => {
    if (!loading && movies.length < totalResults) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchMovies(nextPage);
    }
  }, [loading, movies.length, totalResults, currentPage, searchMovies]);

  // Function to check if a movie is in the watchlist
  const isInWatchlist = useCallback((movieId: string): boolean => {
    return watchlist.some(movie => movie.imdbID === movieId);
  }, [watchlist]);

  // Adds or removes the selected movie to the watchlist 
  const addToWatchlist = useCallback((movie: MovieDetail) => {
    setWatchlist(prevWatchlist => {
      const isAlreadyInWatchlist = prevWatchlist.some(
        item => item.imdbID === movie.imdbID
      );

      return isAlreadyInWatchlist
      // Remove from watchlist if already present 
      ? prevWatchlist.filter(item => item.imdbID !== movie.imdbID)
       // Add to watchlist if not present  
      : [...prevWatchlist, movie];
    });
  }, []);
  // Function to handle closing of the watchlist
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
      {    /* MovieList component */}
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

          {    /* MovieDetails component */}
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
