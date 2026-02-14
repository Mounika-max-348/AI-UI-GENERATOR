const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* ===== OPENAI CLIENT ===== */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ===== STATE - REMOVED history, versions managed on frontend ===== */
let currentPlan = { type: "Layout", children: [] };

/* ===== HELPERS ===== */
const clone = (obj) => JSON.parse(JSON.stringify(obj));

const createButtons = (n) =>
  Array.from({ length: n }, (_, i) => ({
    type: "Button",
    props: { text: `Button ${i + 1}` }
  }));

/* ===== AI PLANNER ===== */
async function aiPlanner(input, currentPlan) {
  try {
    const currentComponents = currentPlan.children.map(c => c.type).join(", ") || "none";
    
    const prompt = `
You are a UI modification AI. You must MODIFY the existing UI based on user's request.

Current UI has: ${currentComponents}

User request: "${input}"

IMPORTANT RULES:
1. If user says "change", "modify", "update", "make it" - MODIFY existing components
2. If user says "add" - ADD new components to existing ones
3. If user says "remove", "delete" - REMOVE components
4. If user says "replace" - REPLACE specific components
5. Return ONLY valid JSON with this structure:

{
  "type": "Layout",
  "children": [
    // Array of components
  ]
}

Component types allowed:
- Navbar: { "type": "Navbar" }
- Sidebar: { "type": "Sidebar" }
- Input: { "type": "Input" }
- Modal: { "type": "Modal" }
- Chart: { "type": "Chart" }
- Table: { "type": "Table", "props": { "rows": 3, "cols": 3, "title": "Data Table" } }
- Button: { "type": "Button", "props": { "text": "Button 1" } }
- Card: { "type": "Card", "props": { "title": "Title" }, "children": [] }

Examples:

User: "change the card title to Dashboard"
Current: Card with title "Buttons"
Response: { "type": "Layout", "children": [{ "type": "Card", "props": { "title": "Dashboard" }, "children": [...keep same children...] }] }

User: "make the table bigger"
Current: Table 3x3
Response: { "type": "Layout", "children": [{ "type": "Table", "props": { "rows": 6, "cols": 6, "title": "Data Table" } }] }

User: "add more buttons"
Current: 2 buttons
Response: { "type": "Layout", "children": [{ "type": "Card", "props": { "title": "Buttons" }, "children": [5 buttons] }] }

Current UI structure:
${JSON.stringify(currentPlan, null, 2)}

Return ONLY the JSON, no explanation.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const text = response.choices[0].message.content;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    return JSON.parse(match[0]);

  } catch (error) {
    console.error("AI Planner error:", error);
    return null;
  }
}

/* ===== DETERMINISTIC PLANNER (YOUR LOGIC) ===== */
function planner(input) {
  input = input.toLowerCase().trim();
  const nums = input.match(/\d+/g)?.map(Number) || [];

  let newPlan = clone(currentPlan);

  // DELETE/REMOVE
  if (input.includes("delete") || input.includes("remove")) {
    if (input.includes("all") || input.includes("everything")) {
      newPlan.children = [];
    } else {
      newPlan.children.pop();
    }
    return newPlan;
  }

  // MODIFY EXISTING - Change card title
  if (input.includes("change") && input.includes("title")) {
    newPlan.children = newPlan.children.map(child => {
      if (child.type === "Card") {
        return { ...child, props: { ...child.props, title: "Updated Card" } };
      }
      return child;
    });
    return newPlan;
  }

  // MODIFY EXISTING - Make table bigger
  if (input.includes("bigger") || input.includes("larger")) {
    newPlan.children = newPlan.children.map(child => {
      if (child.type === "Table") {
        const newRows = (child.props.rows || 3) + 2;
        const newCols = (child.props.cols || 3) + 2;
        return { ...child, props: { ...child.props, rows: newRows, cols: newCols } };
      }
      return child;
    });
    return newPlan;
  }

  // MODIFY EXISTING - Make table smaller
  if (input.includes("smaller") || input.includes("reduce")) {
    newPlan.children = newPlan.children.map(child => {
      if (child.type === "Table") {
        const newRows = Math.max(2, (child.props.rows || 3) - 1);
        const newCols = Math.max(2, (child.props.cols || 3) - 1);
        return { ...child, props: { ...child.props, rows: newRows, cols: newCols } };
      }
      return child;
    });
    return newPlan;
  }

  // MODIFY EXISTING - Add more buttons
  if (input.includes("more button")) {
    const count = nums[0] || 2;
    newPlan.children = newPlan.children.map(child => {
      if (child.type === "Card" && child.props.title === "Buttons") {
        const currentCount = child.children?.length || 0;
        const newButtons = createButtons(currentCount + count);
        return { ...child, children: newButtons };
      }
      return child;
    });
    return newPlan;
  }

  // ADD NEW COMPONENTS (existing logic)
  if (input.includes("navbar")) {
    newPlan.children.push({ type: "Navbar" });
    return newPlan;
  }

  if (input.includes("input")) {
    newPlan.children.push({ type: "Input" });
    return newPlan;
  }

  if (input.includes("modal")) {
    newPlan.children.push({ type: "Modal" });
    return newPlan;
  }

  if (input.includes("sidebar")) {
    newPlan.children.push({ type: "Sidebar" });
    return newPlan;
  }

  if (input.includes("chart")) {
    newPlan.children.push({ type: "Chart" });
    return newPlan;
  }

  if (input.includes("table")) {
    const rows = nums[0] || 3;
    const cols = nums[1] || 3;

    newPlan.children.push({
      type: "Table",
      props: { 
        rows, 
        cols,
        title: "Data Table" 
      }
    });

    return newPlan;
  }

  if (input.includes("button")) {
    const count = nums[0] || 1;

    newPlan.children.push({
      type: "Card",
      props: { title: "Buttons" },
      children: createButtons(count)
    });

    return newPlan;
  }

  if (input.includes("card")) {
    newPlan.children.push({
      type: "Card",
      props: { title: "Generated Card" },
      children: []
    });

    return newPlan;
  }

  return newPlan;
}

/* ===== CODE GENERATOR WITH CSS ===== */
function generateCode(node) {
  if (!node) return "";

  if (node.type === "Layout") {
    if (node.children.length === 0) {
      return "// No components yet";
    }
    
    const jsxCode = node.children.map(generateJSX).join("\n");
    const cssCode = generateCSS(node.children);
    
    return `/* ===== JSX ===== */
${jsxCode}

/* ===== CSS ===== */
${cssCode}`;
  }

  return "";
}

/* Generate JSX only */
function generateJSX(node) {
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
}

/* Generate CSS for components */
function generateCSS(children) {
  const componentTypes = new Set();
  
  // Collect all component types
  function collectTypes(nodes) {
    nodes.forEach(node => {
      componentTypes.add(node.type);
      if (node.children) collectTypes(node.children);
    });
  }
  
  collectTypes(children);
  
  let css = "";
  
  // Navbar CSS
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
  
  // Card CSS
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
  
  // Button CSS
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
  
  // Input CSS
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
  
  // Table CSS
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
  
  // Chart CSS
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
  
  // Modal CSS
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
  
  // Sidebar CSS
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
}

/* ===== EXPLAINER ===== */
function explain(plan) {
  if (!plan.children.length) return "Empty layout";
  const list = plan.children.map(c => c.type).join(", ");
  return `Generated layout with: ${list}`;
}

/* ===== AI ACTIVITY EXPLAINER ===== */
async function explainActivity(userInput, oldPlan, newPlan) {
  try {
    const prompt = `
You are explaining what changed in a UI based on user's request.

User said: "${userInput}"

Previous UI had: ${oldPlan.children.map(c => c.type).join(", ") || "nothing"}
New UI has: ${newPlan.children.map(c => c.type).join(", ") || "nothing"}

Explain in 1-2 sentences:
1. What the user wanted
2. What components were added/removed/modified

Be conversational and friendly. Don't use technical jargon.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content.trim();

  } catch (error) {
    return `Added components based on your request: ${userInput}`;
  }
}

/* ===== GENERATE ROUTE (AI + FALLBACK) ===== */
app.post("/generate", async (req, res) => {
  const { input, previousPlan } = req.body;

  if (!input || input.trim() === "") {
    return res.json({
      plan: clone(previousPlan || currentPlan),
      code: generateCode(previousPlan || currentPlan),
      explanation: "Empty input"
    });
  }

  // 🔴 IMPORTANT: Use the plan from frontend, not server's currentPlan
  const basePlan = previousPlan || { type: "Layout", children: [] };

  // 🔴 Update server's currentPlan to match what frontend sent
  currentPlan = clone(basePlan);

  /* TRY AI FIRST - Pass current plan for modification */
  const aiPlan = await aiPlanner(input, currentPlan);

  if (aiPlan && aiPlan.type === "Layout") {
    currentPlan = aiPlan;
  } else {
    currentPlan = planner(input);
  }

  /* GET AI EXPLANATION OF ACTIVITY */
  const activityExplanation = await explainActivity(input, basePlan, currentPlan);

  res.json({
    plan: clone(currentPlan),
    code: generateCode(currentPlan),
    explanation: activityExplanation
  });
});

/* ===== START ===== */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});