import React, { useState } from "react";
import {
  Box,
  Container,
  Header,
  Icon,
  Link,
  SpaceBetween,
  StatusIndicator,
  Table,
  TextFilter,
} from "@cloudscape-design/components";

const DSATracker = () => {
  // Include the initialData inside the component for now
  // This will be moved to an external file later
  const defaultData = [
    {
      topic: "Basics",
      subtopics: [
        {
          title: "Time and Space Complexity",
          questions: [
            {
              id: "BASICS_1",
              name: "What is Time Complexity?",
              problemLink: "https://example.com/time-complexity",
              questionLink: "https://leetcode.com/problem-set/time-complexity",
              gfgLink: "https://practice.geeksforgeeks.org/problems/time-complexity",
              youtubeLink: "https://youtube.com/watch?v=xyz123",
              needCode: true,
              difficulty: "Easy",
              starred: true,
              revisionNeeded: false,
              status: "Done",
              note: ""
            },
            {
              id: "BASICS_2",
              name: "What is Space Complexity?",
              problemLink: "",
              questionLink: "",
              gfgLink: "",
              youtubeLink: "",
              needCode: false,
              difficulty: "Easy",
              starred: false,
              revisionNeeded: false,
              status: "Not Started",
              note: ""
            }
          ]
        }
      ]
    },
    {
      topic: "Arrays",
      subtopics: [
        {
          title: "Basic Array Problems",
          questions: [
            {
              id: "ARR_1",
              name: "Find the Largest Element",
              problemLink: "https://leetcode.com/problems/largest-element/",
              questionLink: "https://leetcode.com/problems/largest-element/",
              gfgLink: "https://practice.geeksforgeeks.org/problems/largest-element-in-array4009",
              youtubeLink: "https://youtube.com/watch?v=abc456",
              needCode: true,
              difficulty: "Easy",
              starred: false,
              revisionNeeded: true,
              status: "In Progress",
              note: ""
            },
            {
              id: "ARR_2",
              name: "Check if Array is Sorted",
              problemLink: "",
              questionLink: "",
              gfgLink: "",
              youtubeLink: "",
              needCode: false,
              difficulty: "Medium",
              starred: true,
              revisionNeeded: false,
              status: "Not Started",
              note: "Watch NeetCode solution"
            }
          ]
        }
      ]
    }
  ];

  // State variables
  const [dsaData, setDsaData] = useState(defaultData);
  
  // State for tracking expanded sections
  const [expandedTopics, setExpandedTopics] = useState({
    "Basics": true,  // Pre-expand Basics section
    "Arrays": true,  // Pre-expand Arrays section
  });
  
  const [expandedSubtopics, setExpandedSubtopics] = useState({
    "Basics-Time and Space Complexity": true,  // Pre-expand this subtopic
    "Arrays-Basic Array Problems": true,       // Pre-expand this subtopic
  });
  
  const [filterText, setFilterText] = useState("");

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

  // Define the table columns for questions
  const questionColumns = [
    {
      id: "name",
      header: "Problem Name",
      cell: (item) => (
        <Link href={item.problemLink || "#"} external={!!item.problemLink}>
          {item.name}
        </Link>
      ),
      sortingField: "name",
      width: 250
    },
    {
      id: "status",
      header: "Status",
      cell: (item) => {
        const statusMap = {
          "Not Started": { type: "pending", label: "Not Started" },
          "In Progress": { type: "in-progress", label: "In Progress" },
          "Done": { type: "success", label: "Done" }
        };
        const status = statusMap[item.status] || statusMap["Not Started"];
        return <StatusIndicator type={status.type}>{status.label}</StatusIndicator>;
      },
      sortingField: "status",
      width: 120
    },
    {
      id: "difficulty",
      header: "Difficulty",
      cell: (item) => {
        const difficultyColor = {
          "Easy": "green",
          "Medium": "orange",
          "Hard": "red"
        };
        return (
          <Box color={difficultyColor[item.difficulty] || "grey"}>
            {item.difficulty}
          </Box>
        );
      },
      sortingField: "difficulty",
      width: 100
    },
    {
      id: "needCode",
      header: "Code Required",
      cell: (item) => (
        item.needCode ? "Yes" : "No"
      ),
      sortingField: "needCode",
      width: 120
    },
    {
      id: "links",
      header: "Resources",
      cell: (item) => (
        <SpaceBetween direction="horizontal" size="xs">
          {item.questionLink && (
            <Link href={item.questionLink} external>
              <Icon name="external" /> LeetCode
            </Link>
          )}
          {item.gfgLink && (
            <Link href={item.gfgLink} external>
              <Icon name="external" /> GFG
            </Link>
          )}
          {item.youtubeLink && (
            <Link href={item.youtubeLink} external>
              <Icon name="video" /> Tutorial
            </Link>
          )}
        </SpaceBetween>
      ),
      width: 250
    },
    {
      id: "starred",
      header: "Starred",
      cell: (item) => (
        item.starred ? 
        <Box color="orange"><Icon name="star-filled" /> Starred</Box> : 
        ""
      ),
      sortingField: "starred",
      width: 100
    },
    {
      id: "revision",
      header: "Revision Needed",
      cell: (item) => (
        item.revisionNeeded ? 
        <Box color="red"><Icon name="refresh" /> Needs Review</Box> : 
        ""
      ),
      sortingField: "revisionNeeded",
      width: 150
    },
    {
      id: "notes",
      header: "Notes",
      cell: (item) => (
        item.note ? 
        <Box>
          <Icon name="file" /> {item.note.substring(0, 30)}{item.note.length > 30 ? "..." : ""}
        </Box> : 
        ""
      ),
      width: 200
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
                    <Link
                      onFollow={() => toggleTopic(topic.topic)}
                      variant="button"
                    >
                      {expandedTopics[topic.topic] ? "Collapse" : "Expand"}
                    </Link>
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
                              <Link
                                onFollow={() => toggleSubtopic(topic.topic, subtopic.title)}
                                variant="button"
                              >
                                {expandedSubtopics[`${topic.topic}-${subtopic.title}`] ? "Collapse" : "Expand"}
                              </Link>
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
                          wrapLines
                          stripedRows
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
    </Container>
  );
};

export default DSATracker;