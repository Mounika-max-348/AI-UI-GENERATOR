# 🎨 AI UI Generator

<div align="center">

**Transform natural language into production-ready React components with AI-powered intelligence**

[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4+-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?logo=openai&logoColor=white)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-reference)

</div>

---

## 🌟 Features

### Core Capabilities
- 🧠 **AI-Powered UI Planning** - Leverages OpenAI/OpenRouter for intelligent component generation
- 🎨 **Live Preview** - Real-time rendering of generated React components
- 💻 **Auto-Generated Code** - Instant JSX code with syntax highlighting
- 📝 **AI Explanations** - Contextual descriptions of generated layouts
- 🕒 **Version History** - Complete state management with rollback capability
- 🔄 **Intelligent Fallback** - Deterministic planner when AI is unavailable

### Supported Components
| Component | Description | Example Usage |
|-----------|-------------|---------------|
| **Navbar** | Responsive navigation bar | `create navbar with logo and menu` |
| **Sidebar** | Collapsible side navigation | `add sidebar with 5 menu items` |
| **Card** | Content container | `create card with title and description` |
| **Button** | Interactive button | `add 3 buttons with different colors` |
| **Input** | Form input field | `create input field for email` |
| **Modal** | Dialog overlay | `add modal with form` |
| **Table** | Data grid | `create table with 4 rows and 3 columns` |
| **Chart** | Data visualization | `add bar chart with sample data` |

### Advanced Features
- ➕ **Natural Language Editing** - Add/remove components conversationally
- 🔙 **Step-by-Step Rollback** - Undo changes incrementally
- 🎯 **Component Nesting** - Support for complex hierarchies
- ⚡ **Real-Time Updates** - Instant UI synchronization
- 🛡️ **Error Recovery** - Graceful handling of invalid inputs

---

## 🚀 Demo

### Example Workflow

```plaintext
User Input: "create a dashboard with navbar, sidebar, and 3 cards with buttons"

AI Output:
├── Navbar
├── Sidebar
└── Container
    ├── Card
    │   ├── Title: "Analytics"
    │   └── Button: "View Details"
    ├── Card
    │   ├── Title: "Users"
    │   └── Button: "Manage"
    └── Card
        ├── Title: "Settings"
        └── Button: "Configure"
```

---

## 📦 Installation

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **OpenAI API Key** or **OpenRouter API Key**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ai-ui-generator.git
cd ai-ui-generator
```

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

**Required Packages:**
```bash
npm install express cors dotenv openai
```

### 3️⃣ Install Frontend Dependencies

```bash
cd ..
npm install
```

**Additional Packages (if needed):**
```bash
npm install recharts react-icons
```

### 4️⃣ Environment Configuration

Create `.env` file in the `backend/` directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: OpenRouter Configuration
# OPENROUTER_API_KEY=your-openrouter-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

**🔐 Security Note:** Never commit `.env` files to version control!

---

## 🎮 Usage

### Starting the Application

#### 1. Start Backend Server

```bash
cd backend
node server.js
```

**Expected Output:**
```plaintext
✓ Server running on http://localhost:5000
✓ AI Planner initialized
✓ Ready to accept requests
```

#### 2. Start Frontend Development Server

```bash
# In root directory
npm run dev
```

**Expected Output:**
```plaintext
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

### Accessing the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 💡 Example Prompts

### Basic Components
```plaintext
create navbar
add sidebar with 5 links
create card with title and button
add input field for username
```

### Complex Layouts
```plaintext
create a dashboard with navbar, sidebar, and 3 cards
add table with 5 rows and 4 columns showing user data
create modal with form containing 3 input fields
```

### Modifications
```plaintext
add 2 more buttons to the card
remove the last component
delete sidebar
```

### Version Control
```plaintext
rollback
go back 2 steps
reset to initial state
```

---

## 📂 Project Structure

