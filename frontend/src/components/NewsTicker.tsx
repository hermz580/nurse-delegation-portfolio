import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
    id: string;
    title: string;
    content?: string;
    category: string;
    link?: string;
    isPinned: boolean;
}

interface NewsTickerProps {
    autoRotate?: boolean;
    rotateInterval?: number;
}

export default function NewsTicker({ autoRotate = true, rotateInterval = 5000 }: NewsTickerProps) {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch from API
        // For now, use placeholder data
        const fetchNews = async () => {
            try {
                // const response = await fetch('/api/v1/news');
                // const data = await response.json();
                // setNewsItems(data.data);

                setNewsItems([
                    { id: '1', title: 'Welcome to the Nurse Delegation Network!', content: 'The Washington Nurse Delegation Network is now live.', category: 'announcement', isPinned: true },
                    { id: '2', title: 'New Provider Sign-ups Open', content: 'RN delegators can now register for our directory.', category: 'news', isPinned: false, link: '/register' },
                    { id: '3', title: 'WAC 246-840 Updates', content: 'Recent regulatory updates affecting nurse delegation.', category: 'update', link: 'https://app.leg.wa.gov/wac/default.aspx?cite=246-840-910', isPinned: false }
                ]);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch news:', error);
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        if (!autoRotate || newsItems.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % newsItems.length);
        }, rotateInterval);

        return () => clearInterval(interval);
    }, [autoRotate, rotateInterval, newsItems.length]);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'announcement':
                return '#6ee7b7';
            case 'alert':
                return '#ef4444';
            case 'update':
                return '#3b82f6';
            default:
                return '#fbbf24';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'announcement':
                return '📢';
            case 'alert':
                return '⚠️';
            case 'update':
                return '🔄';
            default:
                return '📰';
        }
    };

    if (isLoading || newsItems.length === 0) return null;

    const currentNews = newsItems[currentIndex];

    return (
        <div style={{
            background: 'linear-gradient(90deg, rgba(110, 231, 183, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '10px 0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
            }}>
                {/* Category Badge */}
                <span style={{
                    background: getCategoryColor(currentNews.category),
                    color: '#0a0a0b',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {getCategoryIcon(currentNews.category)}
                    {currentNews.category}
                </span>

                {/* News Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentNews.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            overflow: 'hidden'
                        }}
                    >
                        {currentNews.link ? (
                            <a
                                href={currentNews.link}
                                target={currentNews.link.startsWith('http') ? '_blank' : undefined}
                                rel={currentNews.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <strong>{currentNews.title}</strong>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>—</span>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{currentNews.content}</span>
                                <span style={{ color: '#6ee7b7' }}>→</span>
                            </a>
                        ) : (
                            <span style={{ fontSize: '14px', color: 'white' }}>
                                <strong>{currentNews.title}</strong>
                                <span style={{ color: 'rgba(255,255,255,0.7)' }}> — {currentNews.content}</span>
                            </span>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Dots */}
                {newsItems.length > 1 && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {newsItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: index === currentIndex
                                        ? '#6ee7b7'
                                        : 'rgba(255,255,255,0.3)',
                                    transition: 'all 0.3s'
                                }}
                                aria-label={`View news item ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
