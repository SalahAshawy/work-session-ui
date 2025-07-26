import { useEffect, useState } from 'react';

interface Insight {
    expectedHoursTotal: number;
    workedHours: number;
    remainingHours: number;
    daysRemaining: number;
}

interface Session {
    _id: string;
    title: string;
}

const API_URL = 'https://checkin-system-9dwb.vercel.app';

const Insights = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [insight, setInsight] = useState<Insight | null>(null);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/work-sessions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setSessions(data);
            if (data.length > 0) {
                setSelectedSessionId(data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const fetchInsightForSession = async (sessionId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/work-sessions/${sessionId}/insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setInsight(data);
        } catch (err) {
            console.error('Error fetching insight:', err);
            setInsight(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        if (selectedSessionId) {
            fetchInsightForSession(selectedSessionId);
        }
    }, [selectedSessionId]);

    const handleSessionSelect = (session: Session) => {
        setSelectedSessionId(session._id);
        setDropdownOpen(false);
    };

    const getSelectedSession = () => {
        return sessions.find(s => s._id === selectedSessionId);
    };

    const getProgressPercentage = () => {
        if (!insight) return 0;
        return Math.round((insight.workedHours / insight.expectedHoursTotal) * 100);
    };

    const getStatusColor = () => {
        const progress = getProgressPercentage();
        if (progress >= 80) return 'text-green-400';
        if (progress >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getProgressBarColor = () => {
        const progress = getProgressPercentage();
        if (progress >= 80) return 'from-green-500 to-emerald-500';
        if (progress >= 50) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

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

            <div className="relative z-10 px-4 pt-10 pb-32 max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 space-y-4">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        📊 Work Insights
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    <p className="text-gray-300 text-lg">Track your progress and performance</p>
                </div>

                {/* Session Selector */}
                <div className="mb-8">
                    <label className="block mb-3 text-sm text-gray-300 font-medium">
                        Select Session
                    </label>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className={`w-full p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-left flex items-center justify-between transition-all duration-300 hover:bg-gray-800/70 hover:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 group ${dropdownOpen ? 'ring-2 ring-indigo-500/50 border-indigo-500 bg-gray-800/70' : ''
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                <span className="text-white font-medium">{getSelectedSession()?.title}</span>
                            </div>
                            <div className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl z-40 overflow-hidden transition-all duration-300 ${dropdownOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                            }`}>
                            <div className="py-2">
                                {sessions.map((session, index) => (
                                    <button
                                        key={session._id}
                                        onClick={() => handleSessionSelect(session)}
                                        className={`w-full px-4 py-3 text-left hover:bg-indigo-600/20 transition-all duration-200 flex items-center space-x-3 group ${selectedSessionId === session._id ? 'bg-indigo-600/30 text-indigo-300' : 'text-gray-300 hover:text-white'
                                            }`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedSessionId === session._id
                                            ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                                            : 'bg-gray-600 group-hover:bg-indigo-400'
                                            }`}></div>
                                        <span className="font-medium">{session.title}</span>
                                        {selectedSessionId === session._id && (
                                            <div className="ml-auto">
                                                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insights Display */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg text-gray-300">Loading insights...</p>
                    </div>
                ) : insight ? (
                    <div className="space-y-6">
                        {/* Progress Overview Card */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white">Progress Overview</h3>
                                <span className={`text-2xl font-bold ${getStatusColor()}`}>
                                    {getProgressPercentage()}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${getProgressBarColor()} rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${getProgressPercentage()}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-400">
                                <span>{insight.workedHours}h worked</span>
                                <span>{insight.expectedHoursTotal}h total</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Expected Hours */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-800/70 hover:scale-105 transition-all duration-300 group">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-300 text-sm font-medium">Expected Hours</span>
                                </div>
                                <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                                    {insight.expectedHoursTotal}h
                                </div>
                            </div>

                            {/* Worked Hours */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-800/70 hover:scale-105 transition-all duration-300 group">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-300 text-sm font-medium">Worked Hours</span>
                                </div>
                                <div className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                                    {insight.workedHours}h
                                </div>
                            </div>

                            {/* Remaining Hours */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-800/70 hover:scale-105 transition-all duration-300 group">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span className="text-gray-300 text-sm font-medium">Remaining Hours</span>
                                </div>
                                <div className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                                    {insight.remainingHours}h
                                </div>
                            </div>

                            {/* Days Remaining */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-800/70 hover:scale-105 transition-all duration-300 group">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <span className="text-gray-300 text-sm font-medium">Days Remaining</span>
                                </div>
                                <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                                    {insight.daysRemaining}
                                </div>
                            </div>
                        </div>

                        {/* Performance Indicator */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                            <h3 className="text-lg font-semibold text-white mb-4">Performance Status</h3>
                            <div className="flex items-center space-x-4">
                                <div className={`w-4 h-4 rounded-full ${getProgressPercentage() >= 80 ? 'bg-green-500 animate-pulse' : getProgressPercentage() >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                <span className={`font-medium ${getStatusColor()}`}>
                                    {getProgressPercentage() >= 80 ? 'Excellent Progress! 🚀' :
                                        getProgressPercentage() >= 50 ? 'Good Progress 👍' :
                                            'Need to catch up ⚡'}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 max-w-md mx-auto">
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-300">No Insights Available</h3>
                            <p className="text-gray-400">No data available for this session yet.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {/* {dropdownOpen && (
                <div
                    className="fixed inset-0 z-50"
                    onClick={() => setDropdownOpen(false)}
                ></div>
            )} */}
        </div>
    );
};

export default Insights;