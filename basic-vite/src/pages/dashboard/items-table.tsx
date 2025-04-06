import React, { useState, useEffect } from "react";
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
} from "@cloudscape-design/components";
import { RiAiGenerate2 } from "react-icons/ri";
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
    } else {
      // Initialize with starred set to false for all questions
      const initialData = defaultData.map(topic => ({
        ...topic,
        subtopics: topic.subtopics.map(subtopic => ({
          ...subtopic,
          questions: subtopic.questions.map(question => ({
            ...question,
            starred: false
          }))
        }))
      }));
      return initialData;
    }
  };

  // State variables
  const [dsaData, setDsaData] = useState(loadInitialData);
  const [filterText, setFilterText] = useState("");
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  
  // State for tracking expanded sections
  const [expandedTopics, setExpandedTopics] = useState({
    "Basics": true,
    "Arrays": true,
  });
  
  const [expandedSubtopics, setExpandedSubtopics] = useState({
    "Basics-Time and Space Complexity": true,
    "Arrays-Basic Array Problems": true,
  });

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

  // Function to update question status
  const updateQuestionStatus = (questionId, isChecked) => {
    const newData = dsaData.map(topic => ({
      ...topic,
      subtopics: topic.subtopics.map(subtopic => ({
        ...subtopic,
        questions: subtopic.questions.map(question => 
          question.id === questionId 
            ? { ...question, status: isChecked ? "Done" : "Not Started" } 
            : question
        )
      }))
    }));
    
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
        <Link href={item.problemLink || "#"} external={!!item.problemLink}>
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
        <Button variant="normal">
          <RiAiGenerate2 size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
  
        </Button>
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
          <Link href={item.questionLink}>
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
          <Link href={item.gfgLink}>
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
          <Link href={item.youtubeLink}>
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

  return (
    <Container>
      <SpaceBetween size="m">
        <Header variant="h1">
          DSA Problem Tracker
        </Header>

        <TextFilter
          filteringText={filterText}
          filteringPlaceholder="Find problems"
          filteringAriaLabel="Filter problems"
          onChange={({ detail }) => setFilterText(detail.filteringText)}
        />

        {dsaData.map((topic, topicIndex) => (
          <Container
            key={topicIndex}
            header={
              <Header
                variant="h2"
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Box>{`${topic.subtopics.flatMap(subtopic => subtopic.questions).length} Problems`}</Box>
                    <Button 
                      variant="icon" 
                      iconName={expandedTopics[topic.topic] ? "treeview-collapse" : "treeview-expand"}
                      onClick={() => toggleTopic(topic.topic)}
                    />
                  </SpaceBetween>
                }
              >
                {topic.topic}
              </Header>
            }
          >
            {expandedTopics[topic.topic] && (
              <SpaceBetween size="m">
                {topic.subtopics.map((subtopic, subtopicIndex) => {
                  // Filter questions based on search text
                  const filteredQuestions = subtopic.questions.filter(q => 
                    filterText ? q.name.toLowerCase().includes(filterText.toLowerCase()) : true
                  );
                  
                  return (
                    <Container
                      key={subtopicIndex}
                      header={
                        <Header
                          variant="h3"
                          actions={
                            <SpaceBetween direction="horizontal" size="xs">
                              <Box>{`${filteredQuestions.length} Problems`}</Box>
                              <Button 
                                variant="icon" 
                                iconName={expandedSubtopics[`${topic.topic}-${subtopic.title}`] ? "treeview-collapse" : "treeview-expand"}
                                onClick={() => toggleSubtopic(topic.topic, subtopic.title)}
                              />
                            </SpaceBetween>
                          }
                        >
                          {subtopic.title}
                        </Header>
                      }
                    >
                      {expandedSubtopics[`${topic.topic}-${subtopic.title}`] && (
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
                      )}
                    </Container>
                  );
                })}
              </SpaceBetween>
            )}
          </Container>
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
      />

      </Modal>
    </Container>
  );
};

export default DSATracker;