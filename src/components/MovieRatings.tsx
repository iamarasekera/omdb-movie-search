/**
 * MovieRatings Component
 * This component displays movie ratings from IMDb, Rotten Tomatoes & Metacritic
 */
import React from 'react';
import { Box, Typography, Divider, Theme } from '@mui/material';
import { MovieDetail } from '../types';  // Remove Rating from import since we're not using it directly
import { SxProps } from '@mui/system';

// Props interface for the main component
interface MovieRatingsProps {
  movie: MovieDetail;
  sx?: SxProps<Theme>;
}

// Props for the individual rating display sections
interface RatingSectionProps {
  source: string;
  rating: string;
  outOf: string;
  sx?: SxProps<Theme>;
}

// Component for displaying individual rating sections
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

// Main MovieRatings component
const MovieRatings: React.FC<MovieRatingsProps> = ({ movie, sx }) => {
  // Helper function to get rating by source
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
      outOf: ''  // No outOf needed as RT includes % in rating
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