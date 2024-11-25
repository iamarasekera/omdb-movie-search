/**
 * YearRange Component
 * This component that displays a selectable range of years from 1970 to 2024.
 * It allows the user to select a range of years using a slider.
 */

import React from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { YearRange } from '../types';

// Custom styled component for the slider label
const SliderLabel = styled(Typography)({
    fontSize: '0.875rem',
    color: 'white',
    marginBottom: '8px'
});

interface YearRangeSliderProps {
    yearRange: YearRange; // The current year range selected by the user
    onYearRangeChange: (range: YearRange) => void; // Callback function to handle year range change
}

const YearRangeSlider: React.FC<YearRangeSliderProps> = ({
    yearRange,
    onYearRangeChange
}) => {
    // Constants for slider configuration
    const MIN_YEAR = 1970;
    const MAX_YEAR = 2024;
    const STEP = 1; // Step interval for the slider

    // Handle slider value change
    const handleChange = (event: Event, newValue: number | number[]) => {
        // Get the start and end years from the new value
        const [startYear, endYear] = newValue as number[];
        // Update the parent component with the new year range
        onYearRangeChange({ startYear, endYear });
    };

    return (
        <Box sx={{ width: '250px', px: 1 }}>
            {/* Display the label for the slider */}
            <SliderLabel>YEAR</SliderLabel>
            {/* Display the year range slider */}
            <Slider
                value={[yearRange.startYear, yearRange.endYear]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={MIN_YEAR}
                max={MAX_YEAR}
                step={STEP}
                sx={{
                    color: 'white',
                    '& .MuiSlider-thumb': {
                        backgroundColor: 'white',
                    },
                    '& .MuiSlider-track': {
                        backgroundColor: 'white',
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '& .MuiSlider-valueLabel': {
                        backgroundColor: 'white',
                        color: 'black',
                    }
                }}
            />
        </Box>
    );
};

export default YearRangeSlider;