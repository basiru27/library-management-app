import { useState, useEffect } from 'react';
import { Plus, User, Phone, MapPin, ChevronLeft, ChevronRight, Edit2, X, Clock, BookOpen, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';

export default function Members() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 9;

    // Modals State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    // Selection State
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberHistory, setMemberHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        membershipType: 'PUBLIC'
    });

    useEffect(() => {
        fetchMembers(page);
    }, [page]);

    const fetchMembers = async (pageNo) => {
        setLoading(true);
        try {
            const res = await api.get(`/members?page=${pageNo}&size=${pageSize}`);
            setMembers(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (memberId) => {
        setHistoryLoading(true);
        try {
            const res = await api.get(`/members/${memberId}/borrowing-history`);
            setMemberHistory(res.data);
        } catch (error) {
            console.error(error);
            setMemberHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleCardClick = (member) => {
        setSelectedMember(member);
        fetchHistory(member.memberId);
        setIsHistoryModalOpen(true);
    };

    const handleEdit = (e, member) => {
        e.stopPropagation(); // Prevent card click
        setIsEditing(true);
        setSelectedMember(member);
        setFormData({
            username: member.username,
            email: member.email,
            password: 'unchanged', // Dummy value to pass validation
            fullName: member.fullName,
            phoneNumber: member.phoneNumber || '',
            address: member.address || '',
            membershipType: member.membershipType
        });
        setIsFormModalOpen(true);
    };

    const handleAdd = () => {
        setIsEditing(false);
        setSelectedMember(null);
        setFormData({
            username: '',
            email: '',
            password: '',
            fullName: '',
            phoneNumber: '',
            address: '',
            membershipType: 'PUBLIC'
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && selectedMember) {
                // Update
                // We must send all fields required by @Valid in backend, even if service ignores them
                await api.put(`/members/${selectedMember.memberId}`, {
                    ...formData,
                    // Ensure password is not empty to pass @NotBlank
                    password: formData.password || 'placeholder'
                });
            } else {
                // Register
                await api.post('/members', formData);
            }

            setIsFormModalOpen(false);
            fetchMembers(page);
        } catch (error) {
            alert('Operation failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Members ({totalElements})</h1>
                    <p className="text-sm text-gray-500">Manage library members and subscriptions</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Register Member</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {loading ? (
                    <p className="text-gray-500 col-span-3 text-center py-10">Loading members...</p>
                ) : (
                    members.map((member) => (
                        <div
                            key={member.memberId}
                            onClick={() => handleCardClick(member)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative cursor-pointer"
                        >
                            <button
                                onClick={(e) => handleEdit(e, member)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xl uppercase">
                                    {member.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{member.fullName}</h3>
                                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                                        {member.membershipType}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="font-mono text-xs">{member.membershipNumber}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{member.phoneNumber || 'No phone'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">{member.address || 'No address'}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                                <span className={`flex items-center gap-1.5 ${member.active ? 'text-green-600' : 'text-red-500'}`}>
                                    <span className={`w-2 h-2 rounded-full ${member.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {member.active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-gray-400 text-xs text-violet-600 group-hover:underline">View History</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="p-2 rounded hover:bg-white bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="p-2 rounded hover:bg-white bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={isEditing ? 'Edit Member' : 'Register New Member'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isEditing && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Membership</label>
                        <select
                            value={formData.membershipType}
                            onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                        >
                            <option value="PUBLIC">PUBLIC</option>
                            <option value="STUDENT">STUDENT</option>
                            <option value="FACULTY">FACULTY</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 transition-colors font-semibold"
                    >
                        {isEditing ? 'Update Member' : 'Register Member'}
                    </button>
                </form>
            </Modal>

            {/* History Modal */}
            {/* We'll use a larger custom modal for history */}
            {isHistoryModalOpen && selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animated-fadeIn">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xl uppercase">
                                    {selectedMember.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedMember.fullName}</h3>
                                    <p className="text-sm text-gray-500">Member History</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsHistoryModalOpen(false)}
                                className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {historyLoading ? (
                                <p className="text-center text-gray-500 py-10">Loading history...</p>
                            ) : memberHistory.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No borrowing history found.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                                            <th className="p-4 font-medium pl-6">Book Title</th>
                                            <th className="p-4 font-medium">Borrowed</th>
                                            <th className="p-4 font-medium">Due</th>
                                            <th className="p-4 font-medium">Returned</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {memberHistory.map((record) => (
                                            <tr key={record.recordId} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50">
                                                <td className="p-4 pl-6 font-medium text-gray-800">
                                                    <div className="flex items-center gap-3">
                                                        <BookOpen className="w-4 h-4 text-violet-500" />
                                                        {record.bookTitle}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-600">{record.borrowDate}</td>
                                                <td className="p-4 text-gray-600">{record.dueDate}</td>
                                                <td className="p-4 text-gray-600">
                                                    {record.returnDate || '-'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${record.status === 'BORROWED' ? 'bg-blue-100 text-blue-700' :
                                                        record.status === 'RETURNED' ? 'bg-green-100 text-green-700' :
                                                            record.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
