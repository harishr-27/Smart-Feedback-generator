import React, { useState } from 'react';
import SubmissionForm from './components/SubmissionForm';
import FeedbackView from './components/FeedbackView';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Login from './components/Login';
import { GraduationCap, BookOpen, User, LogOut, Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
    const [user, setUser] = useState(null); // { access_token, role, name, user_id }
    const [currentView, setCurrentView] = useState('student'); // 'student' | 'instructor' | 'feedback'
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [feedbackData, setFeedbackData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);

    const showError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(null), 5000);
    };

    const handleLogout = () => {
        setUser(null);
        setFeedbackData(null);
    };

    // Fetch assignments when view changes (or on login)
    React.useEffect(() => {
        if (!user) return; // Don't fetch if not logged in

        const fetchAssignments = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/assignments/`);
                if (!res.ok) throw new Error("Failed to load assignments.");
                const data = await res.json();
                setAssignments(data);
                if (data.length > 0 && !selectedAssignmentId) {
                    setSelectedAssignmentId(data[data.length - 1]._id || data[data.length - 1].id);
                }
            } catch (err) {
                console.error("Failed to fetch assignments", err);
                showError("Could not connect to server. Please try again.");
            }
        };
        fetchAssignments();
    }, [currentView, user, selectedAssignmentId]); // Added selectedAssignmentId to dep array to satisfy linter if needed,/logic

    // --- Authentication Handler ---
    if (!user) {
        return <Login onLogin={(userData) => {
            setUser(userData);
            // Default view based on role
            setCurrentView(userData.role === 'teacher' ? 'instructor' : 'student');
        }} />;
    }

    // --- Student Submission Logic ---
    const handleSubmission = async ({ studentId, file, assignmentId }) => {
        const targetAssignmentId = assignmentId || selectedAssignmentId;

        if (!targetAssignmentId) {
            showError("Please select an assignment first.");
            return;
        }
        setIsLoading(true);
        setLoadingMessage('Uploading submission...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const actualStudentId = user.role === 'student' ? user.email : studentId;

            const response = await fetch(`${API_BASE_URL}/submissions/${targetAssignmentId}?student_id=${actualStudentId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${user.access_token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Submission failed: ${response.statusText}`);
            }

            const submission = await response.json();
            console.log("Submission received:", submission);

            // Poll for Feedback
            setLoadingMessage('AI is analyzing your work. This may take a moment...');
            let attempts = 0;
            const maxAttempts = 30;
            const pollInterval = 2000;

            const pollFeedback = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/feedbacks/`);
                    const feedbacks = await res.json();

                    // Filter feedback for THIS submission
                    const found = feedbacks.find(f => f.submission_id === (submission._id || submission.id));

                    if (found) {
                        setFeedbackData(found);
                        setCurrentView('feedback');
                        setIsLoading(false);
                    } else if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(pollFeedback, pollInterval);
                    } else {
                        setIsLoading(false);
                        showError("Feedback is taking longer than expected. Please check your dashboard later.");
                    }
                } catch (e) {
                    console.error("Polling error", e);
                    setIsLoading(false);
                    showError("Connection lost while waiting for feedback.");
                }
            };

            pollFeedback();

        } catch (error) {
            console.error("Submission error:", error);
            setIsLoading(false);
            showError("Error submitting assignment. Ensure backend is running.");
        }
    };

    console.log("App Render:", { user, currentView });

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Processing</h3>
                        <p className="text-slate-500 mt-2">{loadingMessage || 'Please wait...'}</p>

                        {/* Progress Bar (Indeterminate) */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '50%', transformOrigin: 'left' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {errorMsg && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
                    <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{errorMsg}</span>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/80 transition-all">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
                            AI
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 text-xl tracking-tight">Smart Feedback</h1>
                            <p className="text-xs text-slate-400 font-medium">Welcome, {user.name} ({user.role})</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                            {/* Student View Button */}
                            {user.role === 'student' && (
                                <button
                                    onClick={() => setCurrentView('student')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'student' || currentView === 'feedback' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <span className="flex items-center"><User className="w-4 h-4 mr-2" /> Grading</span>
                                </button>
                            )}

                            {/* Teacher View Button */}
                            {user.role === 'teacher' && (
                                <button
                                    onClick={() => setCurrentView('instructor')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'instructor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <span className="flex items-center"><GraduationCap className="w-4 h-4 mr-2" /> Admin</span>
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-red-500 transition-colors p-2"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-10">
                {/* DEBUG INFO */}
                {/* <div className="text-white">Debug: Role={user.role}, View={currentView}</div> */}

                {currentView === 'student' && user.role === 'student' && (
                    <StudentDashboard
                        user={user}
                        assignments={assignments}
                        onSubmission={async (data) => {
                            // data contains file, (maybe studentId if form sent it, but we override), assignmentId (if passed up)
                            // We need to ensure we use the selectedAssignmentId from the DASHBOARD if passed, or the state here
                            // Actually, StudentDashboard manages selectedAssignmentId internally now for the 'new' tab.
                            // Wait, StudentDashboard passes {studentId, file, assignmentId} up?
                            // Let's modify handleSubmission to accept assignmentId
                            await handleSubmission({ ...data, studentId: user.email });
                        }}
                        onSelectFeedback={(feedback) => {
                            setFeedbackData(feedback);
                            setCurrentView('feedback');
                        }}
                    />
                )}

                {currentView === 'instructor' && user.role === 'teacher' && (
                    <div className="animate-in fade-in duration-500">
                        <TeacherDashboard
                            user={user}
                            onAssignmentCreated={(assignment) => {
                                console.log("Assignment Created:", assignment);
                            }}
                        />
                    </div>
                )}

                {currentView === 'feedback' && (
                    <div className="animate-in fade-in duration-500">
                        <button
                            onClick={() => setCurrentView('student')}
                            className="mb-6 flex items-center text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            ← Back to Submission
                        </button>
                        <FeedbackView
                            feedback={feedbackData}
                            onReset={() => {
                                setFeedbackData(null);
                                setCurrentView('student');
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
