import React, { useState } from 'react';

const ProfileSettings = () => {
    // Mock user
    const user = { username: 'DemoUser', email: 'demo@example.com' };

    // State for Profile Form
    const [username, setUsername] = useState(user.username);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // State for Password Form
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' });

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            setPasswordMessage({ type: 'error', text: 'Failed to change password.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This is irreversible.")) return;
        alert("Account deletion successful (mocked). Redirecting to dashboard.");
    };

    const renderMessage = (message) => {
        if (!message.text) return null;
        const colorClass = message.type === 'success' ? 'bg-green-700/50 text-white' : 'bg-red-600/50 text-white';
        return <div className={`p-3 rounded-lg text-center my-4 ${colorClass}`}>{message.text}</div>;
    };

    return (
        <div className="p-6 pt-24 md:pt-28 max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">⚙️ Profile & Account Settings</h1>

            {/* Profile Form */}
            <div className="bg-gray-800 p-6 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-semibold">Update Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 rounded border"
                        required
                    />
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full p-2 rounded border bg-gray-700"
                    />
                    {renderMessage(profileMessage)}
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded"
                        disabled={profileLoading}
                    >
                        {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                </form>
            </div>

            {/* Password Form */}
            <div className="bg-gray-800 p-6 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Current Password"
                        className="w-full p-2 rounded border"
                        required
                    />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full p-2 rounded border"
                        required
                    />
                    {renderMessage(passwordMessage)}
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
                        disabled={passwordLoading}
                    >
                        {passwordLoading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 p-6 rounded-xl shadow space-y-2">
                <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
                <p className="text-red-200">
                    Permanently delete your account and all associated data. This action is irreversible.
                </p>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                    Delete My Account
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
