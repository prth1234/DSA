import React, { useState } from 'react';
import {
  Modal,
  Box,
  SpaceBetween,
  Button,
  FormField,
  Input,
  Select,
  Container
} from "@cloudscape-design/components";

const AddQuestionModal = ({ visible, onDismiss, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    difficulty: { value: 'Medium', label: 'Medium' },
    level: { value: 'L1', label: 'L1' },
    questionLink: '',
    gfgLink: '',
    youtubeLink: '',
    problemLink: '',
  });
  
  const [nameError, setNameError] = useState('');

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types in name field
    if (field === 'name') {
      setNameError('');
    }
  };

  const handleSave = () => {
    // Validate form
    if (!formData.name.trim()) {
      setNameError('Problem name is required');
      return;
    }
    
    // Create new question object
    const newQuestion = {
      id: `custom-${Date.now()}`, // Generate unique ID
      name: formData.name,
      difficulty: formData.difficulty.value,
      level: formData.level.value,
      questionLink: formData.questionLink,
      gfgLink: formData.gfgLink,
      youtubeLink: formData.youtubeLink,
      problemLink: formData.problemLink,
      status: "Not Started",
      starred: false,
      note: ""
    };
    
    onSave(newQuestion);
    
    // Reset form
    setFormData({
      name: '',
      difficulty: { value: 'Medium', label: 'Medium' },
      level: { value: 'L1', label: 'L1' },
      questionLink: '',
      gfgLink: '',
      youtubeLink: '',
      problemLink: '',
    });
  };

  const difficultyOptions = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  const levelOptions = [
    { value: 'L1', label: 'L1' },
    { value: 'L2', label: 'L2' },
    { value: 'L3', label: 'L3' }
  ];

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      header="Add New Question"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </SpaceBetween>
        </Box>
      }
      size="large"
    >
      <Container>
        <SpaceBetween size="l">
          <FormField
            label="Problem Name *"
            errorText={nameError}
          >
            <Input
              value={formData.name}
              onChange={({ detail }) => handleChange('name', detail.value)}
              placeholder="Enter problem name"
            />
          </FormField>

          <FormField label="Difficulty">
            <Select
              options={difficultyOptions}
              selectedOption={formData.difficulty}
              onChange={({ detail }) => handleChange('difficulty', detail.selectedOption)}
            />
          </FormField>

          <FormField label="Level">
            <Select
              options={levelOptions}
              selectedOption={formData.level}
              onChange={({ detail }) => handleChange('level', detail.selectedOption)}
            />
          </FormField>

          <FormField label="LeetCode Link">
            <Input
              value={formData.questionLink}
              onChange={({ detail }) => handleChange('questionLink', detail.value)}
              placeholder="https://leetcode.com/problems/..."
            />
          </FormField>

          <FormField label="GeeksForGeeks Link">
            <Input
              value={formData.gfgLink}
              onChange={({ detail }) => handleChange('gfgLink', detail.value)}
              placeholder="https://practice.geeksforgeeks.org/problems/..."
            />
          </FormField>

          <FormField label="YouTube Tutorial Link">
            <Input
              value={formData.youtubeLink}
              onChange={({ detail }) => handleChange('youtubeLink', detail.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </FormField>

          <FormField label="Problem Description Link">
            <Input
              value={formData.problemLink}
              onChange={({ detail }) => handleChange('problemLink', detail.value)}
              placeholder="Any link to problem description"
            />
          </FormField>
        </SpaceBetween>
      </Container>
    </Modal>
  );
};

export default AddQuestionModal;