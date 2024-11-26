/**
 * SearchBar Component
 * This component provides search functionality for movies, series, or episodes
 */
import React, { FC, useEffect, useCallback, memo } from 'react';
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
import SearchIcon from '@mui/icons-material/Search';
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
   * Automatically updates results when type, year range, or query changes
   */
  useEffect(() => {
    if (query.trim()) {
      onSearch();
    }
  }, [type, yearRange, query, onSearch]);

  /**
   * Updates the type filter and maintains the controlled component pattern
   * @param newType - New type selected (movie, series, episode, or empty)
   */
  const handleTypeChange = useCallback((newType: typeof type) => {
    setType(newType);
  }, [setType]);

  /**
   * Executes search when the query is valid and not loading
   */
  const handleSearch = useCallback(() => {
    if (!loading && query.trim()) {
      onSearch();
    }
  }, [loading, query, onSearch]);

  /**
   * Handles input change for the search query
   * @param e - Event from input change
   */
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, [setQuery]);

  /**
   * Handles the Enter key press event to execute a search
   * @param e - Key press event from the input
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <Stack spacing={1}>
      {/* Main Search Container */}
      <Box
        sx={{
          backgroundColor: '#727272',
          borderRadius: 1,
          p: 2,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        {/* Input field for searching movies */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '40%' }}>
          <TextField
            placeholder="Search Movies"
            variant="standard"
            fullWidth
            value={query}
            onChange={handleQueryChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={handleSearch}
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
              disableUnderline: true
            }}
            sx={{
              input: {
                color: 'white',
                padding: '20px 0'
              },
              '& .MuiInputBase-root': {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent'
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'white',
                opacity: 1
              },
              '& .MuiInputAdornment-root': {
                marginTop: '0'
              }
            }}
          />
        </Box>

        {/* Year Range Slider */}
        <YearRangeSlider
          yearRange={yearRange}
          onYearRangeChange={setYearRange}
        />

        {/* Radio Button Group for type selection */}
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

export default memo(SearchBar);