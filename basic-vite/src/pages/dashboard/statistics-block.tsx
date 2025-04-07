import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  ColumnLayout,
  Box,
} from "@cloudscape-design/components";

const StatisticsBlock = ({ dsaData }) => {
  // Initialize statistics state
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    starred: 0,
    completionRate: 0
  });

  // Calculate statistics whenever dsaData changes
  useEffect(() => {
    if (!dsaData || dsaData.length === 0) return;

    // Flatten all questions from all topics and subtopics
    const allQuestions = dsaData.flatMap(topic => 
      topic.subtopics.flatMap(subtopic => 
        subtopic.questions
      )
    );
    
    // Count metrics
    const totalQuestions = allQuestions.length;
    const completedQuestions = allQuestions.filter(q => q.status === "Done").length;
    const starredQuestions = allQuestions.filter(q => q.starred).length;
    
    // Calculate completion rate (handle division by zero)
    const rate = totalQuestions > 0 
      ? Math.round((completedQuestions / totalQuestions) * 100) 
      : 0;
    
    // Update stats
    setStats({
      completed: completedQuestions,
      total: totalQuestions,
      starred: starredQuestions,
      completionRate: rate
    });
  }, [dsaData]);

  return (
    <Container
      header={
        <Header variant="h2">Statistics</Header>
      }
    >
      <ColumnLayout columns={4} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Completed</Box>
          <Box variant="awsui-value-large">{stats.completed}</Box>
        </div>
        
        <div>
          <Box variant="awsui-key-label">Total Questions</Box>
          <Box variant="awsui-value-large">{stats.total}</Box>
        </div>
        
        <div>
          <Box variant="awsui-key-label">Starred</Box>
          <Box variant="awsui-value-large">{stats.starred}</Box>
        </div>
        
        <div>
          <Box variant="awsui-key-label">Completion Rate</Box>
          <Box variant="awsui-value-large">{stats.completionRate}%</Box>
        </div>
      </ColumnLayout>
    </Container>
  );
};

export default StatisticsBlock;