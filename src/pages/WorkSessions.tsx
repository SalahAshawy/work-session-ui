import { useState, useEffect } from 'react';

const API_URL = 'https://checkin-system-9dwb.vercel.app/work-sessions';

interface WorkSession {
    id: string;
    title: string;
    type: 'daily' | 'monthly';
    daysPerWeek: number;
    hoursPerDay: number;
    startDate?: string;
}

const WorkSessions = () => {
    const [sessions, setSessions] = useState<WorkSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [form, setForm] = useState({
        title: '',
        type: 'monthly',
        daysPerWeek: 5,
        hoursPerDay: 8,
        startDate: '',
    });

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setSessions(data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.title.trim()) newErrors.title = 'Title is required';
        if (!form.type) newErrors.type = 'Type is required';
        if (!form.daysPerWeek) newErrors.daysPerWeek = 'Days per week is required';
        if (!form.hoursPerDay) newErrors.hoursPerDay = 'Hours per day is required';
        if (!form.startDate) newErrors.startDate = 'Start date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddSession = async () => {
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...form,
                    startDate: new Date(form.startDate).toISOString(),
                   
                })
            });

            const data = await res.json();
            setSessions((prev) => [...prev, data]);
            setIsModalOpen(false);
            setForm({ title: '', type: 'monthly', daysPerWeek: 5, hoursPerDay: 8, startDate: '' });
            setErrors({});
        } catch (err) {
            console.error('Error adding session:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-lg text-gray-300">Loading sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1e3a8a] via-[#9333ea] to-[#111827] opacity-30 animate-pulse z-0"></div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
                <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce opacity-25"></div>
            </div>

            <div className="relative z-10 px-4 pt-10 pb-20 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 space-y-4">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Work Sessions
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Add New Session Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="relative w-full mb-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-green-400 shadow-lg hover:shadow-xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                        <span className="text-2xl">✨</span>
                        <span>Add New Session</span>
                    </div>
                </button>

                {/* Sessions List */}
                {sessions.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 max-w-md mx-auto">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-300">No Sessions Yet</h3>
                            <p className="text-gray-400">Create your first work session to get started!</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sessions.map((session, idx) => (
                            <div
                                key={session.id || idx}
                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-800/70 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 group"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-bold text-xl text-white group-hover:text-indigo-300 transition-colors duration-300">
                                            {session.title}
                                        </h3>
                                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-indigo-400">📊</span>
                                            <span className="text-gray-300">Type:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.type === 'monthly'
                                                    ? 'bg-blue-500/20 text-blue-300'
                                                    : 'bg-green-500/20 text-green-300'
                                                }`}>
                                                {session.type}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <span className="text-purple-400">📅</span>
                                            <span className="text-gray-300">Days/Week:</span>
                                            <span className="text-white font-medium">{session.daysPerWeek}</span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-400">⏰</span>
                                            <span className="text-gray-300">Hours/Day:</span>
                                            <span className="text-white font-medium">{session.hoursPerDay}</span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <span className="text-yellow-400">🚀</span>
                                            <span className="text-gray-300">Started:</span>
                                            <span className="text-white font-medium">
                                                {new Date(session.startDate ?? '').toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-gray-800/95 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-700/50 m-4">
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        Create New Session
                                    </h3>
                                    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-2"></div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block mb-2 text-sm text-gray-300 font-medium">Session Title</label>
                                        <input
                                            type="text"
                                            placeholder="Enter session title..."
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                                        />
                                        {errors.title && <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                                            <span>⚠️</span><span>{errors.title}</span>
                                        </p>}
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm text-gray-300 font-medium">Session Type</label>
                                        <select
                                            value={form.type}
                                            onChange={(e) => setForm({ ...form, type: e.target.value as 'daily' | 'monthly' })}
                                            className="w-full p-3 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="daily">Daily</option>
                                        </select>
                                        {errors.type && <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                                            <span>⚠️</span><span>{errors.type}</span>
                                        </p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-2 text-sm text-gray-300 font-medium">Days/Week</label>
                                            <input
                                                type="number"
                                                placeholder="5"
                                                value={form.daysPerWeek}
                                                onChange={(e) => setForm({ ...form, daysPerWeek: +e.target.value })}
                                                className="w-full p-3 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                                            />
                                            {errors.daysPerWeek && <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                                                <span>⚠️</span><span>{errors.daysPerWeek}</span>
                                            </p>}
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm text-gray-300 font-medium">Hours/Day</label>
                                            <input
                                                type="number"
                                                placeholder="8"
                                                value={form.hoursPerDay}
                                                onChange={(e) => setForm({ ...form, hoursPerDay: +e.target.value })}
                                                className="w-full p-3 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                                            />
                                            {errors.hoursPerDay && <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                                                <span>⚠️</span><span>{errors.hoursPerDay}</span>
                                            </p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm text-gray-300 font-medium">Start Date</label>
                                        <input
                                            type="date"
                                            value={form.startDate}
                                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                                        />
                                        {errors.startDate && <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                                            <span>⚠️</span><span>{errors.startDate}</span>
                                        </p>}
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setErrors({});
                                        }}
                                        className="flex-1 bg-gray-600/50 hover:bg-gray-600/70 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddSession}
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                                    >
                                        Create Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkSessions;