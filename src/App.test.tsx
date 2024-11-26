/**
 * App Component Tests
 * This test suite contains unit tests for the App component and its related components.
 * It focuses on the core functionalities such as:
 * - Movie search functionality.
 * - Movie selection and detail display.
 * - Adding a movie to the watchlist.
 * - Filtering movies by type.
 * - Handling scenarios with no search results.
 * 
 * It mocks the necessary API calls and verifies that the App reacts correctly to various user interactions.
 * The tests are designed to ensure that the App works as expected in different scenarios, such as fetching movie data,
 * selecting a movie, and interacting with the watchlist feature.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { fetchMovies, fetchMovieDetails } from '../src/api/movieApi';
import {MovieDetail, SearchResponse } from '../src/types'; // Import from existing types
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";

/**
 * Mock implementation of IntersectionObserver for testing environments
 * This prevents errors related to Intersection Observer not being available in test setup
 */
class IntersectionObserverMock implements IntersectionObserver {
  // Store the callback passed during observer creation
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  // Stub methods to prevent errors during testing
  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // Required interface properties with default values
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
}

// Replace the global IntersectionObserver with our mock implementation
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

/**
 * Mock search response data simulating a successful movie search
 * Matches the structure of the SearchResponse type
 */
const mockSearchResponse: SearchResponse = {
  Response: 'True',
  Search: [
    {
      imdbID: 'tt1234',
      Title: 'Test Movie',
      Year: '2022',
      Type: 'movie',
      Poster: 'test-poster.jpg'
    }
  ],
  totalResults: '1'
};

/**
 * Mock movie details data simulating a detailed movie response
 * Matches the structure of the MovieDetail type
 */
const mockMovieDetails: MovieDetail = {
  Title: 'Test Movie',
  Year: '2022',
  imdbID: 'tt1234',
  Type: 'movie',
  Poster: 'test-poster.jpg',
  Plot: 'A test movie plot',
  Director: 'Test Director',
  Actors: 'Test Actor 1, Test Actor 2',
  Genre: 'Action, Adventure',
  Runtime: '120 min',
  Rated: 'PG-13',
  imdbRating: '7.5',
  Response: 'True',
  Ratings: [
    { Source: 'Internet Movie Database', Value: '7.5/10' }
  ]
};

// Mock the API calls to control their behavior during testing
jest.mock('../src/api/movieApi', () => ({
  fetchMovies: jest.fn(),
  fetchMovieDetails: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mock function calls before each test
    // Ensures a clean slate for each test scenario
    jest.clearAllMocks();
  });

  /**
   * Test case: Verify basic movie search functionality
   * - Simulates user typing a search query
   * - Checks if search results are displayed correctly
   */
  test("performs movie search", async () => {
    // Mock the API responses to return predefined test data
    (fetchMovies as jest.Mock).mockResolvedValue(mockSearchResponse);
    (fetchMovieDetails as jest.Mock).mockResolvedValue(mockMovieDetails);
  
    // Render the App component
    render(<App />);
  
    // Simulate user input in the search bar
    const searchInput = screen.getByPlaceholderText("Search Movies");
    fireEvent.change(searchInput, { target: { value: "Test" } });
  
    // Simulate clicking the search button
    const searchButton = screen.getByRole("button", { name: "Search movies" });
    fireEvent.click(searchButton);
  
    // Wait for and verify the movie title appears
    await waitFor(() => {
      const movieTitle = screen.getByText("Test Movie");
      expect(movieTitle).toBeInTheDocument();
    }, { 
      // Configurable timeout and polling interval for async operations
      timeout: 3000,
      interval: 100 
    });
  });
 
  /**
   * Test case: Verify movie selection functionality
   * - Checks if clicking a movie triggers the selection callback
   */
  test("selects movie and shows details", async () => {
    // Create a mock function to simulate movie selection
    const mockOnSelectMovie = jest.fn();

    // Predefined test movie data
    const movies = [
        {
            imdbID: "1",
            Title: "Test Movie Title",
            Year: "2021",
            Type: "movie",
            Poster: "https://via.placeholder.com/150"
        }
    ];

    // Render MovieList with test data
    render(<MovieList movies={movies} onSelectMovie={mockOnSelectMovie} />);

    // Find and verify movie title is rendered
    const movieTitle = await screen.findByText(/Test Movie Title/i);
    expect(movieTitle).toBeInTheDocument();

    // Simulate clicking the movie
    fireEvent.click(movieTitle);

    // Verify the selection callback is called with correct movie data
    expect(mockOnSelectMovie).toHaveBeenCalledWith(movies[0]);
  });

  /**
   * Test case: Verify add to watchlist functionality
   * - Checks if clicking watchlist button calls the correct method
   */
  test('adds movie to watchlist', async () => {
    // Mock API responses
    (fetchMovies as jest.Mock).mockResolvedValue(mockSearchResponse);
    (fetchMovieDetails as jest.Mock).mockResolvedValue(mockMovieDetails);

    // Create a mock function for adding to watchlist
    const mockAddToWatchlist = jest.fn();

    // Render MovieDetails component with mock functions
    render(
      <MovieDetails 
        movie={mockMovieDetails} 
        addToWatchlist={mockAddToWatchlist} 
        isInWatchlist={() => false}  // Mock isInWatchlist function
      />
    );

    // Find and click watchlist button
    const watchlistButton = screen.getByRole('button', { name: /watchlist/i });
    fireEvent.click(watchlistButton);

    // Verify addToWatchlist was called with correct movie details
    expect(mockAddToWatchlist).toHaveBeenCalledWith(mockMovieDetails);
  });

  /**
   * Test case: Verify movie type filtering
   * - Checks if selecting a movie type filters search results
   */
  test('filters movies by type', async () => {
    // Mock API response
    (fetchMovies as jest.Mock).mockResolvedValue(mockSearchResponse);

    // Render App component
    render(<App />);
    
    // Select 'Movies' type filter
    const moviesRadio = screen.getByLabelText('Movies');
    fireEvent.click(moviesRadio);

    // Perform search
    const searchInput = screen.getByPlaceholderText('Search Movies');
    const searchButton = screen.getByLabelText('Search movies');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    fireEvent.click(searchButton);

    // Verify API call includes movie type filter
    await waitFor(() => {
      expect(fetchMovies).toHaveBeenCalledWith('Test', 1, 'movie');
    });
  });

  /**
   * Test case: Verify handling of no search results
   * - Checks error handling when no movies are found
   */
  test('handles search with no results', async () => {
    // Mock API response for no results
    (fetchMovies as jest.Mock).mockResolvedValue({
      Response: 'False',
      Error: 'Movie not found!'
    });
  
    // Render App component
    render(<App />);
    
    // Perform search with non-existent movie
    const searchInput = screen.getByPlaceholderText('Search Movies');
    const searchButton = screen.getByLabelText('Search movies');
    fireEvent.change(searchInput, { target: { value: 'NonexistentMovie' } });
    fireEvent.click(searchButton);
  
    // Wait for and verify error message
    await waitFor(() => {
      // Flexible query to match various no results messages
      const errorElement = screen.queryByText(/no results|movie not found/i);
      expect(errorElement).toBeInTheDocument();
    });
  });
});