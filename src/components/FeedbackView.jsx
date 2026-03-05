import React from 'react';
import { CheckCircle, AlertCircle, BookOpen } from 'lucide-react';

export default function FeedbackView({ feedback, onReset }) {
    if (!feedback) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Header Summary */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">Here are your insights</h2>
                    <div className="bg-blue-50 px-6 py-3 rounded-xl flex items-center space-x-2">
                        <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Grade</span>
                        <span className="text-3xl font-bold text-blue-900">{feedback.total_score}</span>
                        <span className="text-blue-400 text-lg">/{feedback.max_score}</span>
                    </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{feedback.general_summary}</p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Strengths & Weaknesses */}
                <div className="space-y-6">
                    <div className="bg-green-50 p-8 rounded-xl border border-green-100">
                        <h3 className="flex items-center text-green-900 font-bold mb-4 text-lg">
                            <CheckCircle className="w-6 h-6 mr-3 text-green-600" /> What you did well
                        </h3>
                        <ul className="space-y-3">
                            {feedback.strengths.map((s, i) => (
                                <li key={i} className="flex items-start text-green-800">
                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-xl border border-amber-100">
                        <h3 className="flex items-center text-amber-900 font-bold mb-4 text-lg">
                            <AlertCircle className="w-6 h-6 mr-3 text-amber-600" /> Things to work on
                        </h3>
                        <ul className="space-y-3">
                            {feedback.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start text-amber-800">
                                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Detailed Criteria */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6 text-slate-800">Breakdown</h3>
                    <div className="space-y-6">
                        {feedback.criteria_feedback.map((criterion) => (
                            <div key={criterion.criterion_id} className="border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-slate-700 text-lg">{criterion.name}</span>
                                    <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{criterion.score}/{criterion.max_points}</span>
                                </div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2 inline-block">
                                    {criterion.level_achieved}
                                </div>
                                <p className="text-slate-600 leading-relaxed">{criterion.reasoning}</p>
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
