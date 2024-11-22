/**
 * MovieList Component
 * This component renders a list of movies.
*/
import React, { FC } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    Avatar,
    Button
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
const MovieList: React.FC<MovieListProps> = ({
    movies,
    onSelectMovie,
    totalResults = 0,
    onLoadMore,
    hasMore = false,
    loading = false
}) => (
    <Box>
        {/* Display total number of results */}
        <Typography variant="h6" gutterBottom>
            {totalResults ? `${totalResults} Results` : `${movies.length} Results`}
        </Typography>
        {/* Render list of movies */}
        <List>
            {movies.map((movie) => (
                <ListItem key={movie.imdbID} disablePadding>
                    <ListItemButton onClick={() => onSelectMovie(movie)}>
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
            ))}
        </List>
        {/* Conditional rendering of "Load More" button */}
        {hasMore && !loading && (
            <Box display="flex" justifyContent="center" mt={2}>
                <Button onClick={onLoadMore} variant="outlined">
                    Load More
                </Button>
            </Box>
        )}
    </Box>
);

export default MovieList;