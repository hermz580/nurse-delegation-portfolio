import React from 'react';

interface ProviderNameProps {
    name: string;
    subscriptionStatus: 'trial' | 'subscribed' | 'none';
}

export const ProviderName: React.FC<ProviderNameProps> = ({ name, subscriptionStatus }) => {
    const rainbowStyle = {
        background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: '200% auto',
        animation: 'rainbow 3s linear infinite',
        fontWeight: 'bold',
        display: 'inline-block'
    };

    const purpleStyle = {
        color: '#a855f7',
        fontWeight: 'bold',
        display: 'inline-block'
    };

    const normalStyle = {
        color: 'inherit',
        fontWeight: 'medium',
        display: 'inline-block'
    };

    const getStyle = () => {
        switch (subscriptionStatus) {
            case 'subscribed':
                return rainbowStyle;
            case 'trial':
                return purpleStyle;
            default:
                return normalStyle;
        }
    };

    return (
        <>
            <style>{`
                @keyframes rainbow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
            `}</style>
            <span style={getStyle()}>{name}</span>
        </>
    );
};

export default ProviderName;
