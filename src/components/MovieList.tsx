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

// Define the types for the props MovieListProps component will receive
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
    
    // Add state to track selected movie
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

    // Handle movie selection
    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovieId(movie.imdbID);
        onSelectMovie(movie);
    };

    // Handle keyboard events
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
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                },
            }}
        >
            {/* Display total number of results */}
            <Typography variant="h6" gutterBottom>
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
                                        backgroundColor: selectedMovieId === movie.imdbID ? '#00000033' : 'transparent',
                                    }
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
                    py: 2
                }}
            >
                {loading && <CircularProgress size={24} />}
            </Box>
        </Box>
    );
};

export default MovieList;