/**
 * SearchBar Component
 * This component provides search functionality for movies
*/
import React, { FC } from 'react';
import {
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';

// Define the types for the props SearchBar component will receive
interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    onSearch: () => void;
    loading: boolean;
    year: string;
    setYear: (year: string) => void;
    type: 'movie' | 'series' | 'episode' | '';
    setType: (type: 'movie' | 'series' | 'episode' | '') => void;
}

// Functional component for the SearchBar
const SearchBar: FC<SearchBarProps> = ({ 
    query, 
    setQuery, 
    onSearch, 
    loading,
    year,
    setYear,
    type,
    setType
  }) => (
    <Box display="flex" gap={2} mb={3}>
     {/* Input field for searching movies */}
    <TextField
      label="Search Movies"
      variant="outlined"
      fullWidth
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSearch();
        }
      }}
    />
    {/* Input field for selecting the year */}
    <TextField
      label="Year"
      variant="outlined"
      value={year}
      onChange={(e) => setYear(e.target.value)}
      sx={{ width: 100 }}
    />
    {/* Dropdown for selecting the type of content */}
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel>Type</InputLabel>
      <Select
        value={type}
        label="Type"
        onChange={(e) => setType(e.target.value as typeof type)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="movie">Movie</MenuItem>
        <MenuItem value="series">Series</MenuItem>
        <MenuItem value="episode">Episode</MenuItem>
      </Select>
    </FormControl>
     {/* Search button to trigger the search */}
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onSearch}
      disabled={loading}
    >
      Search
    </Button>
  </Box>
);

export default SearchBar;