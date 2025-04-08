// components/FilterSection.jsx
import React from "react";
import { Box, TextFilter, Select } from "@cloudscape-design/components";

const FilterSection = ({ 
  filterText, 
  setFilterText,
  starredFilter,
  setStarredFilter,
  difficultyFilter,
  setDifficultyFilter,
  notesFilter,
  setNotesFilter,
  levelFilter,
  setLevelFilter 
}) => {
  // Filter options
  const starredOptions = [
    { value: "all", label: "All Problems" },
    { value: "starred", label: "Starred Only" },
  ];

  const difficultyOptions = [
    { value: "all", label: "All Difficulties" },
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" },
  ];

  const notesOptions = [
    { value: "all", label: "All Notes" },
    { value: "with-notes", label: "With Notes" },
    { value: "without-notes", label: "Without Notes" },
  ];

  const levelOptions = [
    { value: "all", label: "All Levels" },
    { value: "L1", label: "Level 1" },
    { value: "L2", label: "Level 2" },
    { value: "L3", label: "Level 3" },
    { value: "L4", label: "Level 4" },
  ];

  return (
    <Box>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        {/* Left side - Search box */}
        <div style={{ flex: '1' }}>
          <TextFilter
            filteringText={filterText}
            filteringPlaceholder="Find problems"
            filteringAriaLabel="Filter problems"
            onChange={({ detail }) => setFilterText(detail.filteringText)}
          />
        </div>
        
        {/* Right side - Filter selects */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          marginLeft: '20px'
        }}>
          <div style={{ width: '150px' }}>
            <Select
              selectedOption={starredOptions.find(option => option.value === starredFilter)}
              onChange={({ detail }) => setStarredFilter(detail.selectedOption.value)}
              options={starredOptions}
              placeholder="Starred"
            />
          </div>
          
          <div style={{ width: '150px' }}>
            <Select
              selectedOption={difficultyOptions.find(option => option.value === difficultyFilter)}
              onChange={({ detail }) => setDifficultyFilter(detail.selectedOption.value)}
              options={difficultyOptions}
              placeholder="Difficulty"
            />
          </div>
          
          <div style={{ width: '150px' }}>
            <Select
              selectedOption={notesOptions.find(option => option.value === notesFilter)}
              onChange={({ detail }) => setNotesFilter(detail.selectedOption.value)}
              options={notesOptions}
              placeholder="Notes"
            />
          </div>
          
          <div style={{ width: '150px' }}>
            <Select
              selectedOption={levelOptions.find(option => option.value === levelFilter)}
              onChange={({ detail }) => setLevelFilter(detail.selectedOption.value)}
              options={levelOptions}
              placeholder="Level"
            />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default FilterSection;