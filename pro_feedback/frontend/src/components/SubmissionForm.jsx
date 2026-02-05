import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function SubmissionForm({ onSubmit, isLoading }) {
    const [studentId, setStudentId] = useState('student_123');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file && studentId) {
            onSubmit({ studentId, file });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Submit Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-600 font-medium">
                            {file ? file.name : "Click to upload submission (PDF/Docx)"}
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!file || isLoading}
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isLoading ? 'Analyzing...' : 'Generate Feedback'}
                </button>
            </form>
        </div>
    );
}
