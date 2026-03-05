import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Plus } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TeacherDashboard({ onAssignmentCreated, user }) {
    const [title, setTitle] = useState('');
    const [referenceFile, setReferenceFile] = useState(null);
    const [rubricName, setRubricName] = useState('Standard Rubric');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const [submissions, setSubmissions] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]); // ...

    const [assignments, setAssignments] = useState([]);

    // Load Data on Mount
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Submissions
                const subRes = await fetch(`${API_BASE_URL}/submissions/`);
                const subs = await subRes.json();
                setSubmissions(subs);

                // Fetch Feedbacks
                const feedRes = await fetch(`${API_BASE_URL}/feedbacks/`);
                const feeds = await feedRes.json();
                setFeedbacks(feeds);

                // Fetch Assignments
                const assignRes = await fetch(`${API_BASE_URL}/assignments/`);
                const assigns = await assignRes.json();
                setAssignments(assigns);

            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const getScore = (submissionId) => {
        const fb = feedbacks.find(f => f.submission_id === submissionId);
        return fb ? `${fb.total_score}/${fb.max_score}` : 'Pending';
    };

    const getAssignmentTitle = (assignmentId) => {
        const a = assignments.find(a => (a._id || a.id) === assignmentId);
        return a ? a.title : "Unknown Topic";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            // 1. Create Rubric (Mock for now, or real API)
            const rubricRes = await fetch(`${API_BASE_URL}/rubrics/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.access_token}`
                },
                body: JSON.stringify({
                    name: rubricName,
                    criteria: [
                        { name: "Thesis", max_points: 20, description: "Clarity of argument", levels: [] },
                        { name: "Evidence", max_points: 40, description: "Use of sources", levels: [] },
                        { name: "Mechanics", max_points: 40, description: "Grammar and style", levels: [] }
                    ]
                })
            });
            if (!rubricRes.ok) throw new Error("Failed to create rubric");
            const rubric = await rubricRes.json();

            // 2. Create Assignment
            const assignRes = await fetch(`${API_BASE_URL}/assignments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.access_token}`
                },
                body: JSON.stringify({
                    title: title,
                    rubric_id: rubric._id || rubric.id,
                    teacher_id: user.id // Optional: link to teacher
                })
            });
            const assignment = await assignRes.json();

            // Normalize ID
            const assignmentId = assignment._id || assignment.id;

            // 3. Upload Reference Material (if provided)
            if (referenceFile) {
                const formData = new FormData();
                formData.append('file', referenceFile);
                await fetch(`${API_BASE_URL}/reference-materials/${assignmentId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.access_token}`
                    },
                    body: formData
                });
            }

            setMessage({ type: 'success', text: `Assignment "${assignment.title}" created successfully!` });
            setTitle('');
            setReferenceFile(null);
            if (onAssignmentCreated) onAssignmentCreated(assignment);

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to create assignment. Ensure backend is running.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800">Classroom Workspace</h2>
                <p className="text-slate-500">Manage topics and track student progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Assignment Form */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                        Add New Topic
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Assignment Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Topic Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. History of Rome"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300 transition-all text-slate-900"
                                required
                            />
                        </div>

                        {/* Reference Key Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Model Answer / Key <span className="text-slate-400 font-normal"></span>
                            </label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                                <input
                                    type="file"
                                    id="ref-upload"
                                    className="hidden"
                                    onChange={(e) => setReferenceFile(e.target.files[0])}
                                />
                                <label htmlFor="ref-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                                    <FileText className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm text-slate-500 font-medium truncate max-w-[200px]">
                                        {referenceFile ? <span className="text-blue-600 font-semibold">{referenceFile.name}</span> : "Upload Key (Txt/Md)"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !title}
                            className="w-full bg-slate-800 text-white py-3 px-6 rounded-lg hover:bg-slate-900 disabled:opacity-50 transition-all font-medium shadow-sm hover:shadow-md"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Topic'}
                        </button>

                        {/* Status Message */}
                        {message && (
                            <div className={`p-3 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                    </form>
                </div>

                {/* Recent Submissions List */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-blue-500" /> Latest Student Activity
                    </h3>

                    <div className="flex-1 overflow-auto max-h-[400px]">
                        {submissions.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-slate-400 italic mb-2">No activity yet.</p>
                                <p className="text-xs text-slate-300">Share the topic title with students to get started.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {submissions.slice().reverse().map(sub => (
                                    <div key={sub._id || sub.id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-slate-700">{sub.student_id}</span>
                                            <span className={`text-sm font-bold ${getScore(sub._id || sub.id) === 'Pending' ? 'text-slate-400' : 'text-blue-600'}`}>
                                                {getScore(sub._id || sub.id)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 flex justify-between">
                                            <span>{getAssignmentTitle(sub.assignment_id)}</span>
                                            <span>{new Date(sub.submission_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
