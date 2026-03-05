import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function SubmissionForm({ onSubmit, isLoading }) {
    const [studentId, setStudentId] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            onSubmit({ file });
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Ready to share your work?</h2>
            <form onSubmit={handleSubmit} className="space-y-6">



                <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                        <Upload className="w-10 h-10 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-slate-500 font-medium">
                            {file ? <span className="text-blue-600 font-semibold">{file.name}</span> : "Upload your document to get instant feedback"}
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!file || isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-sm hover:shadow-md"
                >
                    {isLoading ? 'Analyzing...' : 'Get Feedback'}
                </button>
            </form>
        </div>
    );

}
