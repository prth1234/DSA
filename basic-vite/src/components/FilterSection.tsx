import React from "react";
import { Box, TextFilter, Button } from "@cloudscape-design/components";
import { FaStar } from "react-icons/fa";
import { GoFileCode } from "react-icons/go";

const FilterSection = ({ 
  filterText, 
  setFilterText,
  activeFilters,
  toggleFilter
}) => {
  // Button styles for filters
  const getButtonStyle = (filterKey, value) => {
    const isActive = activeFilters[filterKey].includes(value);
    return {
      variant: isActive ? "primary" : "normal",
    };
  };

  return (
    <Box>
      <div style={{ 
        display: 'flex', 
        gap: '16px',
        marginBottom: '16px',
        alignItems: 'center'
      }}>
        {/* Search box */}
        <div style={{ flexGrow: 1 }}>
          <TextFilter
            filteringText={filterText}
            filteringPlaceholder="Find problems"
            filteringAriaLabel="Filter problems"
            onChange={({ detail }) => setFilterText(detail.filteringText)}
          />
        </div>
        
        {/* Filter buttons all in one row */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Button 
            {...getButtonStyle('difficulty', 'Easy')}
            onClick={() => toggleFilter('difficulty', 'Easy')}
          >
            Easy
          </Button>
          <Button 
            {...getButtonStyle('difficulty', 'Medium')}
            onClick={() => toggleFilter('difficulty', 'Medium')}
          >
            Medium
          </Button>
          <Button 
            {...getButtonStyle('difficulty', 'Hard')}
            onClick={() => toggleFilter('difficulty', 'Hard')}
          >
            Hard
          </Button>
          <Button 
            {...getButtonStyle('level', 'L1')}
            onClick={() => toggleFilter('level', 'L1')}
          >
            L1
          </Button>
          <Button 
            {...getButtonStyle('level', 'L2')}
            onClick={() => toggleFilter('level', 'L2')}
          >
            L2
          </Button>
          <Button 
            {...getButtonStyle('level', 'L3')}
            onClick={() => toggleFilter('level', 'L3')}
          >
            L3
          </Button>
          <Button 
            {...getButtonStyle('level', 'L4')}
            onClick={() => toggleFilter('level', 'L4')}
          >
            L4
          </Button>
          <Button 
            {...getButtonStyle('notes', 'with-notes')}
            onClick={() => toggleFilter('notes', 'with-notes')}
          >
            With Notes
          </Button>
          <Button 
            {...getButtonStyle('starred', 'starred')}
            onClick={() => toggleFilter('starred', 'starred')}
          >
            Starred
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default FilterSection;