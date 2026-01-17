import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ArrowLeftRight,
    LogOut,
    Library
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const location = useLocation();
    const { logout, user } = useAuth();

    const isActive = (path) => location.pathname === path;

    const userRole = user?.role?.replace('ROLE_', '') || '';

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
        { path: '/books', icon: BookOpen, label: 'Library Books', roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
        // Admin/Librarian can see Members
        { path: '/members', icon: Users, label: 'Members', roles: ['ADMIN', 'LIBRARIAN'] },
        // Only Librarian can see Borrowing
        { path: '/borrowing', icon: ArrowLeftRight, label: 'Borrowing', roles: ['LIBRARIAN'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

    return (
        <div className="w-64 bg-white shadow-lg flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-violet-600 p-2 rounded-lg">
                    <Library className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">UTG</h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Menu
                </p>
                {filteredNavItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                            ${isActive(item.path)
                                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                                : 'text-gray-500 hover:bg-violet-50 hover:text-violet-600'}
                        `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
