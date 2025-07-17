# CodeCraft Frontend

CodeCraft is an AI-powered website builder that allows users to generate, preview, and explore modern web projects with ease. This frontend is built with React, TypeScript, Vite, and Tailwind CSS, providing a fast, interactive, and visually appealing user experience. The application communicates with an AI-driven backend to transform user prompts into complete, ready-to-run web projects.

## Features

- **AI Website Generation:** Enter a prompt describing your desired website, and let the AI generate a full project structure, including code files and build steps.
- **Step-by-Step Build Process:** Visualize and track the progress of project generation through an interactive steps list.
- **File Explorer & Code Viewer:** Browse the generated project files and view their contents with syntax highlighting.
- **Live Preview:** Instantly preview the running website in a secure, isolated environment using WebContainer technology.
- **Modern UI:** Responsive, accessible, and visually engaging interface built with Tailwind CSS and Lucide icons.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and build
- **Tailwind CSS** for styling
- **@webcontainer/api** for in-browser Node.js environments and live previews
- **Monaco Editor** for code viewing
- **Axios** for API communication
- **Lucide React** for icons

## Project Structure

- `src/pages/` — Main pages (Home, Builder)
- `src/components/` — Reusable UI components (CodeEditor, FileExplorer, PreviewFrame, etc.)
- `src/hooks/` — Custom React hooks (e.g., useWebContainer)
- `src/types/` — TypeScript type definitions
- `src/steps.ts` — XML parsing and step extraction logic
- `src/config.ts` — API endpoint configuration

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open [http://localhost:5173](http://localhost:5173) in your browser.**

> **Note:** This frontend requires the backend server to be running. The backend repository is available at:
> [https://github.com/Nafiziqbal-Perdita/Code_Craft_server.git](https://github.com/Nafiziqbal-Perdita/Code_Craft_server.git)

## License

This project is licensed under the MIT License.
