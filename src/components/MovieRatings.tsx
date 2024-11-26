/**
 * MovieRatings Component
 * Displays movie ratings from IMDb, Rotten Tomatoes, and Metacritic
 */

import React from 'react';
import { Box, Typography, Divider, Theme } from '@mui/material';
import { MovieDetail } from '../types'; // Import for movie detail type
import { SxProps } from '@mui/system';

/**
 * Props interface for the main MovieRatings component
 */
interface MovieRatingsProps {
  movie: MovieDetail;
  sx?: SxProps<Theme>;
}

/**
 * Props for individual rating display sections
 */
interface RatingSectionProps {
  source: string;
  rating: string;
  outOf: string;
  sx?: SxProps<Theme>;
}

/**
 * Displays an individual rating section
 * @param source The name of the rating source (e.g., IMDb, Rotten Tomatoes)
 * @param rating The numerical rating value
 * @param outOf The scale of the rating (e.g., /10, /100)
 * @param sx Optional custom styles
 * @returns JSX Element for a single rating section
 */
const RatingSection: React.FC<RatingSectionProps> = ({ source, rating, outOf }) => (
  <Box 
    sx={{ 
      flex: 1, 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      p: 2
    }}
  >
    <Typography 
      variant="h4" 
      component="p" 
      sx={{ 
        mb: 1,
        display: 'flex',
        alignItems: 'baseline',
        gap: 0.5
      }}
      aria-label={`${rating} out of ${outOf}`}
    >
      {rating}
      {outOf && (
        <Typography variant="body2" component="span" color="text.secondary">
          /{outOf}
        </Typography>
      )}
    </Typography>
    <Typography 
      variant="body2" 
      color="text.secondary"
      sx={{ 
        wordBreak: 'break-word',
        maxWidth: '100%'
      }}
    >
      {source}
    </Typography>
  </Box>
);

/**
 * Displays ratings for a given movie
 * @param movie Movie details including ratings from different sources
 * @param sx Optional custom styles
 * @returns JSX Element for the ratings component
 */
const MovieRatings: React.FC<MovieRatingsProps> = ({ movie, sx }) => {
  /**
   * Fetches a specific rating from the movie data by source
   * @param source The name of the rating source
   * @returns The rating value or 'N/A' if not found
   */
  const getRatingBySource = (source: string): string => {
    const rating = movie.Ratings?.find((r) => r.Source === source);
    return rating?.Value || 'N/A';
  };

  // Define the data for each rating section
  const ratingsData = [
    {
      source: 'Internet Movie Database',
      rating: movie.imdbRating || 'N/A',
      outOf: '10'
    },
    {
      source: 'Rotten Tomatoes',
      rating: getRatingBySource('Rotten Tomatoes'),
      outOf: '' // No outOf needed as Rotten Tomatoes includes % in the rating
    },
    {
      source: 'Metacritic',
      rating: getRatingBySource('Metacritic').replace('/100', ''),
      outOf: '100'
    }
  ];

  return (
    <Box 
      sx={{
        mt: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: (theme) => theme.shadows[1],
        width: '100%',
        ...sx
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: { xs: 2, sm: 0 },
          width: '100%'
        }}
        role="group"
        aria-label="Movie ratings"
      >
        {ratingsData.map((rating, index) => (
          <React.Fragment key={rating.source}>
            {index > 0 && (
              <>
                <Divider 
                  orientation="vertical" 
                  flexItem 
                  sx={{ display: { xs: 'none', sm: 'block' } }} 
                />
                <Divider 
                  sx={{ 
                    width: '100%',
                    display: { xs: 'block', sm: 'none' }
                  }} 
                />
              </>
            )}
            <RatingSection {...rating} />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default MovieRatings;
