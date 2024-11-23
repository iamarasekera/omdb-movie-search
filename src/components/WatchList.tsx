/**
 * WatchList Component
 * This componentm manages user's saved or watched movies
*/
import React, { FC }  from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { Movie } from '../types';

// Define the types for the props WatchList component will receive
interface WatchListProps {
  watchlist: Movie[];
}

// Functional component for the WatchList
const WatchList: FC<WatchListProps> = ({ watchlist }) => {
  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      {/* Display the Watchlist Title */}
      <Typography variant="h6" gutterBottom>
        My Watchlist ({watchlist.length})
      </Typography>
      {/* Check if the watchlist is empty */}
      {watchlist.length === 0 ? (
        //If the watchlist is empty display "WatchList is empty" 
        <Typography variant="body2" color="textSecondary">
          Your watchlist is empty. Add movies to your watchlist to see them here.
        </Typography>
      ) : (
        /*Display the list of movies in the watchlist */
        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          {watchlist.map((movie) => (
            <ListItem key={movie.imdbID}>
               {/* Display the movie's poster image */}
              <ListItemAvatar>
                <Avatar
                  alt={movie.Title}
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
                  variant="rounded"
                />
              </ListItemAvatar>
              {/* Display the movie title and year of the movie added */}
              <ListItemText primary={movie.Title} secondary={movie.Year} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default WatchList;