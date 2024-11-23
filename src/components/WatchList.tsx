/**
 * WatchList Component
 * This componentm manages user's saved or watched movies
*/
import React, { FC }  from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Movie } from '../types';

// Define the types for the props WatchList component will receive
interface WatchListProps {
  watchlist: Movie[];
}

// Functional component for the WatchList
const WatchList: FC<WatchListProps> = ({ watchlist }) => (
<Box>
  {/* Display the text Watchlist */}
    <Typography variant="h6">Watchlist</Typography>
    {/* List of movies in the watchlist */}
    <List>
      {watchlist.map((movie) => (
        <ListItem key={movie.imdbID}>
           {/* Display the movie title and year of the movie added */}
          <ListItemText primary={movie.Title} secondary={movie.Year} />
        </ListItem>
      ))}
    </List>
  </Box>
);

export default WatchList;