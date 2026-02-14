import { useState } from "react";
import "./styles/component.css";

import Card from "./components/Card";
import Button from "./components/Button";
import Input from "./components/Input";
import Modal from "./components/Modal";
import Sidebar from "./components/Sidebar";
import Table from "./components/Table";
import Chart from "./components/Chart";
import Navbar from "./components/Navbar";

function App() {
  const [uiPlan, setUiPlan] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [versions, setVersions] = useState([{ type: "Layout", children: [] }]); // Start with initial state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [activityLog, setActivityLog] = useState([]); // NEW: Track all activities
  const [copied, setCopied] = useState(false); // Track copy state

  const availableComponents = [
    "Navbar",
    "Sidebar",
    "Card",
    "Button",
    "Input",
    "Modal",
    "Table",
    "Chart"
  ];

  /* 🔴 DEEP CLONE FUNCTION */
  const clonePlan = (plan) => JSON.parse(JSON.stringify(plan));

  /* ===== COPY TO CLIPBOARD ===== */
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  /* ===== REGENERATE CODE FROM PLAN WITH CSS ===== */
  const generateCodeFromPlan = (node) => {
    if (!node) return "";

    if (node.type === "Layout") {
      if (node.children.length === 0) {
        return "// No components yet";
      }
      
      const jsxCode = node.children.map(generateJSX).join("\n");
      const cssCode = generateCSSForPlan(node.children);
      
      return `/* ===== JSX ===== */
${jsxCode}

/* ===== CSS ===== */
${cssCode}`;
    }

    return "";
  };

  /* Generate JSX only */
  const generateJSX = (node) => {
    if (!node) return "";

    if (node.type === "Navbar") return `<Navbar />`;
    if (node.type === "Input") return `<Input />`;
    if (node.type === "Modal") return `<Modal />`;
    if (node.type === "Sidebar") return `<Sidebar />`;
    if (node.type === "Chart") return `<Chart />`;

    if (node.type === "Table") {
      const title = node.props.title || "Table";
      return `<Table title="${title}" rows={${node.props.rows}} cols={${node.props.cols}} />`;
    }

    if (node.type === "Button") {
      return `<Button text="${node.props.text}" />`;
    }

    if (node.type === "Card") {
      const childrenCode = node.children?.map(generateJSX).join("\n") || "";
      
      if (childrenCode) {
        const indentedChildren = childrenCode.split('\n').map(line => '  ' + line).join('\n');
        return `<Card title="${node.props.title}">\n${indentedChildren}\n</Card>`;
      } else {
        return `<Card title="${node.props.title}" />`;
      }
    }

    return "";
  };

  /* Generate CSS for plan */
  const generateCSSForPlan = (children) => {
    const componentTypes = new Set();
    
    const collectTypes = (nodes) => {
      nodes.forEach(node => {
        componentTypes.add(node.type);
        if (node.children) collectTypes(node.children);
      });
    };
    
    collectTypes(children);
    
    let css = "";
    
    if (componentTypes.has("Navbar")) {
      css += `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  margin-bottom: 20px;
}

.navbar-brand .brand-text {
  font-size: 22px;
  font-weight: 800;
  color: white;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 24px;
  margin: 0;
  padding: 0;
}

.navbar-item {
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.navbar-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.navbar-btn {
  background: white;
  color: #667eea;
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

`;
    }
    
    if (componentTypes.has("Card")) {
      css += `.card {
  border-radius: 16px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  margin-bottom: 16px;
}

.card h3 {
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 18px;
  font-weight: 700;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

`;
    }
    
    if (componentTypes.has("Button")) {
      css += `.component-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
}

.component-button:hover {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  transform: translateY(-2px);
}

`;
    }
    
    if (componentTypes.has("Input")) {
      css += `.input-wrapper {
  margin-bottom: 16px;
  background: rgba(30, 41, 59, 0.5);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.input-label {
  display: block;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
}

.component-input {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  color: #e4e4e7;
  font-size: 14px;
}

.component-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

`;
    }
    
    if (componentTypes.has("Table")) {
      css += `.table-wrapper {
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.table-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
}

.data-table th {
  padding: 14px 18px;
  text-align: left;
  font-weight: 700;
  color: #e4e4e7;
  border-bottom: 2px solid #667eea;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.data-table td {
  padding: 12px 18px;
  color: #d4d4d8;
}

`;
    }
    
    if (componentTypes.has("Chart")) {
      css += `.chart-wrapper {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.2);
  margin-bottom: 20px;
}

.chart-title {
  margin: 0 0 24px 0;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 220px;
  gap: 16px;
}

.chart-bar {
  width: 100%;
  max-width: 70px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px 10px 0 0;
  transition: all 0.3s ease;
  box-shadow: 0 -4px 16px rgba(102, 126, 234, 0.4);
}

.chart-bar:hover {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  transform: scaleY(1.05);
}

`;
    }
    
    if (componentTypes.has("Modal")) {
      css += `.modal-trigger-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 20px;
  max-width: 500px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

`;
    }
    
    if (componentTypes.has("Sidebar")) {
      css += `.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.sidebar-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-item:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #e4e4e7;
}

.sidebar-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

`;
    }
    
    return css || "/* No components generated yet */";
  };

  /* ===== GENERATE EXPLANATION FROM PLAN ===== */
  const generateExplanationFromPlan = (plan) => {
    if (!plan.children.length) return "Empty layout";
    const list = plan.children.map(c => c.type).join(", ");
    return `Generated layout with: ${list}`;
  };

  /* ===== GENERATE ===== */
  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    const previousPlan = versions[currentIndex] || { type: "Layout", children: [] };

    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        input: userInput,
        previousPlan: previousPlan
      })
    });

    const data = await res.json();
    if (!data.plan) return;

    const newPlan = clonePlan(data.plan);

    // 🔴 CUT FUTURE HISTORY IF USER GENERATES AFTER ROLLBACK
    const updatedVersions = versions.slice(0, currentIndex + 1);

    // Add new version
    updatedVersions.push(newPlan);

    setVersions(updatedVersions);
    setCurrentIndex(updatedVersions.length - 1);

    setUiPlan(newPlan);
    setGeneratedCode(data.code || "");
    setExplanation(data.explanation || "");

    // 🔴 ADD TO ACTIVITY LOG
    setActivityLog(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      userRequest: userInput,
      aiExplanation: data.explanation,
      versionNumber: updatedVersions.length
    }]);

    setUserInput(""); // Clear input after generation
  };

  /* ===== ROLLBACK STEP BY STEP ===== */
  const handleRollback = () => {
    if (currentIndex <= 0) return; // Can't go back from initial state

    const prevIndex = currentIndex - 1;
    const prevPlan = clonePlan(versions[prevIndex]);

    setCurrentIndex(prevIndex);
    setUiPlan(prevPlan);

    // Regenerate code & explanation from the previous plan
    setGeneratedCode(generateCodeFromPlan(prevPlan));
    setExplanation(`Rolled back to version ${prevIndex + 1} of ${versions.length}`);
  };

  /* ===== FORWARD (REDO) ===== */
  const handleForward = () => {
    if (currentIndex >= versions.length - 1) return; // Can't go forward

    const nextIndex = currentIndex + 1;
    const nextPlan = clonePlan(versions[nextIndex]);

    setCurrentIndex(nextIndex);
    setUiPlan(nextPlan);

    // Regenerate code & explanation from the next plan
    setGeneratedCode(generateCodeFromPlan(nextPlan));
    setExplanation(`Forward to version ${nextIndex + 1} of ${versions.length}`);
  };

  /* ===== RENDER ===== */
  const renderNode = (node, key = 0) => {
    if (!node) return null;

    if (node.type === "Layout") {
      return node.children.map((child, i) => renderNode(child, i));
    }

    if (node.type === "Navbar") return <Navbar key={key} />;
    if (node.type === "Input") return <Input key={key} />;
    if (node.type === "Modal") return <Modal key={key} />;
    if (node.type === "Sidebar") return <Sidebar key={key} />;
    if (node.type === "Chart") return <Chart key={key} />;

    if (node.type === "Table") {
      return <Table key={key} title={node.props.title} rows={node.props.rows} cols={node.props.cols} />;
    }

    if (node.type === "Button") {
      return <Button key={key} text={node.props.text} />;
    }

    if (node.type === "Card") {
      return (
        <Card key={key} title={node.props.title}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="main-layout">
      <div className="chat-panel">
        <h2>AI UI Generator</h2>

        <div className="available-panel">
          <h4>Available</h4>
          <ul>
            {availableComponents.map((comp, index) => (
              <li key={index}>{comp}</li>
            ))}
          </ul>
        </div>

        {/* 🔴 ACTIVITY LOG */}
        <div className="activity-log">
          <h4>Activity Log</h4>
          <div className="log-container">
            {activityLog.length === 0 ? (
              <p className="empty-log">No activities yet. Start by describing a UI!</p>
            ) : (
              activityLog.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-header">
                    <span className="activity-time">{activity.timestamp}</span>
                    <span className="activity-version">v{activity.versionNumber}</span>
                  </div>
                  <div className="activity-request">
                    <strong>You:</strong> {activity.userRequest}
                  </div>
                  <div className="activity-explanation">
                    <strong>AI:</strong> {activity.aiExplanation}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-input-section">
          <textarea
            placeholder="Describe the UI..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />

          <button className="btn" onClick={handleGenerate}>
            Generate
          </button>

          <div className="version-controls">
            <button 
              className="btn rollback" 
              onClick={handleRollback}
              disabled={currentIndex <= 0}
            >
              ← Rollback
            </button>
            
            <span className="version-indicator">
              Version {currentIndex + 1} / {versions.length}
            </span>
            
            <button 
              className="btn forward" 
              onClick={handleForward}
              disabled={currentIndex >= versions.length - 1}
            >
              Forward →
            </button>
          </div>
        </div>
      </div>

      <div className="workspace">
        <div className="code-panel">
          <div className="code-header">
            <h2>Generated Code</h2>
            <button className="copy-button" onClick={handleCopyCode}>
              {copied ? '✓ Copied!' : '📋 Copy Code'}
            </button>
          </div>
          <pre>{generatedCode}</pre>
        </div>

        <div className="preview-panel">
          <h2>Live Preview</h2>
          <div className="preview-box">
            {uiPlan ? renderNode(uiPlan) : null}
          </div>

          <div className="explanation-box">
            <h3>Current Action</h3>
            <p>{explanation || "Waiting for your input..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;