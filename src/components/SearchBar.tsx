/**
 * SearchBar Component
 * This component provides search functionality for movies
*/
import React, { FC, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  FormControl,
  Stack,
  FormLabel,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Import the SearchIcon
import YearRangeSlider from './YearRangeSlide';
import { YearRange } from '../types';

// Define the types for the props SearchBar component will receive
interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
  yearRange: YearRange;
  setYearRange: (range: YearRange) => void;
  type: 'movie' | 'series' | 'episode' | '';
  setType: (type: 'movie' | 'series' | 'episode' | '') => void;
}

// Functional component for the SearchBar
const SearchBar: FC<SearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  loading,
  yearRange,
  setYearRange,
  type,
  setType
}) => {
  /**
   * Effect hook to trigger search when filters change
   * This automatically updates results when type or year range changes
   */
  useEffect(() => {
    //Only Triggers the search if the query is not empty
    if (query.trim()) {
      onSearch();
    }
  }, [type, yearRange]); // Dependencies: type and year range filters 

  /**
   * Handler for type filter changes
   * Updates the type and maintains the controlled component pattern
   */
  const handleTypeChange = (newType: typeof type) => {
    setType(newType);
  };

  /**
   * Handler for search execution
   * Prevents search when loading or query is empty
   */
  const handleSearch = () => {
    if (!loading && query.trim()) {
      onSearch();
    }
  };

  return (
    <Stack spacing={1}>
      {/* Main Search Container */}
      <Box sx={{
        backgroundColor: '#727272',
        borderRadius: 1,
        p: 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        {/* Input field for searching movies */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '40%' }}>
          <TextField
            placeholder="Search Movies"
            variant="standard"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // Execute search on enter button
                handleSearch();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton 
                    onClick={handleSearch} //Execute search onclick of search icon
                    disabled={loading}
                    size="small"
                    sx={{ 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                    aria-label="Search movies"
                  >
                    <SearchIcon />
                  </IconButton>
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
        </Box>

        {/* Year Range Slider */}
        <YearRangeSlider
          yearRange={yearRange}
          onYearRangeChange={setYearRange}
        />

        {/* Radion Button Group for type selection */}
        <FormControl component="fieldset">
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel
              component="legend"
              sx={{
                color: 'white',
                marginLeft: '4px',
                '&.Mui-focused': {
                  color: 'white'
                }
              }}
            >
              TYPE
            </FormLabel>
            <RadioGroup
              row
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as typeof type)}
              aria-label="Filter by type"
              sx={{
                '& .MuiFormControlLabel-root': {
                  marginRight: 3,
                  marginLeft: 0
                }
              }}
            >
              <FormControlLabel
                value=""
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                      padding: '4px'
                    }}
                  />
                }
                label={<Typography sx={{ color: 'white', fontSize: '0.9rem' }}>Any</Typography>}
              />
              <FormControlLabel
                value="movie"
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                      padding: '4px'
                    }}
                  />
                }
                label={<Typography sx={{ color: 'white', fontSize: '0.9rem' }}>Movies</Typography>}
              />
              <FormControlLabel
                value="series"
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                      padding: '4px'
                    }}
                  />
                }
                label={<Typography sx={{ color: 'white', fontSize: '0.9rem' }}>Series</Typography>}
              />
              <FormControlLabel
                value="episode"
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                      padding: '4px'
                    }}
                  />
                }
                label={<Typography sx={{ color: 'white', fontSize: '0.9rem' }}>Episodes</Typography>}
              />
            </RadioGroup>
          </Box>
        </FormControl>
      </Box>
    </Stack>
  );
};

export default SearchBar;