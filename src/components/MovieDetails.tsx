/**
 * MovieDetails Component
 * This component displays detailed information about a specific movie.
*/

import React, { FC } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { MovieDetail } from '../types';
import { BookmarkBorderOutlined, BookmarkOutlined } from '@mui/icons-material';
import MovieRatings from './MovieRatings';
import { MovieFilter as MovieFilterIcon } from '@mui/icons-material';

// Define the types for the props MovieDetails component will receive
interface MovieDetailsProps {
  movie: MovieDetail | null;
  addToWatchlist: (movie: MovieDetail) => void;
  isInWatchlist: (movieId: string) => boolean;
}

// Functional component for the MovieDetails
const MovieDetails: FC<MovieDetailsProps> = ({ movie, addToWatchlist, isInWatchlist  }) => {
  // If no movie is selected, show a message prompting the user to select one
  if (!movie) {
    return (
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
              textAlign: 'center'
            }}
          >
            <MovieFilterIcon sx={{ fontSize: 100, color: 'grey.500', mb: 2 }} />
            <Typography variant="h5" color="textSecondary">
            Select a movie to see details.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  const inWatchlist = isInWatchlist(movie.imdbID);

  return (
    <Card>
      <CardContent>
        {/* Main container */}
        <Box sx={{ position: 'relative', pt: 5 }}>
          {/* Watchlist Button */}
          <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
            <Button
              variant="outlined"
              startIcon={inWatchlist ? <BookmarkOutlined /> : <BookmarkBorderOutlined />}
              onClick={() => addToWatchlist(movie)}
              sx={{
                color: inWatchlist ? 'text.primary' : 'inherit',
              borderColor:  inWatchlist ? 'text.primary' : 'inherit',
              }}
            >
              Watchlist
            </Button>
          </Box>

          {/* Content Container */}
          <Box sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' } // Stack on mobile, row on desktop
          }}>
            {/* Movie Poster */}
            <Box sx={{
              flexBasis: { xs: 'auto', md: '300px' },
              flexShrink: 0,
              width: { xs: '100%', md: '300px' }
            }}>
              <CardMedia
                component="img"
                height="450"
                image={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
                alt={movie.Title}
              sx={{ objectFit: 'cover',width: '100%',borderRadius: 1}}
              />
            </Box>

            {/* Movie Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>{movie.Title}</Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={movie.Year} />
                <Chip label={movie.Rated} />
                <Chip label={movie.Runtime} />
                <Chip label={movie.Type} />
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
            </Box>
          </Box>
        </Box>
        {/* Movie Ratings Component */}
        <MovieRatings movie={movie} />
      </CardContent>
    </Card>
  );
};

export default MovieDetails;