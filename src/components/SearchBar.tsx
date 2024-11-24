/**
 * SearchBar Component
 * This component provides search functionality for movies
*/
import React, { FC } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Import the SearchIcon

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
    //Search Bar Container
    <Box display="flex" gap={2} sx={{
      backgroundColor: '#727272', // Set background color of the to gray
      padding: 2,
      borderRadius: 1, 
      width: '100%' // To ensure it spans the full width of the container
    }}>
     {/* Input field for searching movies */}
    <TextField
      placeholder="Search Movies"
      variant="standard"       
      fullWidth
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSearch();
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'white' }} />
          </InputAdornment>
        ),
        disableUnderline: true, // Disabled underline for borderless effect
      }}
      sx={{
        input: {
          color: 'white', // Input text color
          padding: '20px 0', // Adjust padding for vertical centering
        },
        '& .MuiInputBase-root': {
          display: 'flex',
          alignItems: 'center', // Vertically center icon and text
          backgroundColor: 'transparent', // Set transparent background
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'white', // Placeholder text color
          opacity: 1, // Ensure full opacity
        },
        '& .MuiInputAdornment-root': {
          marginTop: '0', // To prevent misalignment
        },
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