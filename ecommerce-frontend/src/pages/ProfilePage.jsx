import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Mail, Shield } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const data = { name, email };
            if (password) data.password = password;
            await updateProfile(data);
            setMessage('Profile updated successfully!');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Profile</h1>

            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user?.email}</p>
                        <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1"><Shield className="w-3 h-3" /> {user?.role}</p>
                    </div>
                </div>

                {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm">{message}</div>}
                {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password (leave blank to keep current)</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;