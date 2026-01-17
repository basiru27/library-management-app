import { Search, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="bg-white h-20 px-8 flex items-center justify-between shadow-sm z-10">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="What do you want to find?"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                        <MessageSquare className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-gray-200"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'Member'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold border-2 border-white shadow-sm">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
