import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBooks: 0,
        activeMembers: 0,
        borrowedBooks: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const userRole = user?.role?.replace('ROLE_', '');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Define what to fetch based on roles
                const canViewMembers = ['ADMIN', 'LIBRARIAN'].includes(userRole);
                const canViewBorrowing = ['LIBRARIAN'].includes(userRole);

                // Prepare promises based on permissions
                const bookPromise = api.get('/books?size=1'); // Public/Member accessible
                const memberPromise = canViewMembers ? api.get('/members?size=1') : Promise.resolve(null);
                const borrowingPromise = canViewBorrowing ? api.get('/borrowing/active') : Promise.resolve(null);

                const [booksRes, membersRes, borrowingRes] = await Promise.all([
                    bookPromise,
                    memberPromise,
                    borrowingPromise
                ]);

                // Books API returns a Page
                const booksCount = booksRes.data.totalElements;

                // Members API returns a Page (if fetched)
                const membersCount = membersRes ? membersRes.data.totalElements : 0;

                // Active borrowing returns a List (if fetched)
                const borrowingData = borrowingRes ? borrowingRes.data : [];

                setStats({
                    totalBooks: booksCount,
                    activeMembers: membersCount,
                    borrowedBooks: borrowingData.length
                });

                if (canViewBorrowing) {
                    setRecentActivity(borrowingData.slice(0, 5));
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (userRole) {
            fetchStats();
        }
    }, [userRole]);

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    const canViewMembers = ['ADMIN', 'LIBRARIAN'].includes(userRole);
    const canViewBorrowing = ['LIBRARIAN'].includes(userRole);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Available for Everyone */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Total Books</h3>
                        <span className="bg-violet-100 text-violet-600 p-2 rounded-lg text-sm font-bold">Books</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalBooks}</p>
                </div>

                {/* Admin & Librarian Only */}
                {canViewMembers && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Members</h3>
                            <span className="bg-green-100 text-green-600 p-2 rounded-lg text-sm font-bold">People</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stats.activeMembers}</p>
                    </div>
                )}

                {/* Librarian Only */}
                {canViewBorrowing && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">Borrowed Books</h3>
                            <span className="bg-orange-100 text-orange-600 p-2 rounded-lg text-sm font-bold">Active</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{stats.borrowedBooks}</p>
                    </div>
                )}
            </div>

            {/* Librarian Only */}
            {canViewBorrowing && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Borrowing Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-500 text-sm">No active borrowings found.</p>
                        ) : (
                            recentActivity.map((record) => (
                                <div key={record.recordId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">
                                            BR
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{record.bookTitle}</p>
                                            <p className="text-xs text-gray-500">Borrowed by {record.memberName}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">Due: {record.dueDate}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
