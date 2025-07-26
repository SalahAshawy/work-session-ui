import { Home, BarChart2, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname; // Now always reflects actual route

    const handleNavigation = (path: string) => {
        if (pathname !== path) {
            navigate(path);
        }
    };

    return (
        <>
            {/* Background blur overlay */}
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-950/95 via-gray-950/80 to-transparent backdrop-blur-sm pointer-events-none z-40"></div>

            {/* Main Navigation */}
            <div className="fixed bottom-4 left-4 right-4 z-50">
                <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl">
                    <div className="flex justify-around items-center py-3 px-2">
                        <NavItem
                            onClick={() => handleNavigation('/home')}
                            active={pathname === '/home'}
                            icon={<Home size={22} />}
                            label="Home"
                        />
                        <NavItem
                            onClick={() => handleNavigation('/sessions')}
                            active={pathname === '/sessions'}
                            icon={<Clock size={22} />}
                            label="Sessions"
                        />
                        <NavItem
                            onClick={() => handleNavigation('/insights')}
                            active={pathname === '/insights'}
                            icon={<BarChart2 size={22} />}
                            label="Insights"
                        />
                    </div>

                    {/* Active indicator line */}
                    <div className="relative h-1 bg-gray-700/30 rounded-b-2xl overflow-hidden">
                        <div
                            className={`absolute top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out ${pathname === '/home'
                                    ? 'left-[8.33%] w-[25%]'
                                    : pathname === '/sessions'
                                        ? 'left-[41.67%] w-[25%]'
                                        : pathname === '/insights'
                                            ? 'left-[75%] w-[16.67%]'
                                            : ''
                                }`}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
};


const NavItem = ({
    onClick,
    icon,
    label,
    active
}: {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-300 group relative overflow-hidden ${active
            ? 'text-white transform scale-105'
            : 'text-gray-400 hover:text-gray-200 hover:scale-105'
            }`}
    >
        {/* Background glow for active state */}
        {active && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl animate-pulse"></div>
        )}

        {/* Icon container */}
        <div className={`relative transition-all duration-300 ${active
            ? 'text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text'
            : 'group-hover:text-indigo-400'
            }`}>
            <div className={active ? 'filter drop-shadow-lg' : ''}>
                {icon}
            </div>
        </div>

        {/* Label */}
        <span className={`text-xs font-medium transition-all duration-300 relative ${active
            ? 'text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold'
            : 'group-hover:text-gray-200'
            }`}>
            {label}
        </span>

        {/* Active dot indicator */}
        {active && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
        )}

        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
);

export default BottomNav;