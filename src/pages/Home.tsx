import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WorkSession {
    id: string;
    title: string;
    startTime?: string;
    endTime?: string;
}

interface CheckInData {
    sessionId: string;
    sessionTitle: string;
    startTime: string;
    duration: number;
}

const Home = () => {
    const [sessions, setSessions] = useState<WorkSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<WorkSession | null>(null);
    const [checkedIn, setCheckedIn] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('https://checkin-system-9dwb.vercel.app/work-sessions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setSessions(data);
                if (data.length > 0) setSelectedSession(data[0]);
            } catch (err) {
                console.error('Error fetching sessions', err);
            } finally {
                setLoading(false);
            }
        };

        // Check if user is already checked in from localStorage
        const checkExistingCheckIn = () => {
            const storedCheckIn = localStorage.getItem('currentCheckIn');
            if (storedCheckIn) {
                try {
                    const checkInData: CheckInData = JSON.parse(storedCheckIn);
                    const storedStartTime = new Date(checkInData.startTime);
                    const now = new Date();
                    const elapsed = Math.floor((now.getTime() - storedStartTime.getTime()) / 1000);

                    setCheckedIn(true);
                    setStartTime(storedStartTime);
                    setDuration(elapsed);

                    // Find and set the session that was checked in
                    const session = sessions.find(s => s.id === checkInData.sessionId);
                    if (session) {
                        setSelectedSession(session);
                    }
                } catch (error) {
                    console.error('Error parsing stored check-in data:', error);
                    localStorage.removeItem('currentCheckIn');
                }
            }
        };

        fetchSessions();
        checkExistingCheckIn();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (checkedIn && startTime) {
            timer = setInterval(() => {
                const now = new Date();
                const newDuration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                setDuration(newDuration);

                // Update duration in localStorage
                const storedCheckIn = localStorage.getItem('currentCheckIn');
                if (storedCheckIn) {
                    try {
                        const checkInData: CheckInData = JSON.parse(storedCheckIn);
                        checkInData.duration = newDuration;
                        localStorage.setItem('currentCheckIn', JSON.stringify(checkInData));
                    } catch (error) {
                        console.error('Error updating stored duration:', error);
                    }
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [checkedIn, startTime]);

    const formatDuration = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const handleCheckIn = async () => {
        if (!selectedSession) return;

        setApiLoading(true);
        try {
            const token = localStorage.getItem('token');
            const now = new Date();

            const response = await fetch(
                `https://checkin-system-9dwb.vercel.app/work-sessions/${selectedSession._id}/check-in`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        startTime: now.toISOString()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Save check-in data
            const checkInData: CheckInData = {
                sessionId: selectedSession.id,
                sessionTitle: selectedSession.title,
                startTime: now.toISOString(),
                duration: 0
            };

            localStorage.setItem('currentCheckIn', JSON.stringify(checkInData));
            localStorage.setItem('selectedSession', JSON.stringify(selectedSession));

            setCheckedIn(true);
            setStartTime(now);
            setDuration(0);

            console.log('Check-in successful:', data);
        } catch (error: any) {
            console.error('Error checking in:', error);
            alert(error.message || 'Failed to check in.');
        } finally {
            setApiLoading(false);
        }
    };
    const navigate = useNavigate();

    const handleCheckOut = async () => {
        if (!selectedSession) return;

        setApiLoading(true);
        try {
            const token = localStorage.getItem('token');
            const now = new Date();

            const response = await fetch(
                `https://checkin-system-9dwb.vercel.app/work-sessions/${selectedSession._id}/check-out`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        endTime: now.toISOString(),
                        totalDuration: duration
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            localStorage.removeItem('currentCheckIn');
            localStorage.removeItem('selectedSession');

            setCheckedIn(false);
            setStartTime(null);
            setDuration(0);

            console.log('Check-out successful:', data);
        } catch (error: any) {
            console.error('Error checking out:', error);
            alert(error.message || 'Failed to check out.');
        } finally {
            setApiLoading(false);
        }
    };


    const handleSessionSelect = (session: WorkSession) => {
        // Don't allow session change if currently checked in
        if (checkedIn) {
            alert('Please check out from the current session before switching.');
            return;
        }

        setSelectedSession(session);
        setDropdownOpen(false);
        setDuration(0);
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

    if (sessions.length === 0) {
        return (
            <div className="relative min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white px-4">
                {/* Background animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-800 to-gray-900 animate-pulse z-0"></div>

                <div className="z-10 text-center">
                    <h2 className="text-3xl font-bold mb-4">No Work Sessions</h2>
                    <p className="text-gray-300 mb-6 max-w-sm mx-auto">You haven't created any work session yet. Let's get started!</p>
                    <button
                        onClick={() => navigate('/sessions')}
                        className="bg-indigo-600 hover:bg-indigo-700 transition-transform duration-300 transform hover:scale-105 py-3 px-6 rounded-full font-semibold shadow-lg"
                    >
                        Create Work Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gray-950 text-white overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1e3a8a] via-[#9333ea] to-[#111827] opacity-30 animate-pulse z-0"></div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
                <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce opacity-25"></div>
            </div>

            <div className="z-10 w-full max-w-md text-center space-y-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Current Session
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* Custom Modern Dropdown */}
                <div className="relative">
                    <label className="block mb-3 text-sm text-gray-300 text-left font-medium">
                        Switch Session
                    </label>

                    <button
                        onClick={() => !checkedIn && setDropdownOpen(!dropdownOpen)}
                        disabled={checkedIn}
                        className={`w-full p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-left flex items-center justify-between transition-all duration-300 group ${checkedIn
                            ? 'opacity-50 cursor-not-allowed'
                            : `hover:bg-gray-800/70 hover:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${dropdownOpen ? 'ring-2 ring-indigo-500/50 border-indigo-500 bg-gray-800/70' : ''
                            }`
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${checkedIn
                                ? 'bg-green-500 animate-pulse'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                }`}></div>
                            <span className="text-white font-medium">{selectedSession?.title}</span>
                            {checkedIn && <span className="text-xs text-green-400 ml-2">(Active)</span>}
                        </div>
                        <div className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ${dropdownOpen && !checkedIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                        }`}>
                        <div className="py-2">
                            {sessions.map((session, index) => (
                                <button
                                    key={session.id}
                                    onClick={() => handleSessionSelect(session)}
                                    className={`w-full px-4 py-3 text-left hover:bg-indigo-600/20 transition-all duration-200 flex items-center space-x-3 group ${selectedSession?.id === session.id ? 'bg-indigo-600/30 text-indigo-300' : 'text-gray-300 hover:text-white'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedSession?.id === session.id
                                        ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                                        : 'bg-gray-600 group-hover:bg-indigo-400'
                                        }`}></div>
                                    <span className="font-medium">{session.title}</span>
                                    {selectedSession?.id === session.id && (
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

                {/* Action Buttons */}
                <div className="space-y-4">
                    {!checkedIn ? (
                        <button
                            onClick={handleCheckIn}
                            disabled={apiLoading || !selectedSession}
                            className="relative w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 overflow-hidden group bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-green-400 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center space-x-2">
                                {apiLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Checking In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-2xl">🚀</span>
                                        <span>Check In</span>
                                    </>
                                )}
                            </div>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleCheckOut}
                                disabled={apiLoading}
                                className="relative w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 overflow-hidden group bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center space-x-2">
                                    {apiLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Checking Out...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-2xl">⏹️</span>
                                            <span>Check Out</span>
                                        </>
                                    )}
                                </div>
                            </button>

                            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
                                <div className="text-center space-y-2">
                                    <div className="text-sm text-gray-400 uppercase tracking-wider">Active Session</div>
                                    <div className="text-3xl font-mono font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                        {formatDuration(duration)}
                                    </div>
                                    <div className="flex items-center justify-center space-x-2 text-green-400">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm">Recording time</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {/* {dropdownOpen && !checkedIn && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setDropdownOpen(false)}
        ></div>
      )} */}
        </div>
    );
};

export default Home;