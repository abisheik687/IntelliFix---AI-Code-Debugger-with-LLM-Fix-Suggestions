# **App Name**: IntelliFix – AI Code Debugger with LLM Fix Suggestions

## Core Features:

- Code Input & Error Visualization: Monaco Editor (VS Code in-browser) with syntax highlighting, linting, real-time error markers, drag-and-drop + file upload, auto language detection, light/dark themes, and support for Python, JavaScript, Java, Go, TypeScript, and C++.
- Error Explanation with AI: FastAPI API layer using GPT-4 Turbo / GPT-4o to parse error traces and code snippets, providing explanations, root causes, and links to relevant documentation.
- Automated Fix Suggestions: LLM Prompt Chain (System prompt + Code + Error + Fix Instructions) to generate inline diffs with one-click apply, rollback support, and file/block selection.
- View Diff and Explanation: Git-style inline diff viewer with Before/After/Diff toggles and tooltips explaining changed lines.
- Language-Specific Plugins: Language-specific plugins for Python, JavaScript, and Java, with plugin support for Rust, C++, Go, and TS using a modular parser layer.
- User Dashboard: User dashboard with Error History, Fix Accuracy Tracker, and Error Heatmap, built using Recharts/Chart.js + React.
- Authentication & Role Management: Firebase Auth (Google, GitHub OAuth) for authentication with JWT session handling, RBAC (Free | Contributor | Admin), and optional API key management for enterprise users.
- AI Pair Programming Agent: GPT-4o + Typing Awareness AI Pair Programming Agent in Chat/Code Assist modes, offering auto-commenting with tone selection, predictive typing, and memory of coding style and prompt context.
- Auto-Reproducible Error Sandbox (Trace Replayer): Auto-Reproducible Error Sandbox (Trace Replayer) with containerized runtime (Docker + Sandboxed VMs), timeline playback of code execution, and export tool (Dockerfile + Requirements.txt) with a “Reproduce Locally” button.
- Agentic LLM Architecture: Agentic LLM Architecture with LangGraph / CrewAI / AutoGen orchestrator and agents like Fixer, Explainer, Tester, and Auditor for applying changes, describing logic & errors, auto-generating test cases, and checking hallucinations & quality.
- Code Repair via Git Patch Rewriter: Code Repair via Git Patch Rewriter with GitHub Bot Integration for auto PR creation, smart diff descriptions, and revert/apply partially options, along with a CLI tool (intellifix commit --fix-all).
- Semantic Codebase Memory: Semantic Codebase Memory using ChromaDB / Weaviate / Qdrant to index the full repo into embeddings, enabling context-aware fixes and tracing links across functions, files, and imports.
- Promptless Debugging: Promptless Debugging with no input mode, allowing users to upload and click “Fix”, letting the backend parse, build custom prompts, and auto-fix, perfect for junior developers or quick bugfixes.
- Unit Test Generator with Coverage Report: Unit Test Generator with Coverage Report that auto-generates test suites, integrates with pytest, mocha, junit, highlights coverage changes after fix, and provides pre/post fix heatmap and test case diffs.
- Intent Detection in Errors: Intent Detection in Errors using a hybrid LLM + ML classifier to identify error types (Syntax | Semantic | Logic | API misuse) for custom analytics dashboards and model tuning.
- Cross-Language Code Converter: Cross-Language Code Converter supporting Python ⇌ JS ⇌ Java ⇌ Go with semantic equivalence testing and auto-validation via LLM.
- Multiplayer Mode / Shared Debug Session: Multiplayer Mode / Shared Debug Session with live debug collaboration, real-time editor sync, shared error trace viewer, chat + annotation tools, inspired by Google Docs + GitHub Copilot Chat.

## Style Guidelines:

- Primary: #72B2F2 (Saturated Sky Blue)
- Accent: #9A72F2 (Vibrant Purple)
- Background: #E8F3FF (Desaturated Sky Blue)
- UI Font: Inter (Body + Headers)
- Code Font: Source Code Pro (Snippets + Editor)
- Pack: Feather Icons / Lucide
- Style: Minimalist, Outline
- Tools: Framer Motion + Tailwind Transitions
- Effects: Error pulse on code, Fade-in fixes, Smooth chart transitions, Hover-driven tooltip popups