import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import Layout from './components/Layout';

// Placeholder Pages (will be implemented next)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Borrowing from './pages/Borrowing';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<AuthGuard><Layout /></AuthGuard>}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/books" element={<Books />} />
                    </Route>

                    {/* Admin & Librarian Routes */}
                    <Route element={<AuthGuard allowedRoles={['ADMIN', 'LIBRARIAN']}><Layout /></AuthGuard>}>
                        <Route path="/members" element={<Members />} />
                    </Route>

                    {/* Librarian Only Routes */}
                    <Route element={<AuthGuard allowedRoles={['LIBRARIAN']}><Layout /></AuthGuard>}>
                        <Route path="/borrowing" element={<Borrowing />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
