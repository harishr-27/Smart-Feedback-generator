# Smart Feedback Generator

> An intelligent, centralized platform for automated academic feedback and grading.

![Screenshot Generation](https://via.placeholder.com/800x400?text=App+Screenshot)

## 📖 Overview

The Smart Feedback Generator is a full-stack application designed to assist educators in grading assignments and providing rich, actionable feedback to students using AI. It features role-based access control, a robust assignment management system, and an integrated grading algorithm that handles both AI-powered and keyword-fallback scoring.

### ✨ Key Features

- **Role-Based Workspaces**: Distinct dashboards for Students (submission & feedback viewing) and Teachers (rubric creation, assignment tracking).
- **Intelligent Feedback Pipeline**: Utilizes Large Language Models (LLMs) enriched by Retrieval-Augmented Generation (RAG) to evaluate student work against specific rubrics and reference materials.
- **Robust Error Handling**: Graceful degradation pathways, comprehensive API exception handling, and polished loading states to ensure a smooth user experience.
- **Modern UI/UX**: Built with React and Tailwind CSS for a responsive, accessible, and user-friendly interface.

## 🛠️ Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS
- Lucide React (Icons)

**Backend**
- Python 3.9+
- FastAPI
- MongoDB (via Beanie ODM)
- JWT Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB instance (local or Atlas)

### Local Setup

1. **Clone the repository** and install dependencies for both frontend and backend.
2. **Setup Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🌍 Production Deployment

This project is configured for cloud deployment:
- **Frontend**: Configured for Vercel using `vercel.json` to handle React Router SPA fallbacks.
- **Backend**: Configured for Render using `render.yaml`. Connect your GitHub repository to Render and it will automatically deploy the FastAPI application.

## 📄 Technical Report

For a deep dive into the system architecture, database schema, and the AI feedback pipeline, please refer to the [TECHNICAL_REPORT.md](TECHNICAL_REPORT.md).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---
*Developed as part of the advanced AI engineering curriculum.*
