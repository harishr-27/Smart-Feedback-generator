# Technical Report: Smart Feedback Generator

## 1. System Architecture
The application follows a client-server architecture with a clear separation of concerns:
- **Client (Frontend)**: A React-based Single Page Application (SPA) responsible for user interactions, authentication state, and rendering feedback.
- **API (Backend)**: A FastAPI application that serves as the core orchestration layer handling authentication, business logic, file processing, and AI integration.
- **Database**: MongoDB serves as the persistent storage layer for users, rubrics, assignments, submissions, and feedback results.

## 2. Artificial Intelligence Pipeline (RAG & LLM)
The core value proposition of the system is the AI feedback generation.
1. **Ingestion**: Teachers upload reference materials (`.txt`, `.md`, `.pdf`). The backend extracts text and chunks it for the RAG service.
2. **Retrieval**: When a student submits an assignment, the system queries the RAG service to pull relevant context from the reference materials based on the student's text.
3. **Generation**: The `FeedbackService` constructs a prompt containing the Rubric, the Reference Context, and the Student's Submission. This is sent to an LLM (e.g., OpenAI GPT-4) to generate structured JSON containing scores, strengths, weaknesses, and a detailed breakdown.
4. **Fallback**: If the LLM service is unavailable, the system defaults to a keyword-matching algorithm to provide baseline grading without failing completely.

## 3. Database Schema Design
We utilize **Beanie**, an asynchronous ODM for MongoDB. Key collections include:
- `users`: Stores email, hashed passwords, names, and roles (`teacher` vs `student`).
- `assignments`: Links to a specific `rubric_id` and an array of `reference_material_ids`.
- `rubrics`: Contains a nested array of criteria (name, max points, description).
- `submissions`: Records the text content of the uploaded file and links to the `student_id` and `assignment_id`.
- `feedbacks`: Stores the generated JSON payload from the AI pipeline, linking to the `submission_id`.

## 4. Robustness & Error Handling
To ensure a production-ready application:
- **Global API Catch-All**: FastAPI implements a global `@app.exception_handler` to catch unhandled errors and prevent server crashes, returning a standard 500 JSON response.
- **Frontend Graceful Degradation**: Network requests in React are wrapped in `try-catch` blocks. Failures render a floating error toast (`AlertCircle`) instead of native browser prompts.
- **UX Feedback**: Asynchronous AI tasks trigger full-screen, un-dismissible loading overlays with determinate/indeterminate progress bars to prevent users from navigating away or double-submitting.

## 5. Deployment Strategy
- **Frontend (Vercel)**: Utilizing `vercel.json` for SPA routing configuration. Vercel automatically detects the Vite build command and serves the static assets globally via CDN.
- **Backend (Render)**: The `render.yaml` file configures the FastAPI application as a Web Service. It handles Python environment setup, dependency installation, and binds the application to the provided `$PORT` using Uvicorn. Environment variables (like `OPENAI_API_KEY` and `MONGO_URI`) are securely injected during runtime.
