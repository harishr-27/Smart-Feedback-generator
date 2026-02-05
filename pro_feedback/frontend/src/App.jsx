import React, { useState } from 'react';
import SubmissionForm from './components/SubmissionForm';
import FeedbackView from './components/FeedbackView';

function App() {
    const [currentView, setCurrentView] = useState('submission'); // 'submission' | 'feedback'
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackData, setFeedbackData] = useState(null);

    const handleSubmission = async ({ studentId, file }) => {
        setIsLoading(true);

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Mock API Call - Replace with real fetch() in production
        // const response = await fetch(`/api/submissions/${assignmentId}?student_id=${studentId}`, { ... })

        // Simulating network delay
        setTimeout(() => {
            // Mock Data (matches backend schema)
            const mockResponse = {
                submission_id: "sub_mock_001",
                total_score: 88,
                max_score: 100,
                general_summary: "This is a strong submission that demonstrates a good grasp of the core concepts. The historical analysis is particularly well-researched. However, the conclusion feels rushed and doesn't fully synthesize the arguments made in the body paragraphs.",
                strengths: [
                    "Excellent use of primary sources",
                    "Clear structure and flow",
                    "Proper citation formatting"
                ],
                weaknesses: [
                    "Conclusion lacks depth",
                    "Some minor grammatical errors in the second section"
                ],
                criteria_feedback: [
                    {
                        criterion_id: "c1",
                        name: "Thesis Statement",
                        score: 18,
                        max_points: 20,
                        level_achieved: "Proficient",
                        reasoning: "Thesis is clear and visible in the intro, but could be specific about the 'economic factors' mentioned.",
                        evidence_quotes: ["The economic turmoil of 1929 was primarily driven by..."]
                    },
                    {
                        criterion_id: "c2",
                        name: "Evidence & Analysis",
                        score: 35,
                        max_points: 40,
                        level_achieved: "Advanced",
                        reasoning: "Excellent integration of the assigned reading materials to support your claims.",
                        evidence_quotes: ["As Smith (2020) notes, 'market corrections are inevitable...'"]
                    },
                    {
                        criterion_id: "c3",
                        name: "Mechanics",
                        score: 35,
                        max_points: 40,
                        level_achieved: "Proficient",
                        reasoning: "Mostly error-free, but watch out for run-on sentences.",
                        evidence_quotes: []
                    }
                ]
            };

            setFeedbackData(mockResponse);
            setCurrentView('feedback');
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Navbar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                            AI
                        </div>
                        <h1 className="font-bold text-slate-800 text-lg">Smart Grader <span className="text-slate-400 font-normal">| Instructor View</span></h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">

                {currentView === 'submission' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Evaluate Assignments</h2>
                            <p className="text-slate-500">Upload a student submission to generate instant AI-powered feedback based on the rubric.</p>
                        </div>
                        <div className="w-full">
                            <SubmissionForm onSubmit={handleSubmission} isLoading={isLoading} />
                        </div>
                    </div>
                )}

                {currentView === 'feedback' && (
                    <FeedbackView
                        feedback={feedbackData}
                        onReset={() => {
                            setFeedbackData(null);
                            setCurrentView('submission');
                        }}
                    />
                )}

            </main>
        </div>
    );
}

export default App;
