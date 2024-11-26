import axios from 'axios'; 
// Importing axios for making HTTP requests.

import { SearchResponse, MovieDetail } from '../types'; 
// Importing TypeScript types to ensure type safety for the API responses.

const API_KEY = process.env.REACT_APP_OMDB_API_KEY; 
// Fetching the OMDB API key from environment variables for secure usage.

const BASE_URL = 'https://www.omdbapi.com/'; 
// Defining the base URL for the OMDB API.

/**
 * Fetches a list of movies based on the search query, page number, and optional type filter.
 * @param query The search query for the movies.
 * @param page The page number of the search results (defaults to 1).
 * @param type Optional type filter for the movie (can be 'movie', 'series', 'episode', or '').
 * @returns A promise that resolves to the search response containing movie data.
 */
export const fetchMovies = async (
  query: string, 
  page: number = 1, 
  type?: 'movie' | 'series' | 'episode' | ''
): Promise<SearchResponse> => {
  // Construct the API endpoint URL with query parameters.
  let url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;

  // Append the type filter if provided.
  if (type) {
    url += `&type=${type}`;
  }

  // Make the API request and type the response using SearchResponse.
  const response = await axios.get<SearchResponse>(url);

  // Check if the response is successful and return the data.
  if (response.data.Response === 'True') {
    return response.data;
  }

  // Throw an error if the response indicates failure, with a meaningful message.
  throw new Error(response.data.Error || 'No results found');
};

/**
 * Fetches detailed information about a specific movie by IMDb ID.
 * @param imdbID The IMDb ID of the movie to fetch details for.
 * @returns A promise that resolves to the movie details.
 */
export const fetchMovieDetails = async (imdbID: string): Promise<MovieDetail> => {
  // Construct the API endpoint URL for fetching movie details.
  const response = await axios.get<MovieDetail>(
    `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
  );

  // Check if the response is successful and return the data.
  if (response.data.Response !== 'False') {
    return response.data;
  }

  // Throw an error if the movie details cannot be fetched.
  throw new Error('Could not fetch movie details');
};
