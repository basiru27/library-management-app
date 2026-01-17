import { useState, useEffect } from 'react';
import { ArrowLeftRight, Clock, CheckCircle, Search, User, Book as BookIcon, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';

export default function Borrowing() {
    const [activeBorrowings, setActiveBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    // Search State
    const [bookSearch, setBookSearch] = useState('');
    const [memberSearch, setMemberSearch] = useState('');
    const [bookResults, setBookResults] = useState([]);
    const [memberResults, setMemberResults] = useState([]);
    const [searchingBooks, setSearchingBooks] = useState(false);
    const [searchingMembers, setSearchingMembers] = useState(false);

    useEffect(() => {
        fetchBorrowings();
    }, []);

    // Debounced Search for Books
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (bookSearch.length > 2) {
                setSearchingBooks(true);
                try {
                    const res = await api.get(`/books/search?title=${bookSearch}`);
                    setBookResults(res.data);
                } catch (error) {
                    console.error("Book search failed", error);
                } finally {
                    setSearchingBooks(false);
                }
            } else {
                setBookResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [bookSearch]);

    // Member Search (using page/size to get a list if no direct search endpoint exists, but we'll try to use the filtering if available)
    // Note: If backend doesn't support Member Search by name, we might simply fetch page 0 of members.
    // Ideally we should add a search endpoint for Members too. For now, I'll assume we can fetch all or paginate.
    // Let's rely on getAllMembers for now since we haven't implemented member search by name in backend explicitly yet,
    // OR we can fetch page 1 and filter locally if dataset is small, BUT better to implement backend search.
    // Wait -> MemberController doesn't have search. I should implement it.
    // For this step I will attempt to fetch page 0 and filter client side as a temporary measure if needed,
    // OR BETTER, I will update Backend to support member search in the NEXT step if this fails.
    // Actually, I will implement a basic "Fetch Recent/All" for members in the modal for now.
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (memberSearch.length > 0) { // Even 1 char
                setSearchingMembers(true);
                try {
                    // Fetching first page of members to show something. 
                    // Real solution: Add /api/members/search endpoint.
                    const res = await api.get(`/members?page=0&size=20`);
                    // Client side filter since backend search is missing
                    const filtered = res.data.content.filter(m =>
                        m.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
                        m.membershipNumber.toLowerCase().includes(memberSearch.toLowerCase())
                    );
                    setMemberResults(filtered);
                } catch (error) {
                    console.error("Member search failed", error);
                } finally {
                    setSearchingMembers(false);
                }
            } else {
                setMemberResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [memberSearch]);


    const fetchBorrowings = async () => {
        try {
            const res = await api.get('/borrowing/active');
            setActiveBorrowings(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (id) => {
        if (!window.confirm('Return this book?')) return;
        try {
            await api.post(`/borrowing/return/${id}`);
            fetchBorrowings();
        } catch (error) {
            alert('Error returning book: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleIssueBook = async (e) => {
        e.preventDefault();
        if (!selectedBook || !selectedMember) {
            alert("Please select both a Book and a Member");
            return;
        }

        try {
            await api.post('/borrowing/borrow', {
                bookId: selectedBook.bookId,
                memberId: selectedMember.memberId
            });
            setIsModalOpen(false);
            setBookSearch('');
            setMemberSearch('');
            setSelectedBook(null);
            setSelectedMember(null);
            fetchBorrowings();
        } catch (error) {
            alert('Failed to issue book: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Borrowing</h1>
                    <p className="text-sm text-gray-500">Manage book issues and returns</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-colors"
                >
                    <ArrowLeftRight className="w-5 h-5" />
                    <span>Issue New Book</span>
                </button>
            </div>

            {/* Active Borrowings List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Active Borrowings ({activeBorrowings.length})
                </h2>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-gray-500 text-center py-8">Loading...</p>
                    ) : activeBorrowings.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                <Clock className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 font-medium">No active borrowings.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {activeBorrowings.map((record) => (
                                <div key={record.recordId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-violet-600">
                                            <BookIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{record.bookTitle}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {record.memberName}
                                                </span>
                                                <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-md">
                                                    Due: {record.dueDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleReturn(record.recordId)}
                                        className="text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all bg-white p-2 rounded-lg shadow-sm border border-gray-100"
                                        title="Return Book"
                                    >
                                        <div className="flex items-center gap-2 px-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Return</span>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Issue Book Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Issue Book"
            >
                <form onSubmit={handleIssueBook} className="space-y-6">
                    {/* Select Member Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Select Member</label>
                        {!selectedMember ? (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search member by name..."
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none transition-all"
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                />
                                {searchingMembers && <p className="text-xs text-gray-400 mt-1 pl-2">Searching...</p>}
                                {memberResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto z-10 p-1">
                                        {memberResults.map(m => (
                                            <div
                                                key={m.memberId}
                                                onClick={() => { setSelectedMember(m); setMemberResults([]); setMemberSearch(''); }}
                                                className="p-3 hover:bg-violet-50 rounded-lg cursor-pointer flex items-center justify-between group"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm text-gray-800">{m.fullName}</p>
                                                    <p className="text-xs text-gray-500">{m.membershipNumber}</p>
                                                </div>
                                                <CheckCircle className="w-4 h-4 text-violet-600 opacity-0 group-hover:opacity-100" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl border border-violet-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-xs">
                                        {selectedMember.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{selectedMember.fullName}</p>
                                        <p className="text-xs text-gray-500">{selectedMember.membershipNumber}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedMember(null)}
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Select Book Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Select Book</label>
                        {!selectedBook ? (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search book by title..."
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none transition-all"
                                    value={bookSearch}
                                    onChange={(e) => setBookSearch(e.target.value)}
                                />
                                {searchingBooks && <p className="text-xs text-gray-400 mt-1 pl-2">Searching...</p>}
                                {bookResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto z-10 p-1">
                                        {bookResults.map(b => (
                                            <div
                                                key={b.bookId}
                                                onClick={() => { setSelectedBook(b); setBookResults([]); setBookSearch(''); }}
                                                className="p-3 hover:bg-violet-50 rounded-lg cursor-pointer flex items-center justify-between group"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm text-gray-800">{b.title}</p>
                                                    <p className="text-xs text-gray-500">{b.author}</p>
                                                </div>
                                                {b.availableCopies > 0 ? (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Available</span>
                                                ) : (
                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Out of Stock</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl border border-violet-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-violet-200 flex items-center justify-center text-violet-700">
                                        <BookIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{selectedBook.title}</p>
                                        <p className="text-xs text-gray-500">{selectedBook.author}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedBook(null)}
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedBook || !selectedMember}
                        className="w-full bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200"
                    >
                        Confirm Issue
                    </button>
                </form>
            </Modal>
        </div>
    );
}
