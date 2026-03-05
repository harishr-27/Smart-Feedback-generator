import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Table } from 'lucide-react';

export default function DatabaseView() {
    const [activeTab, setActiveTab] = useState('assignments');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const endpoints = {
        assignments: 'http://localhost:8000/assignments/',
        submissions: 'http://localhost:8000/submissions/',
        feedbacks: 'http://localhost:8000/feedbacks/',
        rubrics: 'http://localhost:8000/rubrics/' // Assuming this endpoint exists or will create it
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(endpoints[activeTab]);
            if (res.ok) {
                const jsonData = await res.json();
                console.log(`Fetched ${activeTab}:`, jsonData);
                setData(jsonData);
            } else {
                console.error("Failed to fetch");
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const renderTable = () => {
        if (!data || data.length === 0) return <div className="text-slate-500 italic p-4">No records found.</div>;

        // Get headers from first object
        const headers = Object.keys(data[0]);

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {headers.map(h => (
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                {headers.map(h => (
                                    <td key={h} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 max-w-xs truncate">
                                        {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <Database className="w-6 h-6 mr-2 text-blue-600" /> Database Viewer
                </h2>
                <button
                    onClick={fetchData}
                    className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-slate-200">
                {Object.keys(endpoints).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-slate-50/50 rounded-lg border border-slate-200 min-h-[200px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40 text-slate-400">Loading...</div>
                ) : renderTable()}
            </div>
        </div>
    );
}
