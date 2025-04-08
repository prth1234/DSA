// components/TopicSection.jsx
import React from "react";
import { Container, Header, SpaceBetween, Box, Icon } from "@cloudscape-design/components";
import SubtopicSection from "./SubtopicSection";
import ProgressBar from "./ProgressBar";

const TopicSection = ({ 
  topic, 
  topicIndex,
  expanded,
  expandedSubtopics,
  toggleTopic,
  toggleSubtopic,
  applyFilters,
  calculateProgress,
  calculateTopicProgress,
  updateQuestionStatus,
  toggleStarred,
  openNoteModal,
  progressAnimations
}) => {
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
                  name={expanded ? "treeview-collapse" : "treeview-expand"}
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
          progressAnimations={progressAnimations}
        />
      </Box>
      
      {expanded && (
        <SpaceBetween size="m">
          {topic.subtopics.map((subtopic, subtopicIndex) => {
            const subtopicKey = `${topic.topic}-${subtopic.title}`;
            
            return (
              <SubtopicSection
                key={subtopicIndex}
                topic={topic}
                subtopic={subtopic}
                subtopicIndex={subtopicIndex}
                subtopicKey={subtopicKey}
                expanded={expandedSubtopics[subtopicKey]}
                toggleSubtopic={toggleSubtopic}
                applyFilters={applyFilters}
                calculateProgress={calculateProgress}
                progressAnimations={progressAnimations}
                updateQuestionStatus={updateQuestionStatus}
                toggleStarred={toggleStarred}
                openNoteModal={openNoteModal}
              />
            );
          })}
        </SpaceBetween>
      )}
    </Container>
  );
};

export default TopicSection;