import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Header,
  Icon,
  Link,
  Modal,
  SpaceBetween,
  Table,
  TextFilter,
  Select,
} from "@cloudscape-design/components";
import { RiAiGenerate2 } from "react-icons/ri";
import StatisticsBlock from './statistics-block';
import { TbBrandLeetcode } from "react-icons/tb";
import { SiGeeksforgeeks } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { GoFileCode } from "react-icons/go";
import { defaultData } from './defaultData';
import EnhancedCodeEditor from './code-editor';
import { FaStar, FaRegStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

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

  // Load expanded states from localStorage
  const loadExpandedStates = () => {
    const savedExpandedTopics = localStorage.getItem('expandedTopics');
    const savedExpandedSubtopics = localStorage.getItem('expandedSubtopics');
    
    // Default to basic expanded state if nothing in localStorage
    const defaultExpandedTopics = {
      "Basics": true,
      "Arrays": true,
    };
    
    const defaultExpandedSubtopics = {
      "Basics-Time and Space Complexity": true,
      "Arrays-Basic Array Problems": true,
    };
    
    return {
      topics: savedExpandedTopics ? JSON.parse(savedExpandedTopics) : defaultExpandedTopics,
      subtopics: savedExpandedSubtopics ? JSON.parse(savedExpandedSubtopics) : defaultExpandedSubtopics
    };
  };

  // Define available languages
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' },
  ];

  // Load selected language from localStorage
  const loadSelectedLanguage = () => {
    const savedLanguageStr = localStorage.getItem('selectedProgrammingLanguage');
    if (savedLanguageStr) {
      try {
        return JSON.parse(savedLanguageStr);
      } catch (e) {
        console.error("Error parsing saved language", e);
        return languageOptions[0];
      }
    }
    return languageOptions[0]; // Default to first language
  };

  // State variables
  const [dsaData, setDsaData] = useState(loadInitialData);
  const [filterText, setFilterText] = useState("");
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(loadSelectedLanguage);
  
  // Store previous progress values for animation
  const [progressAnimations, setProgressAnimations] = useState({});
  
  // Load expanded states with persistence
  const expandedStates = loadExpandedStates();
  const [expandedTopics, setExpandedTopics] = useState(expandedStates.topics);
  const [expandedSubtopics, setExpandedSubtopics] = useState(expandedStates.subtopics);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('dsaTrackerData', JSON.stringify(dsaData));
  }, [dsaData]);
  
  // Save expanded states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expandedTopics', JSON.stringify(expandedTopics));
  }, [expandedTopics]);
  
  useEffect(() => {
    localStorage.setItem('expandedSubtopics', JSON.stringify(expandedSubtopics));
  }, [expandedSubtopics]);

  // Save selected language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedProgrammingLanguage', JSON.stringify(selectedLanguage));
  }, [selectedLanguage]);

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

  // Define the table columns for questions
  const questionColumns = [
    {
      id: "status",
      header: "Status",
      cell: (item) => (
        <Checkbox
          checked={item.status === "Done"}
          onChange={({ detail }) => 
            updateQuestionStatus(item.id, detail.checked)
          }
        />
      ),
      width: 100
    },
    {
      id: "name",
      header: "Problem",
      cell: (item) => (
        <Link href={item.problemLink || "#"} >
          {item.name}
        </Link>
      ),
      width: 300
    },
    {
      id: "notes",
      header: "Notes",
      cell: (item) => {
        const hasNotes = item.note && item.note.trim();
        return (
          <button
            onClick={() => openNoteModal(item.id, item.note)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title={hasNotes ? "View saved notes" : "Add notes"}
          >
            <GoFileCode
              size={20}
              color={hasNotes ? '#2ecc71' : '#EEE'}
            />
          </button>
        );
      },
      width: 110
    },
    {
      id: "solution",
      header: "Generate",
      cell: () => (
          <RiAiGenerate2 size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
  
      ),
      width: 120
    },
    {
      id: "difficulty",
      header: "Difficulty",
      cell: (item) => {
        const difficulty = item.difficulty || "Medium";
        const difficultyColor = {
          Easy: "#2ecc71",
          Medium: "#f2a200",
          Hard: "#e74c3c"
        };
    
        const difficultyBgColor = {
          Easy: "#2ecc711a",
          Medium: "#f2a2001a",
          Hard: "#e74c3c1a"
        };
    
        return (
          <Box
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: difficultyColor[difficulty],
              backgroundColor: difficultyBgColor[difficulty],
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: `1px solid ${difficultyColor[difficulty]}`,
              lineHeight: 1
            }}
          >
            <GoDotFill
              color={difficultyColor[difficulty]}
              size={12}
              style={{ marginRight: '6px', verticalAlign: 'middle' }}
            />
            {difficulty}
          </Box>
        );
      },
      width: 140
    },
    {
      id: "level",
      header: "Level",
      cell: (item) => {
        // Extract level if it exists, or assign default
        const level = item.level || "L1";
        return level;
      },
      width: 100
    },
    {
      id: "leetcode",
      header: "LeetCode",
      cell: (item) => (
        item.questionLink ? (
          <Link href={item.questionLink} >
            <TbBrandLeetcode size={20} style={{ verticalAlign: 'middle' }} />
          </Link>
        ) : null
      ),
      width: 110
    },
    {
      id: "gfg",
      header: "GFG",
      cell: (item) => (
        item.gfgLink ? (
          <Link href={item.gfgLink} >
            <SiGeeksforgeeks size={18} style={{ verticalAlign: 'middle' }} />
          </Link>
        ) : null
      ),
      width: 110
    },
    {
      id: "youtube",
      header: "YouTube",
      cell: (item) => (
        item.youtubeLink ? (
          <Link href={item.youtubeLink} >
            <FaYoutube size={18} style={{ verticalAlign: 'middle' }} />
          </Link>
        ) : null
      ),
      width: 110
    },
    {
      id: "starred",
      header: "Important",
      cell: (item) => (
        <button onClick={() => toggleStarred(item.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          {item.starred ? <FaStar color="gold" /> : <FaRegStar />}
        </button>
      ),
      width: 100
    }
  ];

  // Enhanced Progress Bar Component with animation
  const ProgressBar = ({ progress, progressKey, variant = "default" }) => {
    const progressRef = useRef(null);
    const animationRef = useRef(null);
    const [displayProgress, setDisplayProgress] = useState(progress);
    
    // Check if we have animation data for this key
    const animation = progressAnimations[progressKey];
    
    useEffect(() => {
      // Clean up previous animation if it exists
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // If we have animation data and it's relatively fresh (less than 2 seconds old)
      if (animation && Date.now() - animation.timestamp < 2000) {
        let startTime;
        const duration = 800; // Animation duration in ms
        
        const animateProgress = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Use easeOutCubic easing function for smooth animation
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          // Calculate current value in the animation
          const currentValue = animation.from + (animation.to - animation.from) * easeProgress;
          setDisplayProgress(currentValue);
          
          // Continue animation if not finished
          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animateProgress);
          } else {
            // Ensure we reach the exact final value
            setDisplayProgress(animation.to);
          }
        };
        
        // Start animation
        animationRef.current = requestAnimationFrame(animateProgress);
      } else {
        // No animation data or too old, just use the provided progress
        setDisplayProgress(progress);
      }
      
      // Cleanup function
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [progress, animation]);
    
    // Enhanced gradient that responds to progress
    const getProgressGradient = (value) => {
      // Color scheme changes based on progress
      if (value < 33) {
        return 'linear-gradient(90deg, #F27121 0%, #F27121 100%)';
      } else if (value < 66) {
        return 'linear-gradient(90deg, #F27121 0%, #E94057 100%)';
      } else {
        return 'linear-gradient(90deg, #8A2387 0%, #E94057 50%, #F27121 100%)';
      }
    };
    
    // Make both progress bars the same height (2px)
    const barHeight = "2px";
    const barMargin = variant === "topic" ? "14px" : "12px";
    const shadowIntensity = variant === "topic" ? "0.7" : "0.6";
    
    return (
      <div 
        style={{ 
          width: '100%', 
          height: barHeight,
          backgroundColor: '#f3f3f3', 
          borderRadius: '4px',
          marginBottom: barMargin,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05) inset',
          position: 'relative'
        }}
      >
        <div 
          ref={progressRef}
          style={{
            width: `${displayProgress}%`,
            height: '100%',
            background: getProgressGradient(displayProgress),
            borderRadius: '4px',
            transition: animation ? 'none' : 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: `0 0 8px rgba(242, 113, 33, ${shadowIntensity})`,
            position: 'relative',
            zIndex: 2
          }}
        />
        
        {/* Subtle pulse effect */}
        {animation && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${displayProgress}%`,
              height: '100%',
              background: 'rgba(255, 255, 255, 0.3)',
              filter: 'blur(4px)',
              animation: 'pulse 1.5s ease-in-out',
              zIndex: 1
            }}
          />
        )}
        
        {/* Add global styles for the pulse animation */}
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 0.4; }
            100% { opacity: 0; }
          }
        `}</style>
      </div>
    );
  };

  // Function to create a clickable header with custom styles
  const ClickableHeader = ({ children, variant, actions, onClick }) => {
    return (
      <div 
        style={{ 
          cursor: 'pointer', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
        onClick={onClick}
      >
        <Header variant={variant} actions={actions}>
          {children}
        </Header>
      </div>
    );
  };

  return (
    <Container>
      <SpaceBetween size="m">
        <Header variant="h1">
          DSA Problem Tracker
        </Header>
        <StatisticsBlock dsaData={dsaData} />

        <Box>
          <SpaceBetween direction="horizontal" size="l">
            <TextFilter
              filteringText={filterText}
              filteringPlaceholder="Find problems"
              filteringAriaLabel="Filter problems"
              onChange={({ detail }) => setFilterText(detail.filteringText)}
            />
            
            <Select
              selectedOption={selectedLanguage}
              onChange={({ detail }) => setSelectedLanguage(detail.selectedOption)}
              options={languageOptions}
              placeholder="Select language"
              selectedAriaLabel="Selected"
            />
          </SpaceBetween>
        </Box>

        {dsaData.map((topic, topicIndex) => {
          // Calculate total progress for this topic
          const topicProgress = calculateTopicProgress(topic);
          const allTopicQuestions = topic.subtopics.flatMap(subtopic => subtopic.questions);
          const completedTopicQuestions = allTopicQuestions.filter(q => q.status === "Done").length;
          const totalTopicQuestions = allTopicQuestions.length;
          
          return (
            <Container
              key={topicIndex}
              header={
                <div 
                  style={{ cursor: 'pointer', width: '100%' }} 
                  onClick={() => toggleTopic(topic.topic)}
                >
                  <Header
                    variant="h2"
                    actions={
                      <SpaceBetween direction="horizontal" size="xs">
                        <Box>{`${completedTopicQuestions}/${totalTopicQuestions}`}</Box>
                        <Icon
                          name={expandedTopics[topic.topic] ? "treeview-collapse" : "treeview-expand"}
                        />
                      </SpaceBetween>
                    }
                  >
                    {topic.topic}
                  </Header>
                </div>
              }
            >
              {/* Add Topic-level Progress Bar */}
              <Box padding={{ bottom: "m" }}>
                <ProgressBar 
                  progress={topicProgress} 
                  progressKey={topic.topic}
                  variant="topic"
                />
              </Box>
              
              {expandedTopics[topic.topic] && (
                <SpaceBetween size="m">
                  {topic.subtopics.map((subtopic, subtopicIndex) => {
                    // Filter questions based on search text
                    const filteredQuestions = subtopic.questions.filter(q => 
                      filterText ? q.name.toLowerCase().includes(filterText.toLowerCase()) : true
                    );
                    
                    // Calculate progress for this subtopic
                    const progress = calculateProgress(subtopic.questions);
                    const completedCount = subtopic.questions.filter(q => q.status === "Done").length;
                    const totalCount = subtopic.questions.length;
                    const subtopicKey = `${topic.topic}-${subtopic.title}`;
                    
                    return (
                      <Container
                        key={subtopicIndex}
                        header={
                          <div 
                            style={{ cursor: 'pointer', width: '100%' }} 
                            onClick={() => toggleSubtopic(topic.topic, subtopic.title)}
                          >
                            <Header
                              variant="h3"
                              actions={
                                <SpaceBetween direction="horizontal" size="xs">
                                  <Box>{`${completedCount}/${totalCount}`}</Box>
                                  <Icon
                                    name={expandedSubtopics[subtopicKey] ? "treeview-collapse" : "treeview-expand"}
                                  />
                                </SpaceBetween>
                              }
                            >
                              {subtopic.title}
                            </Header>
                          </div>
                        }
                      >
                        {expandedSubtopics[subtopicKey] && (
                          <>
                            <Box padding={{ bottom: "m" }}>
                              <SpaceBetween direction="vertical" size="xs">
                                <Box display="flex" alignItems="center">
                                  <Box flexGrow={1}>
                                    <ProgressBar 
                                      progress={progress} 
                                      progressKey={subtopicKey}
                                    />
                                  </Box>
                                  <Box 
                                    paddingLeft="s" 
                                    fontSize="body-s" 
                                    color="text-body-secondary"
                                    style={{
                                      transition: "all 0.3s ease",
                                      fontWeight: progressAnimations[subtopicKey] ? "bold" : "normal"
                                    }}
                                  >
                                    {`${completedCount}/${totalCount}`}
                                  </Box>
                                </Box>
                              </SpaceBetween>
                            </Box>
                            <Table
                              items={filteredQuestions}
                              columnDefinitions={questionColumns}
                              variant="embedded"
                              stickyHeader
                              resizableColumns
                              stripedRows
                              wrapLines={false}
                              fullWidth={true}
                            />
                          </>
                        )}
                      </Container>
                    );
                  })}
                </SpaceBetween>
              )}
            </Container>
          );
        })}
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
          language={selectedLanguage.value} // Pass the selected language to the code editor
        />
      </Modal>
    </Container>
  );
};

export default DSATracker;