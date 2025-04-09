import React, { useState, useEffect } from "react";
import { Container, Header, SpaceBetween, Box, Modal, Button } from "@cloudscape-design/components";
import StatisticsBlock from './statistics-block';
import { defaultData } from './defaultData';
import EnhancedCodeEditor from './code-editor';

// Import components
import FilterSection from '../../components/FilterSection';
import TopicSection from '../../components/TopicSection';
import useLocalStorage from '../../components/useLocalStorage';
import AddQuestionModal from '../../components/AddQuestionModal';
import { FaPlus } from 'react-icons/fa';

const DSATracker = () => {
  // Load data from localStorage or use defaultData
  const loadInitialData = () => {
    const savedData = localStorage.getItem('dsaTrackerData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    // If no saved data, use default data
    const initialData = defaultData.map(topic => ({
      ...topic,
      subtopics: topic.subtopics.map(subtopic => ({
        ...subtopic,
        questions: subtopic.questions.map(question => ({
          ...question,
          starred: question.starred || false
        }))
      }))
    }));

    // Add custom questions section if not exists
    if (!initialData.some(topic => topic.topic === "My Custom Questions")) {
      initialData.push({
        topic: "My Custom Questions",
        subtopics: [{
          title: "Custom Questions",
          questions: []
        }]
      });
    }
    
    return initialData;
  };

  // Define available languages
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' },
  ];

  // State variables
  const [dsaData, setDsaData] = useState(loadInitialData);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  
  // New state for add question modal
  const [addQuestionModalVisible, setAddQuestionModalVisible] = useState(false);
  
  // Store previous progress values for animation
  const [progressAnimations, setProgressAnimations] = useState({});
  
  // Filter state - using multi-selection approach
  const [filterText, setFilterText] = useState("");
  
  // Store filter selections with multi-select capability
  const [activeFilters, setActiveFilters] = useState({
    difficulty: [], // Can contain any of: 'Easy', 'Medium', 'Hard'
    level: [],      // Can contain any of: 'L1', 'L2', 'L3', 'L4'
    notes: [],      // Can contain: 'with-notes'
    starred: []     // Can contain: 'starred'
  });

  // Function to toggle a filter value on/off
  const toggleFilter = (filterCategory, value) => {
    setActiveFilters(prev => {
      // Check if value already exists in the filter array
      const exists = prev[filterCategory].includes(value);
      if (exists) {
        // Remove the value
        return {
          ...prev,
          [filterCategory]: prev[filterCategory].filter(item => item !== value)
        };
      } else {
        // Add the value
        return {
          ...prev,
          [filterCategory]: [...prev[filterCategory], value]
        };
      }
    });
  };

  // Custom hook for localStorage management
  const { 
    storedValue: expandedTopics, 
    setValue: setExpandedTopics 
  } = useLocalStorage('expandedTopics', {
    "Basics": true,
    "Arrays": true,
    "My Custom Questions": true, // Default expanded for custom questions
  });

  const { 
    storedValue: expandedSubtopics, 
    setValue: setExpandedSubtopics 
  } = useLocalStorage('expandedSubtopics', {
    "Basics-Time and Space Complexity": true,
    "Arrays-Basic Array Problems": true,
    "My Custom Questions-Custom Questions": true, // Default expanded for custom questions
  });

  const { 
    storedValue: selectedLanguage, 
    setValue: setSelectedLanguage 
  } = useLocalStorage('selectedProgrammingLanguage', languageOptions[0]);

  // Ensure we only have one custom questions section by cleaning up data
  useEffect(() => {
    const normalizeData = (data) => {
      // Check for duplicate "My Custom Questions" sections
      const customQuestionTopics = data.filter(topic => topic.topic === "My Custom Questions");
      
      if (customQuestionTopics.length > 1) {
        // Merge all custom questions into one section
        const mergedQuestions = [];
        
        customQuestionTopics.forEach(topic => {
          topic.subtopics.forEach(subtopic => {
            if (subtopic.title === "Custom Questions") {
              mergedQuestions.push(...subtopic.questions);
            }
          });
        });
        
        // Filter out all custom question sections
        const filteredData = data.filter(topic => topic.topic !== "My Custom Questions");
        
        // Add back a single merged custom questions section
        filteredData.push({
          topic: "My Custom Questions",
          subtopics: [{
            title: "Custom Questions",
            questions: mergedQuestions
          }]
        });
        
        return filteredData;
      }
      
      return data;
    };
    
    const normalizedData = normalizeData(dsaData);
    
    // If any changes were made, update the state
    if (JSON.stringify(normalizedData) !== JSON.stringify(dsaData)) {
      setDsaData(normalizedData);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('dsaTrackerData', JSON.stringify(dsaData));
  }, [dsaData]);

  // Function to toggle expansion of topics
  const toggleTopic = (topicName) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicName]: !prev[topicName]
    }));
  };

  // Function to toggle expansion of subtopics
  const toggleSubtopic = (topicName, subtopicTitle) => {
    const key = `${topicName}-${subtopicTitle}`;
    setExpandedSubtopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Function to apply all filters - updated for multi-selection
  const applyFilters = (question) => {
    // Text filter
    const textMatch = filterText ? 
      question.name.toLowerCase().includes(filterText.toLowerCase()) : 
      true;
    
    // Difficulty filter - match any of the selected difficulties or show all if none selected
    const difficultyMatch = activeFilters.difficulty.length === 0 ? 
      true : 
      activeFilters.difficulty.includes(question.difficulty);
    
    // Level filter - match any of the selected levels or show all if none selected
    const levelMatch = activeFilters.level.length === 0 ? 
      true : 
      activeFilters.level.includes(question.level);
    
    // Notes filter
    const hasNotes = question.note && question.note.trim().length > 0;
    const notesMatch = !activeFilters.notes.includes('with-notes') ? 
      true : 
      hasNotes;
    
    // Starred filter
    const starredMatch = !activeFilters.starred.includes('starred') ? 
      true : 
      question.starred;
    
    return textMatch && difficultyMatch && levelMatch && notesMatch && starredMatch;
  };

  // Calculate progress for a subtopic
  const calculateProgress = (questions) => {
    if (questions.length === 0) return 0;
    const completedQuestions = questions.filter(q => q.status === "Done").length;
    return (completedQuestions / questions.length) * 100;
  };

  // Calculate progress for an entire topic
  const calculateTopicProgress = (topic) => {
    const allQuestions = topic.subtopics.flatMap(subtopic => subtopic.questions);
    return calculateProgress(allQuestions);
  };

  // Function to update question status with animation
  const updateQuestionStatus = (questionId, isChecked) => {
    // First, find which subtopic and topic this question belongs to
    let targetSubtopicKey = null;
    let targetTopicName = null;
    let previousSubtopicProgress = 0;
    let previousTopicProgress = 0;
    
    // Find the subtopic key and calculate previous progress
    dsaData.forEach(topic => {
      let foundInTopic = false;
      
      topic.subtopics.forEach(subtopic => {
        const hasQuestion = subtopic.questions.some(q => q.id === questionId);
        if (hasQuestion) {
          const key = `${topic.topic}-${subtopic.title}`;
          targetSubtopicKey = key;
          targetTopicName = topic.topic;
          previousSubtopicProgress = calculateProgress(subtopic.questions);
          foundInTopic = true;
        }
      });
      
      if (foundInTopic) {
        previousTopicProgress = calculateTopicProgress(topic);
      }
    });
    
    // Update the data
    const newData = dsaData.map(topic => {
      const updatedTopic = {
        ...topic,
        subtopics: topic.subtopics.map(subtopic => {
          const updatedSubtopic = {
            ...subtopic,
            questions: subtopic.questions.map(question => 
              question.id === questionId 
                ? { ...question, status: isChecked ? "Done" : "Not Started" } 
                : question
            )
          };
          
          // If this is the affected subtopic, update animation state
          if (targetSubtopicKey === `${topic.topic}-${subtopic.title}`) {
            const newProgress = calculateProgress(updatedSubtopic.questions);
            
            // Store animation values for subtopic
            setProgressAnimations(prev => ({
              ...prev,
              [targetSubtopicKey]: {
                from: previousSubtopicProgress,
                to: newProgress,
                timestamp: Date.now()
              }
            }));
          }
          
          return updatedSubtopic;
        })
      };
      
      // If this is the affected topic, update animation state for topic progress
      if (topic.topic === targetTopicName) {
        const newTopicProgress = calculateTopicProgress(updatedTopic);
        
        // Store animation values for topic
        setProgressAnimations(prev => ({
          ...prev,
          [topic.topic]: {
            from: previousTopicProgress,
            to: newTopicProgress,
            timestamp: Date.now()
          }
        }));
      }
      
      return updatedTopic;
    });
    
    setDsaData(newData);
  };

  // Function to toggle star status
  const toggleStarred = (questionId) => {
    const newData = dsaData.map(topic => ({
      ...topic,
      subtopics: topic.subtopics.map(subtopic => ({
        ...subtopic,
        questions: subtopic.questions.map(question => 
          question.id === questionId 
            ? { ...question, starred: !question.starred } 
            : question
        )
      }))
    }));
    
    setDsaData(newData);
  };

  // Function to open note modal
  const openNoteModal = (questionId, note) => {
    setCurrentQuestionId(questionId);
    setCurrentNote(note || "");
    setNoteModalVisible(true);
  };

  // Function to save note
  const saveNote = () => {
    const newData = dsaData.map(topic => ({
      ...topic,
      subtopics: topic.subtopics.map(subtopic => ({
        ...subtopic,
        questions: subtopic.questions.map(question => 
          question.id === currentQuestionId 
            ? { ...question, note: currentNote } 
            : question
        )
      }))
    }));
    
    setDsaData(newData);
    setNoteModalVisible(false);
  };

  // Function to handle saving a new custom question
  const handleSaveNewQuestion = (newQuestion) => {
    const newData = dsaData.map(topic => {
      if (topic.topic === "My Custom Questions") {
        return {
          ...topic,
          subtopics: topic.subtopics.map(subtopic => {
            if (subtopic.title === "Custom Questions") {
              return {
                ...subtopic,
                questions: [...subtopic.questions, newQuestion]
              };
            }
            return subtopic;
          })
        };
      }
      return topic;
    });
    
    setDsaData(newData);
    setAddQuestionModalVisible(false);
  };

  // Handle language change from code editor
  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  return (
    <Container>
      <SpaceBetween size="m">
        <Header
          variant="h1"
          actions={
            <Button
            
              variant="primary"
              onClick={() => setAddQuestionModalVisible(true)}
            >
              <SpaceBetween direction="horizontal" size="xs">
                <FaPlus />
                Add Question
              </SpaceBetween>
            </Button>
          }
        >
          DSA Problem Tracker
        </Header>
        
        <StatisticsBlock dsaData={dsaData} />

        <FilterSection 
          filterText={filterText}
          setFilterText={setFilterText}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
        />

        {dsaData.map((topic, topicIndex) => (
          <TopicSection
            key={topicIndex}
            topic={topic}
            topicIndex={topicIndex}
            expanded={expandedTopics[topic.topic]}
            expandedSubtopics={expandedSubtopics}
            toggleTopic={toggleTopic}
            toggleSubtopic={toggleSubtopic}
            applyFilters={applyFilters}
            calculateProgress={calculateProgress}
            calculateTopicProgress={calculateTopicProgress}
            updateQuestionStatus={updateQuestionStatus}
            toggleStarred={toggleStarred}
            openNoteModal={openNoteModal}
            progressAnimations={progressAnimations}
          />
        ))}
      </SpaceBetween>

      {/* Note Modal */}
      <Modal
        visible={noteModalVisible}
        onDismiss={() => setNoteModalVisible(false)}
        header="Problem Notes"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setNoteModalVisible(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveNote}>
                Save
              </Button>
            </SpaceBetween>
          </Box>
        }
        size="large"
      >
        <EnhancedCodeEditor
          value={currentNote}
          onChange={value => setCurrentNote(value)}
          language={selectedLanguage.value}
          onLanguageChange={handleLanguageChange}
        />
      </Modal>

      {/* Add Question Modal (same as before) */}
      <AddQuestionModal
        visible={addQuestionModalVisible}
        onDismiss={() => setAddQuestionModalVisible(false)}
        onSave={handleSaveNewQuestion}
      />
    </Container>
  );
};

export default DSATracker;