/**
 * MovieDetails Component
 * This component displays detailed information about a specific movie.
*/

import React, { FC } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Chip, Rating } from '@mui/material';
import { MovieDetail } from '../types';

// Define the types for the props MovieDetails component will receive
interface MovieDetailsProps {
  movie: MovieDetail | null;
  addToWatchlist: (movie: MovieDetail) => void;
}

// Functional component for the MovieDetails
const MovieDetails: FC<MovieDetailsProps> = ({ movie, addToWatchlist }) => {
  // If no movie is selected, show a message prompting the user to select one
  if (!movie) {
    return (
      <Card>
        <CardContent>
          <Typography>Select a movie to see details.</Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent>
        <Box display="flex" gap={3}>
          {/* Movie Poster */}
          <Box flex="0 0 300px">
            <CardMedia
              component="img"
              height="450"
              image={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
              alt={movie.Title}
              sx={{ objectFit: 'cover' }}
            />
          </Box>
          {/* Movie Details */}
          <Box flex="1">
            <Typography variant="h4" gutterBottom>{movie.Title}</Typography>
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip label={movie.Year} />
              <Chip label={movie.Rated} />
              <Chip label={movie.Runtime} />
              <Chip label={movie.Type} />
            </Box>
            {/* IMDb Rating */}
            <Box mb={2}>
              <Rating
                value={parseFloat(movie.imdbRating) / 2}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2" color="text.secondary">
                IMDb Rating: {movie.imdbRating}/10
              </Typography>
            </Box>
            {/* Movie Information (Genre, Director, Actors, Plot) */}
            <Typography variant="body1" paragraph>
              <strong>Genre:</strong> {movie.Genre}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Director:</strong> {movie.Director}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Actors:</strong> {movie.Actors}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Plot:</strong> {movie.Plot}
            </Typography>
             {/* 'Add to Watchlist' Button */}
            <Button
              variant="contained"
              onClick={() => addToWatchlist(movie)}
              sx={{ mt: 2 }}
            >
              Add to Watchlist
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieDetails;