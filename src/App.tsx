import React, { useState } from 'react';
import axios from 'axios';
import { Container, Grid, Alert } from '@mui/material';
import { Movie, MovieDetail, SearchResponse } from './types';
import SearchBar from './components/SearchBar';

const App: React.FC = () => {
   // State management for search functionality
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<string>('');
  const [type, setType] = useState<'movie' | 'series' | 'episode' | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Retrieve API key from environment variables
  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  // Async function to search movies via OMDb API
  const searchMovies = async (page: number = 1) => {
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

      // Add optional type and year filters
      if (type) {
        url += `&type=${type}`;
      }
      if (year) {
        url += `&y=${year}`;
      }

       // Fetch movies from OMDb API
      const response = await axios.get<SearchResponse>(url);

      // Handle successful response
      if (response.data.Response === 'True') {
        // Append results for pagination (set initial results)
        if (page === 1) {
          setMovies(response.data.Search);
        } else {
          setMovies(prevMovies => [...prevMovies, ...response.data.Search]);
        }
         // Update total results count
        setTotalResults(parseInt(response.data.totalResults));
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
  };

  // Search handler to reset state and trigger search
  const onSearch = () => {
   
    setCurrentPage(1);
    setSelectedMovie(null);
    searchMovies(1);
  };

  return (
    <Container>
      {/* SearchBar component */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={onSearch}
        loading={loading}
        year={year}
        setYear={setYear}
        type={type}
        setType={setType}
      />
    </Container>
  );
};

export default App;
