import {
  Container,
  Header,
  ColumnLayout,
  Box,
} from "@cloudscape-design/components";

export default function StatisticsBlock() {
  return (
    <Container header={<Header variant="h2">Statistics</Header>}>
      <ColumnLayout columns={4} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">Completed</Box>
          <div style={{ padding: "0.8rem 0", fontSize: "2.5rem" }}>42</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Total Questions</Box>
          <div style={{ padding: "0.8rem 0", fontSize: "2.5rem" }}>100</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Starred</Box>
          <div style={{ padding: "0.8rem 0", fontSize: "2.5rem" }}>18</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Completion Rate</Box>
          <div style={{ padding: "0.8rem 0", fontSize: "2.5rem" }}>42%</div>
        </div>
      </ColumnLayout>
    </Container>
  );
}
