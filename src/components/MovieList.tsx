/**
 * MovieList Component
 * This component renders a list of movies with infinite scroll functionality.
 */
import React, { FC, useRef, useEffect, useState, KeyboardEvent } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    Avatar,
    Divider,
    CircularProgress
} from '@mui/material';
import { Movie } from '../types';

/**
 * Props for the MovieList component
 */
interface MovieListProps {
    movies: Movie[];
    onSelectMovie: (movie: Movie) => void;
    totalResults?: number;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loading?: boolean;
}

// Functional component for the MovieList
const MovieList: FC<MovieListProps> = ({
    movies,
    onSelectMovie,
    totalResults = 0,
    onLoadMore,
    hasMore = false,
    loading = false
}) => {
    // Create refs for intersection observer
    const observerRef = useRef<IntersectionObserver>();
    const loadingRef = useRef<HTMLDivElement>(null);

    // State for managing selected movie ID
    const [selectedMovieId, setSelectedMovieId] = useState<string>('');

    useEffect(() => {
        // Create intersection observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Check if the loading element is visible and there are more items to load
                if (entries[0].isIntersecting && hasMore && !loading) {
                    onLoadMore?.();
                }
            },
            { threshold: 0.5 }
        );

        // Observe the loading element
        if (loadingRef.current) {
            observerRef.current.observe(loadingRef.current);
        }

        // Cleanup observer on unmount
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loading, onLoadMore]);

    /**
     * Handles movie selection
     * @param movie Selected movie object
     */
    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovieId(movie.imdbID);
        onSelectMovie(movie);
    };

    /**
     * Handles keyboard interaction for accessibility
     * @param event Keyboard event object
     * @param movie Movie object to be selected
     */
    const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>, movie: Movie) => {
        if (event.key === 'Enter') {
            handleMovieSelect(movie);
        }
    };

    return (
        <Box
            sx={{
                height: '80vh',
                overflow: 'auto',
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-track': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
                },
            }}
        >
            {/* Display total number of results */}
            <Typography
                gutterBottom
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: 'white',
                    padding: '10px',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                {totalResults ? `${totalResults} Results` : `${movies.length} Results`}
            </Typography>

            {/* Render list of movies */}
            <List>
                {movies.map((movie) => (
                    <React.Fragment key={movie.imdbID}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleMovieSelect(movie)}
                                onKeyPress={(e) => handleKeyPress(e, movie)}
                                tabIndex={0}
                                sx={{
                                    backgroundColor: selectedMovieId === movie.imdbID ? '#00000033' : 'transparent',
                                    '&:hover': {
                                        backgroundColor:
                                            selectedMovieId === movie.imdbID ? '#00000033' : 'transparent',
                                    },
                                }}
                            >
                                {/* Movie poster avatar */}
                                <ListItemAvatar>
                                    <Avatar src={movie.Poster} alt={movie.Title} />
                                </ListItemAvatar>
                                {/* Movie title and year/type details */}
                                <ListItemText
                                    primary={movie.Title}
                                    secondary={`${movie.Year} | ${movie.Type}`}
                                />
                            </ListItemButton>
                        </ListItem>
                        {/* Divider after each movie */}
                        <Divider variant="fullWidth" />
                    </React.Fragment>
                ))}
            </List>

            {/* Loading indicator that triggers infinite scroll */}
            <Box
                ref={loadingRef}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 2,
                }}
            >
                {loading && <CircularProgress size={24} />}
            </Box>
        </Box>
    );
};

export default MovieList;
