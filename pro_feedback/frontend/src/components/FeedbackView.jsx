import React from 'react';
import { CheckCircle, AlertCircle, BookOpen } from 'lucide-react';

export default function FeedbackView({ feedback, onReset }) {
    if (!feedback) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Feedback Result</h2>
                    <div className="bg-slate-100 px-4 py-2 rounded-full">
                        <span className="text-sm font-semibold text-slate-600">Score: </span>
                        <span className="text-2xl font-bold text-primary">{feedback.total_score}</span>
                        <span className="text-slate-500">/{feedback.max_score}</span>
                    </div>
                </div>
                <p className="text-slate-700 leading-relaxed">{feedback.general_summary}</p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Strengths & Weaknesses */}
                <div className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                        <h3 className="flex items-center text-green-800 font-bold mb-3">
                            <CheckCircle className="w-5 h-5 mr-2" /> Strengths
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-green-800">
                            {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                        <h3 className="flex items-center text-amber-800 font-bold mb-3">
                            <AlertCircle className="w-5 h-5 mr-2" /> Areas for Improvement
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-amber-800">
                            {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                </div>

                {/* Detailed Criteria */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold mb-4 text-slate-800">Detailed Grading</h3>
                    <div className="space-y-4">
                        {feedback.criteria_feedback.map((criterion) => (
                            <div key={criterion.criterion_id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold text-slate-700">{criterion.name}</span>
                                    <span className="text-sm font-bold text-slate-500">{criterion.score}/{criterion.max_points}</span>
                                </div>
                                <div className="text-xs text-primary mb-2 font-medium bg-blue-50 inline-block px-2 py-0.5 rounded">
                                    {criterion.level_achieved}
                                </div>
                                <p className="text-sm text-slate-600">{criterion.reasoning}</p>
                                {criterion.evidence_quotes.length > 0 && (
                                    <div className="mt-2 text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                                        "{criterion.evidence_quotes[0]}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center pt-8">
                <button
                    onClick={onReset}
                    className="bg-secondary text-white py-2 px-6 rounded-full hover:bg-slate-700 transition-colors"
                >
                    Grade Another Submission
                </button>
            </div>

        </div>
    );
}
