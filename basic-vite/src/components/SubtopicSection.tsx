// components/SubtopicSection.jsx
import React from "react";
import { Container, Header, SpaceBetween, Box, Icon } from "@cloudscape-design/components";
import ProgressBar from "./ProgressBar";
import QuestionTable from "./QuestionTable";

const SubtopicSection = ({ 
  topic,
  subtopic, 
  subtopicIndex,
  subtopicKey,
  expanded,
  toggleSubtopic,
  applyFilters,
  calculateProgress,
  progressAnimations,
  updateQuestionStatus,
  toggleStarred,
  openNoteModal
}) => {
  // Filter questions based on all filters
  const filteredQuestions = subtopic.questions.filter(applyFilters);
  
  // Calculate progress for this subtopic
  const progress = calculateProgress(subtopic.questions);
  const completedCount = subtopic.questions.filter(q => q.status === "Done").length;
  const totalCount = subtopic.questions.length;

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
                  name={expanded ? "treeview-collapse" : "treeview-expand"}
                />
              </SpaceBetween>
            }
          >
            {subtopic.title}
          </Header>
        </div>
      }
    >
      {expanded && (
        <>
          <Box padding={{ bottom: "m" }}>
            <SpaceBetween direction="vertical" size="xs">
              <Box display="flex" alignItems="center">
                <Box flexGrow={1}>
                  <ProgressBar 
                    progress={progress} 
                    progressKey={subtopicKey}
                    progressAnimations={progressAnimations}
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
          <QuestionTable
            questions={filteredQuestions}
            updateQuestionStatus={updateQuestionStatus}
            toggleStarred={toggleStarred}
            openNoteModal={openNoteModal}
            />
          </>
        )}
      </Container>
    );
  };
  
  export default SubtopicSection;