```plaintext
AI-ui-generator/
│
├── backend/
│   ├── server.js              # Express server + AI logic
│   ├── .env                   # Environment variables (create this)
│   ├── package.json
│   └── node_modules/
│
├── src/
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Entry point
│   │
│   ├── components/
│   │   ├── Card.jsx          # Card component
│   │   ├── Button.jsx        # Button component
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── Sidebar.jsx       # Side navigation
│   │   ├── Input.jsx         # Form input
│   │   ├── Modal.jsx         # Dialog modal
│   │   ├── Table.jsx         # Data table
│   │   └── Chart.jsx         # Chart visualization
│   │
│   ├── styles/
│   │   └── component.css     # Component styles
│   │
│   └── utils/
│       └── helpers.js        # Utility functions
│
├── public/
│   └── assets/
│
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## 🔧 API Reference

### Backend Endpoint

#### Generate UI Layout

```http
POST /api/generate
```

**Request Body:**
```json
{
  "prompt": "create navbar with 3 buttons",
  "history": []
}
```

**Response:**
```json
{
  "success": true,
  "layout": {
    "type": "container",
    "children": [
      {
        "type": "navbar",
        "props": {
          "title": "Navigation"
        }
      }
    ]
  },
  "explanation": "Created a navbar with navigation menu",
  "code": "const Layout = () => {...}"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid prompt",
  "fallback": true
}
```

---

## 🛠️ Configuration

### Customizing AI Behavior

Edit `backend/server.js`:

```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4", // or "gpt-3.5-turbo"
  temperature: 0.7, // Adjust creativity (0.0 - 1.0)
  max_tokens: 2000
});
```

### Adding New Components

1. **Create Component File** (`src/components/YourComponent.jsx`):

```jsx
export const YourComponent = ({ title, ...props }) => {
  return (
    <div className="your-component">
      <h3>{title}</h3>
      {/* Your component JSX */}
    </div>
  );
};
```

2. **Register in Component Map** (`src/App.jsx`):

```javascript
const componentMap = {
  // ... existing components
  yourcomponent: YourComponent
};
```

3. **Update AI Prompt** (`backend/server.js`):

```javascript
const systemPrompt = `
Available components:
- navbar, sidebar, card, button, input, modal, table, chart, yourcomponent
...
`;
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Empty prompt handling
- [ ] Complex nested layouts
- [ ] Rollback functionality
- [ ] AI fallback mechanism
- [ ] Component rendering
- [ ] Code generation accuracy

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm run test
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Server Connection Failed**
```bash
Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Solution:** Ensure backend server is running on port 5000

#### 2. **OpenAI API Error**
```bash
Error: Invalid API key
```
**Solution:** Check `.env` file and verify API key is correct

#### 3. **Component Not Rendering**
**Solution:** Check browser console for errors and verify component is registered

#### 4. **Rollback Not Working**
**Solution:** Ensure history array is properly maintained in state

### Debug Mode

Enable detailed logging:

```javascript
// backend/server.js
const DEBUG = true;

if (DEBUG) {
  console.log('Request:', req.body);
  console.log('AI Response:', aiResponse);
}
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

```bash
# Build backend
cd backend
npm install --production

# Set environment variables on platform
OPENAI_API_KEY=your-key
PORT=5000
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build frontend
npm run build

# Deploy dist/ folder
# Update API endpoint in src/App.jsx
const API_URL = 'https://your-backend.railway.app';
```

---

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Core AI UI generation
- [x] Basic component library
- [x] Version history
- [x] Rollback system

### Phase 2 (In Progress)
- [ ] Drag-and-drop editor
- [ ] Component property editor
- [ ] Export to React project
- [ ] Theme customization

### Phase 3 (Planned)
- [ ] Supabase integration
- [ ] Multi-page layouts
- [ ] Collaborative editing
- [ ] Component marketplace

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Code Style Guidelines
- Use ES6+ syntax
- Follow Airbnb style guide
- Add JSDoc comments for functions
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mounika**

- GitHub: [@your-github](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) - AI model provider
- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Express](https://expressjs.com/) - Backend framework

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/your-username/ai-ui-generator?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/ai-ui-generator?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/ai-ui-generator)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/ai-ui-generator)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Mounika

</div>