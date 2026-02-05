# Smart Feedback Generator

This project is a centralized platform for academic feedback generation using AI.

## Project Structure

*   `backend/`: Python FastAPI application handling logic, RAG, and AI generation.
*   `frontend/`: React + Vite application for the user interface.

## Prerequisites

*   [Python 3.9+](https://www.python.org/downloads/)
*   [Node.js 18+](https://nodejs.org/)

---

## 🚀 How to Run

### 1. Start the Backend (API)

The backend runs on `http://localhost:8000`.

1.  Open a terminal and navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    python -m uvicorn main:app --reload
    ```

### 2. Start the Frontend (UI)

The frontend runs on `http://localhost:5173`.

1.  Open a **new** terminal and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## 🧪 Testing the App

1.  Open your browser to `http://localhost:5173`.
2.  You will see the **"Evaluate Assignments"** screen.
3.  Enter a mock Student ID (e.g., `student_01`).
4.  Upload any text file (PDF/Docx support is mocked, so you can upload a dummy `.txt` file with an essay inside).
5.  Click **"Generate Feedback"**.
6.  Wait ~2 seconds for the mock AI processing to complete.
7.  View the detailed feedback dashboard.

## ⚠️ Notes for Prototype

*   **Mocked AI:** To run without an expensive OpenAI API key, the `LLMClient` in `backend/feedback_service.py` returns mock JSON data by default.
*   **Mocked Database:** All data is stored in-memory and will reset when you restart the backend server.
