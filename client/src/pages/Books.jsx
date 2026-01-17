import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Book as BookIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        isbn: '',
        title: '',
        author: '',
        publicationYear: '',
        totalCopies: 1
    });

    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            fetchBooks(page);
        }
    }, [page, searchTerm]);

    const fetchBooks = async (pageNo) => {
        setLoading(true);
        try {
            const res = await api.get(`/books?page=${pageNo}&size=${pageSize}`);
            setBooks(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            if (!searchTerm.trim()) {
                fetchBooks(0);
                return;
            }
            // Note: Search endpoint currently returns a List, not a Page (Backend limitation)
            const res = await api.get(`/books/search?title=${searchTerm}`);
            setBooks(res.data);
            setTotalPages(1); // Disable pagination for search results
            setTotalElements(res.data.length);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await api.delete(`/books/${id}`);
            fetchBooks(page);
        } catch (error) {
            alert('Failed to delete book: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            publicationYear: book.publicationYear,
            totalCopies: book.totalCopies
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingBook(null);
        setFormData({
            isbn: '',
            title: '',
            author: '',
            publicationYear: new Date().getFullYear(),
            totalCopies: 5
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                totalCopies: parseInt(formData.totalCopies),
                publicationYear: parseInt(formData.publicationYear)
            };

            if (editingBook) {
                await api.put(`/books/${editingBook.bookId}`, payload);
            } else {
                await api.post('/books', payload);
            }

            setIsModalOpen(false);
            fetchBooks(page);
        } catch (error) {
            alert('Operation failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Library Books</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>Home</span>
                        <span>/</span>
                        <span className="text-violet-600 font-medium">Library Books</span>
                    </div>
                </div>
                {/* Only Admin/Librarian can add books */}
                {['ADMIN', 'LIBRARIAN'].includes(useAuth().user?.role?.replace('ROLE_', '')) && (
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Book</span>
                    </button>
                )}
            </div>

            {/* Filter / Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-800 ml-2">All Books ({totalElements})</h2>
                <form onSubmit={handleSearch} className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-violet-100 outline-none"
                    />
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="p-4 font-medium pl-6">Book Name</th>
                                <th className="p-4 font-medium">Author</th>
                                <th className="p-4 font-medium">ISBN</th>
                                <th className="p-4 font-medium">Year</th>
                                <th className="p-4 font-medium">Copies</th>
                                <th className="p-4 font-medium pr-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : books.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No books found.</td></tr>
                            ) : (
                                books.map((book) => (
                                    <tr key={book.bookId} className="hover:bg-violet-50/50 transition-colors group border-b border-gray-50 last:border-none">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-violet-600">
                                                    <BookIcon className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-gray-700">{book.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{book.author}</td>
                                        <td className="p-4 text-violet-600 font-medium font-mono text-xs">{book.isbn}</td>
                                        <td className="p-4 text-gray-600">{book.publicationYear}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {book.availableCopies} / {book.totalCopies}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            {['ADMIN', 'LIBRARIAN'].includes(useAuth().user?.role?.replace('ROLE_', '')) && (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(book)}
                                                        className="p-2 text-gray-400 hover:text-violet-600 hover:bg-white rounded-full transition-all shadow-sm"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(book.bookId)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-full transition-all shadow-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Page {page + 1} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`px-3 py-1 rounded ${page === i ? 'bg-violet-600 text-white shadow-sm' : 'hover:bg-gray-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBook ? 'Edit Book' : 'Add New Book'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                            <input
                                type="text"
                                value={formData.isbn}
                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                type="number"
                                value={formData.publicationYear}
                                onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.totalCopies}
                            onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-violet-600 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 transition-colors font-semibold"
                    >
                        {editingBook ? 'Update Book' : 'Add Book'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
