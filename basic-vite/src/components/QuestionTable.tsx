// components/QuestionTable.jsx
import React from "react";
import { Box, Table, Checkbox, Link } from "@cloudscape-design/components";
import { RiAiGenerate2 } from "react-icons/ri";
import { TbBrandLeetcode } from "react-icons/tb";
import { SiGeeksforgeeks } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { GoFileCode } from "react-icons/go";
import { FaStar, FaRegStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const QuestionTable = ({ 
  questions, 
  updateQuestionStatus, 
  toggleStarred, 
  openNoteModal 
}) => {
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

  return (
    <Table
      items={questions}
      columnDefinitions={questionColumns}
      variant="embedded"
      stickyHeader
      resizableColumns
      stripedRows
      wrapLines={false}
      fullWidth={true}
      empty={
        <Box textAlign="center" padding="l">
          <b>No matching problems</b>
          <Box padding={{ top: "s" }}>
            Try adjusting your filters or search term
          </Box>
        </Box>
      }
    />
  );
};

export default QuestionTable;