import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/App.css';

interface ProviderProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    license: string;
    acceptingNewClients: boolean;
    serviceCounties: string[];
    bio: string;
}

export default function ProviderDashboardPage() {
    const navigate = useNavigate();

    // Mock Data - In real app, fetch from API
    const [profile, setProfile] = useState<ProviderProfile>({
        id: '123',
        name: 'Sarah Jenkins, RN',
        email: 'sarah.jenkins@example.com',
        phone: '(206) 555-0123',
        license: 'RN60555123',
        acceptingNewClients: true,
        serviceCounties: ['King', 'Snohomish'],
        bio: 'Experienced delegating nurse with 10+ years in community health. Specializing in AFH and ALF settings.'
    });

    const allCounties = [
        'Adams', 'Asotin', 'Benton', 'Chelan', 'Clallam', 'Clark', 'Columbia',
        'Cowlitz', 'Douglas', 'Ferry', 'Franklin', 'Garfield', 'Grant',
        'Grays Harbor', 'Island', 'Jefferson', 'King', 'Kitsap', 'Kittitas',
        'Klickitat', 'Lewis', 'Lincoln', 'Mason', 'Okanogan', 'Pacific',
        'Pend Oreille', 'Pierce', 'San Juan', 'Skagit', 'Skamania', 'Snohomish',
        'Spokane', 'Stevens', 'Thurston', 'Wahkiakum', 'Walla Walla', 'Whatcom',
        'Whitman', 'Yakima'
    ];

    const [isEditing, setIsEditing] = useState(false);

    const handleToggleStatus = () => {
        setProfile(prev => ({ ...prev, acceptingNewClients: !prev.acceptingNewClients }));
        // TODO: API Call to update status
    };

    const handleCountyToggle = (county: string) => {
        setProfile(prev => {
            const current = prev.serviceCounties;
            if (current.includes(county)) {
                return { ...prev, serviceCounties: current.filter(c => c !== county) };
            } else {
                return { ...prev, serviceCounties: [...current, county] };
            }
        });
    };

    const handleSaveProfile = () => {
        // TODO: API call to save profile
        toast.success('Profile saved successfully!', {
            icon: '✅',
            style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(110, 231, 183, 0.3)' }
        });
    };

    return (
        <div className="ndn-app" style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex' }}>
            <div className="bg-grid"></div>

            {/* Navigation */}
            <nav className="nav">
                <a href="/" className="nav-logo">
                    <div className="nav-logo-icon">🏥</div>
                    <span className="nav-logo-text">Nurse Delegation Network</span>
                </a>
                <div className="nav-links">
                    <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: '16px' }}>Logged in as Provider</span>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>

                {/* Header Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                    marginBottom: '40px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: '24px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                            Provider Dashboard
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                            Manage your availability, service areas, and profile settings.
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Taking New Clients:</span>
                            <button
                                onClick={handleToggleStatus}
                                style={{
                                    position: 'relative',
                                    width: '48px',
                                    height: '24px',
                                    borderRadius: '12px',
                                    background: profile.acceptingNewClients ? '#6ee7b7' : 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '2px',
                                    left: profile.acceptingNewClients ? '26px' : '2px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                            </button>
                            <span style={{
                                color: profile.acceptingNewClients ? '#6ee7b7' : 'rgba(255,255,255,0.4)',
                                fontWeight: '600',
                                width: '30px'
                            }}>
                                {profile.acceptingNewClients ? 'ON' : 'OFF'}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>

                    {/* Main Content Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* Service Areas */}
                        <section style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '32px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '24px' }}>
                                Service Areas (Counties)
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                                Select the counties where you are licensed and willing to travel for delegation.
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {allCounties.map(county => {
                                    const isSelected = profile.serviceCounties.includes(county);
                                    return (
                                        <button
                                            key={county}
                                            onClick={() => handleCountyToggle(county)}
                                            style={{
                                                padding: '10px 20px',
                                                borderRadius: '20px',
                                                border: isSelected ? '1px solid #6ee7b7' : '1px solid rgba(255,255,255,0.2)',
                                                background: isSelected ? 'rgba(110, 231, 183, 0.1)' : 'transparent',
                                                color: isSelected ? '#6ee7b7' : 'rgba(255,255,255,0.6)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                fontSize: '14px',
                                                fontWeight: isSelected ? '600' : '400'
                                            }}
                                        >
                                            {county}
                                            {isSelected && <span style={{ marginLeft: '8px' }}>✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Recent Inquiries */}
                        <section style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '32px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '24px' }}>
                                Recent Case Worker Inquiries
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { name: 'John Doe', agency: 'DSHS Region 1', date: 'Today 9:30 AM', message: 'Looking for delegation in King County for...' },
                                    { name: 'Alice Smith', agency: 'Aall Care', date: 'Yesterday 2:15 PM', message: 'Urgent need for insulin delegation in...' }
                                ].map((inquiry, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        borderLeft: '4px solid #6ee7b7'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: 'white', fontWeight: '600' }}>{inquiry.name}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{inquiry.date}</span>
                                        </div>
                                        <div style={{ color: '#6ee7b7', fontSize: '14px', marginBottom: '8px' }}>{inquiry.agency}</div>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>
                                            "{inquiry.message}"
                                        </p>
                                        <button style={{
                                            marginTop: '16px',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '13px'
                                        }}>
                                            Reply via Email
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar Column */}
                    <div>
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '32px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            position: 'sticky',
                            top: '100px'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '32px',
                                    margin: '0 auto 16px',
                                    color: '#0a0a0b',
                                    fontWeight: '700'
                                }}>
                                    SJ
                                </div>
                                <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '4px' }}>{profile.name}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{profile.license}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>Contact Email</label>
                                    <div style={{ color: 'white', fontSize: '14px' }}>{profile.email}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>Phone</label>
                                    <div style={{ color: 'white', fontSize: '14px' }}>{profile.phone}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>Bio</label>
                                    <div style={{ color: 'white', fontSize: '14px', lineHeight: '1.5' }}>{profile.bio}</div>
                                </div>
                            </div>

                            <button onClick={handleSaveProfile} style={{
                                width: '100%',
                                marginTop: '12px',
                                padding: '12px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                color: '#0a0a0b',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}>
                                Save Profile
                            </button>

                            <button onClick={() => setIsEditing(true)} style={{
                                width: '100%',
                                marginTop: '12px',
                                padding: '12px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
