import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import '../styles/App.css';

interface Stats {
    users: { total: number; active: number; newThisMonth: number; subscribed: number };
    providers: { total: number; verified: number; pendingVerification: number; activeCounties: number };
    subscriptions: { active: number; trialing: number; canceled: number; revenueThisMonth: number };
}

type TabType = 'overview' | 'users' | 'providers' | 'news' | 'settings';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // TODO: Fetch from API
        setTimeout(() => {
            setStats({
                users: { total: 156, active: 142, newThisMonth: 23, subscribed: 89 },
                providers: { total: 288, verified: 245, pendingVerification: 43, activeCounties: 39 },
                subscriptions: { active: 89, trialing: 12, canceled: 34, revenueThisMonth: 4560 }
            });
            setIsLoading(false);
        }, 500);
    }, []);

    // Handler functions for admin actions
    const handleImportCSV = () => {
        setShowImportModal(true);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            toast.success(`File "${file.name}" selected! Import functionality coming soon.`, {
                icon: '📤',
                style: { background: '#1e293b', color: '#fff' }
            });
            setShowImportModal(false);
        }
    };

    const handleExportReport = () => {
        // Create mock CSV data
        const csvContent = 'Name,Email,Role,Subscription,Joined\nJohn Doe,john@example.com,Case Worker,Pro,2025-11-15\nJane Smith,jane@example.com,Provider,Basic,2025-11-20\nBob Wilson,bob@example.com,Case Worker,Trial,2025-12-01';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('User report downloaded!', {
            icon: '📥',
            style: { background: '#1e293b', color: '#fff' }
        });
    };

    const handleAddUser = () => {
        setShowAddUserModal(true);
    };

    const handleUserAction = (action: string, userName: string) => {
        toast.success(`${action} action applied to ${userName}`, {
            style: { background: '#1e293b', color: '#fff' }
        });
    };

    const handleProviderVerify = (providerName: string) => {
        toast.success(`${providerName} has been verified!`, {
            icon: '✅',
            style: { background: '#1e293b', color: '#fff' }
        });
    };

    const handleNewsAction = (action: string, title: string) => {
        toast.success(`${action}: "${title}"`, {
            style: { background: '#1e293b', color: '#fff' }
        });
    };

    const tabs: { id: TabType; label: string; icon: string }[] = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'providers', label: 'Providers', icon: '🏥' },
        { id: 'news', label: 'News', icon: '📰' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    const StatCard = ({ label, value, icon, trend }: { label: string; value: string | number; icon: string; trend?: string }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>{label}</p>
                    <p style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>{value}</p>
                    {trend && (
                        <p style={{ color: '#6ee7b7', fontSize: '12px', marginTop: '4px' }}>{trend}</p>
                    )}
                </div>
                <span style={{ fontSize: '32px' }}>{icon}</span>
            </div>
        </motion.div>
    );

    const renderOverview = () => (
        <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'white' }}>Dashboard Overview</h2>

            {stats && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        <StatCard label="Total Users" value={stats.users.total} icon="👥" trend={`+${stats.users.newThisMonth} this month`} />
                        <StatCard label="Active Subscriptions" value={stats.subscriptions.active} icon="💳" />
                        <StatCard label="Total Providers" value={stats.providers.total} icon="🏥" />
                        <StatCard label="Revenue (MTD)" value={`$${stats.subscriptions.revenueThisMonth.toLocaleString()}`} icon="💰" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {/* Quick Actions */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'white' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { label: 'Add New Provider', action: () => setActiveTab('providers') },
                                    { label: 'Create News Post', action: () => setActiveTab('news') },
                                    { label: 'Import Providers (CSV)', action: handleImportCSV },
                                    { label: 'Export User Report', action: handleExportReport }
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={item.action}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {item.label} →
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pending Actions */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'white' }}>Pending Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(239, 68, 68, 0.3)'
                                }}>
                                    <span style={{ color: 'white' }}>Providers Pending Verification</span>
                                    <span style={{
                                        background: '#ef4444',
                                        color: 'white',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontWeight: '600'
                                    }}>{stats.providers.pendingVerification}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: 'rgba(251, 191, 36, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(251, 191, 36, 0.3)'
                                }}>
                                    <span style={{ color: 'white' }}>Users on Trial</span>
                                    <span style={{
                                        background: '#fbbf24',
                                        color: '#0a0a0b',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontWeight: '600'
                                    }}>{stats.subscriptions.trialing}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderUsers = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>User Management</h2>
                <button onClick={handleAddUser} style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                    color: '#0a0a0b',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}>
                    + Add User
                </button>
            </div>

            {/* Search and Filters */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap'
            }}>
                <input
                    type="text"
                    placeholder="Search users..."
                    style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(0,0,0,0.3)',
                        color: 'white'
                    }}
                />
                <select style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white'
                }}>
                    <option value="">All Roles</option>
                    <option value="caseworker">Case Worker</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                </select>
                <select style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white'
                }}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="trialing">Trialing</option>
                </select>
            </div>

            {/* Users Table */}
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>User</th>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>Role</th>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>Subscription</th>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>Joined</th>
                            <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'John Doe', email: 'john@example.com', role: 'Case Worker', sub: 'Pro', joined: '2025-11-15' },
                            { name: 'Jane Smith', email: 'jane@example.com', role: 'Provider', sub: 'Basic', joined: '2025-11-20' },
                            { name: 'Bob Wilson', email: 'bob@example.com', role: 'Case Worker', sub: 'Trial', joined: '2025-12-01' }
                        ].map((user, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ color: 'white', fontWeight: '500' }}>{user.name}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{user.email}</div>
                                </td>
                                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)' }}>{user.role}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        background: user.sub === 'Trial' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(110, 231, 183, 0.2)',
                                        color: user.sub === 'Trial' ? '#fbbf24' : '#6ee7b7',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontSize: '12px'
                                    }}>{user.sub}</span>
                                </td>
                                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)' }}>{user.joined}</td>
                                <td style={{ padding: '16px' }}>
                                    <button onClick={() => handleUserAction('Edit', user.name)} style={{
                                        padding: '6px 12px',
                                        marginRight: '8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}>Edit</button>
                                    <button onClick={() => handleUserAction('Suspend', user.name)} style={{
                                        padding: '6px 12px',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: '#ef4444',
                                        cursor: 'pointer'
                                    }}>Suspend</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderProviders = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>Provider Management</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        padding: '10px 20px',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        📤 Import CSV
                    </button>
                    <button style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                        color: '#0a0a0b',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        + Add Provider
                    </button>
                </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                Manage nurse delegation providers, verify credentials, and update service areas.
            </p>

            {/* Provider Stats */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#6ee7b7' }}>{stats.providers.total}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Total</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#6ee7b7' }}>{stats.providers.verified}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Verified</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#fbbf24' }}>{stats.providers.pendingVerification}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Pending</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#6ee7b7' }}>{stats.providers.activeCounties}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Counties</div>
                    </div>
                </div>
            )}

            {/* Placeholder for provider list */}
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.2)'
            }}>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Provider list and management interface coming soon...</p>
            </div>
        </div>
    );

    const renderNews = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>News & Announcements</h2>
                <button onClick={() => handleNewsAction('Create post', 'New Post')} style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                    color: '#0a0a0b',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}>
                    + Create Post
                </button>
            </div>

            {/* News Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                    { title: 'Welcome to Nurse Delegation Network!', category: 'announcement', active: true, pinned: true, date: '2025-12-01' },
                    { title: 'New Provider Sign-ups Open', category: 'news', active: true, pinned: false, date: '2025-12-05' },
                    { title: 'WAC 246-840 Updates', category: 'update', active: true, pinned: false, date: '2025-12-07' }
                ].map((item, i) => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                {item.pinned && <span style={{ fontSize: '14px' }}>📌</span>}
                                <h4 style={{ color: 'white', fontWeight: '500', margin: 0 }}>{item.title}</h4>
                                <span style={{
                                    background: item.category === 'announcement' ? 'rgba(110, 231, 183, 0.2)' : 'rgba(255,255,255,0.1)',
                                    color: item.category === 'announcement' ? '#6ee7b7' : 'rgba(255,255,255,0.6)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px'
                                }}>{item.category}</span>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>Published: {item.date}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleNewsAction('Edit', item.title)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => handleNewsAction('Delete', item.title)} style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: 'white' }}>Site Settings</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
                {/* Site Name */}
                <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Site Name</label>
                    <input
                        type="text"
                        defaultValue="Nurse Delegation Network - Nurse Delegation & Consulting"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white'
                        }}
                    />
                </div>

                {/* Subscription Required Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px'
                }}>
                    <div>
                        <p style={{ color: 'white', fontWeight: '500', marginBottom: '4px' }}>Subscription Required</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Require users to subscribe to access the site</p>
                    </div>
                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#6ee7b7' }} />
                </div>

                {/* Trial Days */}
                <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Free Trial Days</label>
                    <input
                        type="number"
                        defaultValue={14}
                        style={{
                            width: '100px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white'
                        }}
                    />
                </div>

                {/* Stripe Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px'
                }}>
                    <div>
                        <p style={{ color: 'white', fontWeight: '500', marginBottom: '4px' }}>Stripe Payments Enabled</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Process payments via Stripe</p>
                    </div>
                    <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: '#6ee7b7' }} />
                </div>

                {/* Maintenance Mode */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                    <div>
                        <p style={{ color: 'white', fontWeight: '500', marginBottom: '4px' }}>Maintenance Mode</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Take the site offline for maintenance</p>
                    </div>
                    <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: '#ef4444' }} />
                </div>

                <button style={{
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                    color: '#0a0a0b',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '16px'
                }}>
                    Save Settings
                </button>
            </div>
        </div>
    );

    return (
        <div className="ndn-app" style={{ minHeight: '100vh', display: 'flex' }}>
            <div className="bg-grid"></div>

            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'rgba(0,0,0,0.4)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                padding: '24px 16px',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ marginBottom: '40px', padding: '0 8px' }}>
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <div style={{ fontSize: '28px' }}>🏥</div>
                        <span style={{ color: 'white', fontSize: '24px', fontWeight: '700' }}>Nurse Delegation Network</span>
                    </a>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>Admin Dashboard</p>
                </div>

                <nav>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '14px 16px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeTab === tab.id
                                    ? 'linear-gradient(135deg, rgba(110, 231, 183, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
                                    : 'transparent',
                                color: activeTab === tab.id ? '#6ee7b7' : 'rgba(255,255,255,0.7)',
                                fontSize: '15px',
                                fontWeight: activeTab === tab.id ? '600' : '400',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.3s'
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '16px',
                    right: '16px'
                }}>
                    <a
                        href="/"
                        style={{
                            display: 'block',
                            padding: '12px 16px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            color: 'rgba(255,255,255,0.6)',
                            textDecoration: 'none',
                            textAlign: 'center',
                            fontSize: '14px'
                        }}
                    >
                        ← Back to Site
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '32px 40px',
                minHeight: '100vh'
            }}>
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'providers' && renderProviders()}
                        {activeTab === 'news' && renderNews()}
                        {activeTab === 'settings' && renderSettings()}
                    </>
                )}
            </main>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '32px',
                        width: '100%',
                        maxWidth: '400px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h3 style={{ color: 'white', marginBottom: '24px' }}>Add New User</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginBottom: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white'
                            }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginBottom: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white'
                            }}
                        />
                        <select style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '24px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white'
                        }}>
                            <option value="caseworker">Case Worker</option>
                            <option value="provider">Provider</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowAddUserModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'transparent',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    toast.success('User created successfully!', { style: { background: '#1e293b', color: '#fff' } });
                                    setShowAddUserModal(false);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                    color: '#0a0a0b',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Add User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import CSV Modal */}
            {showImportModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        padding: '32px',
                        width: '100%',
                        maxWidth: '400px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: 'white', marginBottom: '16px' }}>Import Providers (CSV)</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Select a CSV file to import provider data</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                padding: '16px 32px',
                                marginBottom: '16px',
                                borderRadius: '8px',
                                border: '2px dashed rgba(255,255,255,0.3)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            📁 Choose File
                        </button>
                        <button
                            onClick={() => setShowImportModal(false)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'transparent',
                                color: 'rgba(255,255,255,0.6)',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
