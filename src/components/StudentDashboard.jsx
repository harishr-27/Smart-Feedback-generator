import React, { useState, useEffect } from 'react';
import SubmissionForm from './SubmissionForm';
import FeedbackView from './FeedbackView';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function StudentDashboard({ user, assignments, onSubmission, onSelectFeedback }) {
    const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
    const [mySubmissions, setMySubmissions] = useState([]);
    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState("");

    // Set default assignment
    useEffect(() => {
        if (assignments.length > 0 && !selectedAssignmentId) {
            setSelectedAssignmentId(assignments[assignments.length - 1]._id || assignments[assignments.length - 1].id);
        }
    }, [assignments]);

    // Fetch History
    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            // Fetch all submissions and filter by current user's email/id
            // In a real app, the API should handle this filter
            const subRes = await fetch(`${API_BASE_URL}/submissions/`);
            const allSubs = await subRes.json();
            const mySubs = allSubs.filter(s => s.student_id === user.email);

            setMySubmissions(mySubs);

            // Fetch feedbacks
            const feedRes = await fetch(`${API_BASE_URL}/feedbacks/`);
            const allFeeds = await feedRes.json();

            // Map feedbacks to submissions
            const myFeeds = allFeeds.filter(f => mySubs.some(s => (s._id || s.id) === f.submission_id));
            setMyFeedbacks(myFeeds);

        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const getFeedbackStatus = (submissionId) => {
        const feedback = myFeedbacks.find(f => f.submission_id === submissionId);
        if (feedback) return { label: "Graded", color: "text-green-600 bg-green-50", feedback };
        return { label: "Pending", color: "text-yellow-600 bg-yellow-50", feedback: null };
    };

    const getAssignmentTitle = (id) => {
        const a = assignments.find(a => (a._id || a.id) === id);
        return a ? a.title : "Unknown Assignment";
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'new' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    New Submission
                    {activeTab === 'new' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    My History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
            </div>

            {/* New Submission View */}
            {activeTab === 'new' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Your Personal Writing Coach</h2>
                        <p className="text-slate-500 mb-8">
                            Share your draft and get instant, actionable feedback.
                        </p>

                        <div className="w-full max-w-sm mx-auto mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <label className="block text-sm font-semibold text-slate-600 mb-2 text-left">Choose Topic</label>
                            <select
                                className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={selectedAssignmentId}
                                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                            >
                                {assignments.map(a => (
                                    <option key={a._id || a.id} value={a._id || a.id}>{a.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <SubmissionForm
                        onSubmit={(data) => {
                            // Inject the selected assignment ID if not present
                            if (!selectedAssignmentId) {
                                alert("Please select an assignment first.");
                                return;
                            }
                            // Pass up to App.jsx
                            onSubmission({ ...data, assignmentId: selectedAssignmentId });
                        }}
                        isLoading={false} // Loading handled by parent or form internal
                    />
                </div>
            )}

            {/* History View */}
            {activeTab === 'history' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-500" /> Submission History
                    </h3>

                    {loadingHistory ? (
                        <div className="text-center py-12 text-slate-400">Loading history...</div>
                    ) : mySubmissions.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No submissions yet.</p>
                            <button onClick={() => setActiveTab('new')} className="text-blue-600 hover:underline text-sm mt-2">Start your first assignment</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mySubmissions.slice().reverse().map(sub => {
                                const status = getFeedbackStatus(sub._id || sub.id);
                                return (
                                    <div key={sub._id || sub.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-semibold text-slate-800 text-lg mb-1">{getAssignmentTitle(sub.assignment_id)}</h4>
                                            <div className="flex items-center text-sm text-slate-500 space-x-4">
                                                <span>{new Date(sub.submission_date).toLocaleDateString()}</span>
                                                <span className="flex items-center">
                                                    <FileText className="w-3 h-3 mr-1" /> {sub.filename}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.color}`}>
                                                {status.label}
                                            </span>

                                            {status.feedback && (
                                                <button
                                                    onClick={() => onSelectFeedback(status.feedback)}
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                                >
                                                    View Feedback
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
