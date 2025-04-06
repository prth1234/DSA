import React from "react";
import { Textarea } from "@cloudscape-design/components";

const CodeEditor = ({ value, onChange }) => {
  return (
    <div className="code-editor-container">
      <Textarea
        value={value}
        onChange={({ detail }) => onChange(detail.value)}
        rows={20}
        spellcheck={false}
        className="code-editor"
        placeholder="Enter your notes or code here..."
      />
      <style jsx global>{`
        .code-editor {
          font-family: monospace;
          tab-size: 2;
        }
        .code-editor-container {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          min-height: 300px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;