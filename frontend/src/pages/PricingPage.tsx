import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../styles/App.css';

export default function PricingPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoApplied, setPromoApplied] = useState(false);
    const [hoveredFaq, setHoveredFaq] = useState<number | null>(null);

    // Single pricing plan - admin can add tiers later
    const basePrice = 49;
    const finalPrice = basePrice - (basePrice * discount / 100);

    const features = [
        'Full interactive map access',
        'Provider directory search',
        'Advanced search & filters',
        'County coverage analytics',
        'Email support',
        'Provider profile listing',
        'Download reports (PDF/CSV)',
        'Priority placement on map',
        '14-day free trial'
    ];

    const faqs = [
        {
            q: 'What happens after the free trial?',
            a: 'After your 14-day trial, you\'ll be charged $' + finalPrice + '/month. You can cancel anytime before the trial ends with no charge.'
        },
        {
            q: 'Can I cancel my subscription?',
            a: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
        },
        {
            q: 'Do you offer refunds?',
            a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.'
        },
        {
            q: 'Will there be additional pricing tiers?',
            a: 'We may introduce additional tiers in the future based on user feedback. Current subscribers will be grandfathered into their plan.'
        }
    ];

    const handleApplyPromo = () => {
        // Mock promo codes - in production, this would call the backend
        const promoCodes: { [key: string]: number } = {
            'WELCOME20': 20,
            'SUMMER50': 50,
            'LAUNCH30': 30,
        };

        const code = promoCode.toUpperCase();
        if (promoCodes[code]) {
            setDiscount(promoCodes[code]);
            setPromoApplied(true);
        } else {
            setPromoApplied(false);
            setDiscount(0);
            alert('Invalid promo code');
        }
    };

    const handleSelectPlan = () => {
        navigate('/register', {
            state: {
                selectedPlan: 'professional',
                price: finalPrice,
                promoCode: promoApplied ? promoCode : null
            }
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '80px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 50%, #0a0a0b 100%)',
        }}>
            {/* Animated Shimmer Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 208, 0, 0.15) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'shimmerBackground 8s ease infinite',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Floating Particles - using style guide colors */}
            {[...Array(20)].map((_, i) => {
                const colors = ['#ffd000', '#00ffd5', '#ff006e', '#00b4ff', '#00ff88', '#a855f7'];
                return (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: Math.random() * 4 + 2 + 'px',
                            height: Math.random() * 4 + 2 + 'px',
                            borderRadius: '50%',
                            background: colors[i % colors.length],
                            opacity: 0.4,
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                );
            })}

            <style>{`
                @keyframes shimmerBackground {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.02); }
                }
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-2deg); }
                    75% { transform: rotate(2deg); }
                }
                @keyframes shimmerCard {
                    0% { left: -100%; }
                    100% { left: 200%; }
                }
                @keyframes logoColorCycle {
                    0% { color: #00ffd5; text-shadow: 0 0 20px rgba(0, 255, 213, 0.6); }
                    16.66% { color: #ff006e; text-shadow: 0 0 20px rgba(255, 0, 110, 0.6); }
                    33.33% { color: #ffd000; text-shadow: 0 0 20px rgba(255, 208, 0, 0.6); }
                    50% { color: #00b4ff; text-shadow: 0 0 20px rgba(0, 180, 255, 0.6); }
                    66.66% { color: #00ff88; text-shadow: 0 0 20px rgba(0, 255, 136, 0.6); }
                    83.33% { color: #a855f7; text-shadow: 0 0 20px rgba(168, 85, 247, 0.6); }
                    100% { color: #00ffd5; text-shadow: 0 0 20px rgba(0, 255, 213, 0.6); }
                }
                .logo-color-cycle {
                    animation: logoColorCycle 6s ease-in-out infinite;
                    font-size: 26px;
                    font-weight: 700;
                    letter-spacing: 3px;
                }
            `}</style>

            {/* Navigation */}
            <nav className="nav">
                <a href="/" className="nav-logo">
                    <div className="nav-logo-icon">🏥</div>
                    <span className="logo-color-cycle">Nurse Delegation Network</span>
                </a>
                <div className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/login" className="nav-link">Login</a>
                </div>
            </nav>

            {/* Pricing Header */}
            <section className="section" style={{ paddingTop: '40px', position: 'relative', zIndex: 10 }}>
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="section-badge">Simple Pricing</div>
                    <h1 className="section-title">
                        One Plan, <span className="gradient">Full Access</span>
                    </h1>
                    <p className="section-desc">
                        Get complete access to Washington's nurse delegation network with our all-inclusive plan.
                    </p>
                </motion.div>

                {/* Bouncing Pricing Card */}
                <div style={{
                    maxWidth: '500px',
                    margin: '60px auto',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                        whileHover={{
                            scale: 1.05,
                            rotate: [0, -1, 1, -1, 0],
                            transition: { duration: 0.5 }
                        }}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '2px solid rgba(110, 231, 183, 0.3)',
                            borderRadius: '20px',
                            padding: '40px',
                            position: 'relative',
                            overflow: 'hidden',
                            animation: 'bounce 3s ease-in-out infinite',
                            boxShadow: '0 20px 60px rgba(255, 208, 0, 0.3)',
                        }}
                    >
                        {/* Shimmer overlay on card */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 208, 0, 0.3), transparent)',
                            animation: 'shimmerCard 3s infinite',
                        }} />

                        {/* Recommended Badge */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                color: '#0a0a0b',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        >
                            Most Popular
                        </motion.div>

                        <h2 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '12px'
                        }}>
                            Professional
                        </h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            marginBottom: '32px'
                        }}>
                            Complete access for providers and case workers
                        </p>

                        {/* Price */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                {discount > 0 && (
                                    <span style={{
                                        fontSize: '24px',
                                        color: 'rgba(255,255,255,0.4)',
                                        textDecoration: 'line-through'
                                    }}>
                                        ${basePrice}
                                    </span>
                                )}
                                <motion.span
                                    style={{
                                        fontSize: '56px',
                                        fontWeight: '700',
                                        background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                    animate={{
                                        scale: discount > 0 ? [1, 1.1, 1] : 1,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                    }}
                                >
                                    ${finalPrice}
                                </motion.span>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px' }}>
                                    /month
                                </span>
                            </div>
                            <AnimatePresence>
                                {discount > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{
                                            marginTop: '8px',
                                            color: '#6ee7b7',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        🎉 {discount}% discount applied! You save ${basePrice - finalPrice}/month
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Promo Code Input */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{
                                display: 'block',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '14px',
                                marginBottom: '8px',
                                fontWeight: '500'
                            }}>
                                Have a promo code?
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    placeholder="Enter code"
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}
                                />
                                <motion.button
                                    onClick={handleApplyPromo}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(110, 231, 183, 0.3)',
                                        background: 'rgba(110, 231, 183, 0.1)',
                                        color: '#6ee7b7',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '14px'
                                    }}
                                >
                                    Apply
                                </motion.button>
                            </div>
                        </div>

                        {/* Features List */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '16px'
                            }}>
                                Everything included:
                            </h3>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '12px',
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <span style={{
                                            color: '#6ee7b7',
                                            fontSize: '18px'
                                        }}>✓</span>
                                        {feature}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            onClick={handleSelectPlan}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)',
                                color: '#0a0a0b',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(110, 231, 183, 0.3)'
                            }}
                        >
                            Start 14-Day Free Trial
                        </motion.button>
                        <p style={{
                            textAlign: 'center',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '12px',
                            marginTop: '12px'
                        }}>
                            No credit card required • Cancel anytime
                        </p>
                    </motion.div>
                </div>

                {/* FAQ Section with Flip & Wiggle */}
                <div style={{
                    maxWidth: '800px',
                    margin: '80px auto 40px',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: '40px'
                        }}
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                onHoverStart={() => setHoveredFaq(i)}
                                onHoverEnd={() => setHoveredFaq(null)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    background: hoveredFaq === i
                                        ? 'rgba(255, 208, 0, 0.15)'
                                        : 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    border: hoveredFaq === i
                                        ? '2px solid rgba(255, 208, 0, 0.6)'
                                        : '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                }}
                            >
                                <motion.h3
                                    animate={{
                                        rotateY: hoveredFaq === i ? [0, 360] : 0,
                                        scale: hoveredFaq === i ? 1.05 : 1,
                                    }}
                                    transition={{
                                        rotateY: { duration: 0.6 },
                                        scale: { duration: 0.3 }
                                    }}
                                    style={{
                                        color: hoveredFaq === i ? '#ffd000' : 'white',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: hoveredFaq === i ? '12px' : '0',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {faq.q}
                                </motion.h3>
                                <AnimatePresence>
                                    {hoveredFaq === i && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0, rotateX: -90 }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                                rotateX: 0,
                                            }}
                                            exit={{ opacity: 0, height: 0, rotateX: -90 }}
                                            transition={{ duration: 0.4 }}
                                            style={{
                                                color: 'rgba(255,255,255,0.7)',
                                                lineHeight: '1.6',
                                                margin: 0,
                                                transformOrigin: 'top',
                                            }}
                                        >
                                            {faq.a}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                                {hoveredFaq === i && (
                                    <motion.div
                                        animate={{
                                            rotate: [0, -2, 2, -2, 2, 0],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatDelay: 1,
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            pointerEvents: 'none',
                                        }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
