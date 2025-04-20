import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { toast } from "react-hot-toast";
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

// Remove the direct pyodide import and add script loading logic
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

class WasmEditor {
  static get toolbox() {
    return {
      title: "Code Editor",
      icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-braces'><path d='M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1'/><path d='M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1'/></svg>"
    };
  }

  constructor({ data }) {
    this.data = data || {
      editable: true,
      language: "python",
      code: "print('Hello, World!')",
    };
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const WasmEditorComponent = ({ initialData }) => {
      const [tabId] = useState(Math.floor(Math.random() * 10000));
      const [editable, setEditable] = useState(initialData.editable);
      const [language, setLanguage] = useState(initialData.language || "python");
      const [code, setCode] = useState(initialData.code || "print('Hello, World!')");
      const [output, setOutput] = useState("");
      const [isExecuting, setIsExecuting] = useState(false);
      const [pyodide, setPyodide] = useState(null);
      const [isDarkMode, setIsDarkMode] = useState(false);

      // Load Pyodide when component mounts
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

        if (language === 'python' && !pyodide) {
          loadPyodideInstance();
        }
      }, [language]);

      // Check for dark mode cookie when component mounts
      useEffect(() => {
        const checkDarkMode = () => {
          const cookies = document.cookie.split(';');
          const darkModeCookie = cookies.find(cookie => cookie.trim().startsWith('darkModeEnabled='));
          setIsDarkMode(darkModeCookie?.includes('true') ?? false);
        };

        // Initial check
        checkDarkMode();

        // Set up an observer for cookie changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.querySelector('html'), {
          attributes: true,
          attributeFilter: ['class']
        });

        return () => observer.disconnect();
      }, []);

      const handleEditableChange = (e) => {
        setEditable(e.target.checked);
        this.data.editable = e.target.checked;
      };

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

      // Get default code template based on language
      const getDefaultCode = (lang) => {
        switch (lang) {
          case "python":
            return "print('Hello, World!')";
          case "javascript":
            return "console.log('Hello, World!');";
          case "html":
            return "<h1>Hello, World!</h1>";
          case "css":
            return "body {\n  background-color: #f0f0f0;\n}";
          default:
            return "";
        }
      };

      const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        this.data.language = newLanguage;
        // Update code with default template if current code is empty
        if (!code || code === getDefaultCode(language)) {
          setCode(getDefaultCode(newLanguage));
          this.data.code = getDefaultCode(newLanguage);
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

          const result = await pyodide.runPythonAsync(code);
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
        <div 
          role="tablist" 
          className="tabs tabs-lifted my-4"
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="radio"
            name={`editor-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Editor"
            defaultChecked
          />
          <div 
            role="tabpanel" 
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <select
                className="select select-bordered w-full max-w-xs"
                value={language}
                onChange={handleLanguageChange}
                disabled={!editable}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
            <CodeMirror
              value={code}
              height="200px"
              extensions={getLanguageExtension()}
              onChange={(value) => {
                setCode(value);
                this.data.code = value;
              }}
              editable={editable}
              className="border rounded-lg"
              theme={isDarkMode ? githubDark : githubLight}
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
              onKeyDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
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

          <input
            type="radio"
            name={`editor-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Settings"
          />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Editable</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={editable}
                  onChange={handleEditableChange}
                  defaultChecked={editable}
                />
              </label>
            </div>
          </div>
        </div>
      );
    };

    root.render(<WasmEditorComponent initialData={this.data} />);
    return wrapper;
  }

  save(blockContent) {
    return {
      editable: this.data.editable,
      language: this.data.language,
      code: this.data.code,
    };
  }
}

export default WasmEditor;
