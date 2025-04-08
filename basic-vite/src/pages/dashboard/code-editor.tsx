import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
// Import required CSS
import 'monaco-editor/min/vs/editor/editor.main.css';
import Select from "@cloudscape-design/components/select";

// Remove the internal language state and use only the prop
const EnhancedCodeEditor = ({ value, onChange, language = 'javascript', onLanguageChange }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  
  // Available language options
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C/C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
    { value: 'other', label: 'Other' }
  ];

  // Initialize editor when component mounts or when language changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create transparent theme before initializing
    monaco.editor.defineTheme('transparentTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' }
      ],
      colors: {
        'editor.background': '#00000000',
        'editor.foreground': '#FFFFFF',
        'editorLineNumber.foreground': '#CCCCCC',
        'editorCursor.foreground': '#FFFFFF',
        'editor.selectionBackground': '#264F7899',
        'editor.lineHighlightBackground': '#FFFFFF15'
      }
    });

    // Initialize or update Monaco Editor
    if (!editorRef.current) {
      // Create new editor instance
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: value || '',
        language: language,
        theme: 'transparentTheme',
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        matchBrackets: 'always'
      });

      // Set up change handler
      editorRef.current.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editorRef.current.getValue());
        }
      });
    } else {
      // Just update the language if editor already exists
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }

    // Resize editor when window resizes
    const resizeEditor = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };
    window.addEventListener('resize', resizeEditor);

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeEditor);
      if (editorRef.current) {
        // Don't dispose on language change, just when component unmounts
        if (!containerRef.current) {
          editorRef.current.dispose();
          editorRef.current = null;
        }
      }
    };
  }, [language]); // Only re-run if language changes

  // Update value when prop changes
  useEffect(() => {
    if (editorRef.current && value !== undefined && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  // Handle language change from dropdown
  const handleLanguageChange = ({ detail }) => {
    if (onLanguageChange) {
      onLanguageChange(detail.selectedOption);
    }
  };

  return (
    <div className="code-editor-wrapper">
      <div className="language-selector">
        <div style={{ minWidth: '120px', maxWidth: '150px' }}>
          <Select
            selectedOption={languageOptions.find(option => option.value === language) || languageOptions[0]}
            onChange={handleLanguageChange}
            options={languageOptions}
            selectedAriaLabel="Selected language"
            placeholder="Select language"
          />
        </div>
      </div>
      <div ref={containerRef} className="monaco-editor-container"></div>
      <style jsx>{`
        .code-editor-wrapper {
          border: 1px solid rgba(120, 120, 120, 0.2);
          border-radius: 4px;
          overflow: hidden;
          height: 400px;
          width: 100%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        .monaco-editor-container {
          height: calc(100% - 40px);
          width: 100%;
        }
        .language-selector {
          padding: 8px;
          background-color: transparent;
          border-bottom: 1px solid rgba(120, 120, 120, 0.2);
        }
      `}</style>
      <style jsx global>{`
        .monaco-editor .margin,
        .monaco-editor-background,
        .monaco-editor .overflow-guard {
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default EnhancedCodeEditor;