// Main DSATracker.jsx file
import React, { useState, useEffect } from "react";
import { Container, Header, SpaceBetween, Box, Modal, Button } from "@cloudscape-design/components";
import StatisticsBlock from './statistics-block';
import { defaultData } from './defaultData';
import EnhancedCodeEditor from './code-editor';

// Import new components
import FilterSection from '../../components/FilterSection';
import TopicSection from '../../components/TopicSection';
import useLocalStorage from '../../components/useLocalStorage';

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
  
  // Store previous progress values for animation
  const [progressAnimations, setProgressAnimations] = useState({});
  
  // Filter states extracted to their own section
  const [filterText, setFilterText] = useState("");
  const [starredFilter, setStarredFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [notesFilter, setNotesFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  // Custom hook for localStorage management
  const { 
    storedValue: expandedTopics, 
    setValue: setExpandedTopics 
  } = useLocalStorage('expandedTopics', {
    "Basics": true,
    "Arrays": true,
  });

  const { 
    storedValue: expandedSubtopics, 
    setValue: setExpandedSubtopics 
  } = useLocalStorage('expandedSubtopics', {
    "Basics-Time and Space Complexity": true,
    "Arrays-Basic Array Problems": true,
  });

  const { 
    storedValue: selectedLanguage, 
    setValue: setSelectedLanguage 
  } = useLocalStorage('selectedProgrammingLanguage', languageOptions[0]);

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

  // Function to apply all filters
  const applyFilters = (question) => {
    // Text filter
    const textMatch = filterText ? 
      question.name.toLowerCase().includes(filterText.toLowerCase()) : 
      true;
    
    // Starred filter
    const starMatch = starredFilter === "all" ? 
      true : 
      (starredFilter === "starred" && question.starred);
    
    // Difficulty filter
    const difficultyMatch = difficultyFilter === "all" ? 
      true : 
      question.difficulty === difficultyFilter;
    
    // Notes filter
    const hasNotes = question.note && question.note.trim().length > 0;
    const notesMatch = notesFilter === "all" ? 
      true : 
      (notesFilter === "with-notes" && hasNotes) || 
      (notesFilter === "without-notes" && !hasNotes);
    
    // Level filter
    const levelMatch = levelFilter === "all" ? 
      true : 
      question.level === levelFilter;
    
    return textMatch && starMatch && difficultyMatch && notesMatch && levelMatch;
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

  // Handle language change from code editor
  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  return (
    <Container>
      <SpaceBetween size="m">
        <Header variant="h1">
          DSA Problem Tracker
        </Header>
        <StatisticsBlock dsaData={dsaData} />

        <FilterSection 
          filterText={filterText}
          setFilterText={setFilterText}
          starredFilter={starredFilter}
          setStarredFilter={setStarredFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          notesFilter={notesFilter}
          setNotesFilter={setNotesFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
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
    </Container>
  );
};

export default DSATracker;