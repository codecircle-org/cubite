'use client'
import React, { useState, useEffect } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { toast } from "react-hot-toast";

// Add Pyodide script loading logic
const loadPyodideScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js";
    script.onload = () => {
      // @ts-ignore
      resolve(window.loadPyodide());
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

interface EditorCodeEditorProps {
  code: string;
  language: "python" | "javascript" | "html" | "css";
  editable?: boolean;
}

function EditorCodeEditor({ code, language, editable = false }: EditorCodeEditorProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [editorCode, setEditorCode] = useState(code);

  // Load Pyodide when needed
  useEffect(() => {
    const loadPyodideInstance = async () => {
      try {
        const pyodideInstance = await loadPyodideScript();
        setPyodide(pyodideInstance);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        toast.error('Failed to load Python runtime');
      }
    };

    if (language === 'python') {
      loadPyodideInstance();
    }
  }, [language]);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const cookies = document.cookie.split(';');
      const darkModeCookie = cookies.find(cookie => cookie.trim().startsWith('darkModeEnabled='));
      setIsDarkMode(darkModeCookie?.includes('true') ?? false);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.querySelector('html'), {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Get language extensions based on selected language
  const getLanguageExtension = () => {
    switch (language) {
      case "python":
        return [python()];
      case "javascript":
        return [javascript()];
      case "html":
        return [html()];
      case "css":
        return [css()];
      default:
        return [];
    }
  };

  const handleRunCode = async () => {
    if (language !== "python") {
      toast.error("Code execution is only supported for Python");
      return;
    }

    if (!pyodide) {
      toast.error("Python runtime is not ready yet");
      return;
    }

    setIsExecuting(true);
    setOutput("");
    const loadingToast = toast.loading("Executing Python code...");

    try {
      // Redirect stdout to capture print statements
      pyodide.setStderr({
        batched: (output) => {
          setOutput(prev => prev + output + "\n");
        }
      });
      pyodide.setStdout({
        batched: (output) => {
          setOutput(prev => prev + output + "\n");
        }
      });

      const result = await pyodide.runPythonAsync(editorCode);
      if (result !== undefined) {
        setOutput(prev => prev + String(result) + "\n");
      }
      toast.dismiss(loadingToast);
      toast.success("Code executed successfully!");
    } catch (error) {
      console.error("Python execution error:", error);
      setOutput(prev => prev + `Error: ${error.message}\n`);
      toast.dismiss(loadingToast);
      toast.error("Error executing code");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="my-4">
      <CodeMirror
        value={editorCode}
        height="200px"
        extensions={getLanguageExtension()}
        editable={editable}
        className="border rounded-lg"
        theme={isDarkMode ? githubDark : githubLight}
        onChange={(value) => {
          setEditorCode(value);
        }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
      {language === "python" && (
        <div className="mt-4">
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleRunCode}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Executing...
                </>
              ) : (
                "Run Code"
              )}
            </button>
            {output && (
              <button
                className="btn btn-ghost"
                onClick={() => setOutput("")}
                disabled={isExecuting}
              >
                Clear Output
              </button>
            )}
          </div>
          {output && (
            <div className={`mt-4 p-4 rounded-lg font-mono whitespace-pre-wrap ${
              isDarkMode ? 'bg-base-300' : 'bg-base-200'
            }`}>
              {output}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EditorCodeEditor;