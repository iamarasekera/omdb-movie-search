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
  FormLabel
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
}) => {
  /**
   * Effect hook to trigger search when filters change
   * This automatically updates results when type or year changes (on option buttons)
   */
  useEffect(() => {
    // Only trigger search if there's a query or year input
    if (query.trim() || year.trim()) {
      onSearch();
    }
  }, [type, year]); // Dependencies: type and year filters 

  /**
   * Handler for type filter changes
   * Updates the type and maintains the controlled component pattern
   */
  const handleTypeChange = (newType: typeof type) => {
    setType(newType);
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
              if (e.key === 'Enter' && !loading) {
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
        </Box>

        {/* Input field for selecting the year */}
        <TextField
          label="Year"
          variant="outlined"
          size="small"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          sx={{
            width: 100,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
            }
          }}
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