import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(1);

    // Helper to calculate days between dates
    const getDuration = (start, end) => {
        if (!start || !end) return 5; // default
        const diffTime = Math.abs(new Date(end) - new Date(start));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays); // at least 1 day
    };

    const durationDays = getDuration(location.state?.startDate, location.state?.endDate);
    const destinationName = location.state?.destination || 'Kyoto';
    const userVibes = location.state?.vibes || [];

    // Mock Data Generator
    const getMockItinerary = (dest, budget, days, vibes) => {
        const normalizedDest = dest.toLowerCase();

        const presets = {
            kyoto: {
                country: 'Japan',
                summary: 'Experience the perfect harmony of ancient traditions and serene beauty. From mystical bamboo groves to sacred shrines, your journey unveils the soul of Japan.',
                bestTime: 'March - May (Cherry Blossom Season)',
                weather: '15°C - 22°C, Partly Cloudy',
                images: [
                    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&fit=crop'
                ],
                places: [
                    { name: 'Fushimi Inari', type: 'Shrine', rating: 4.9 },
                    { name: 'Kinkaku-ji', type: 'Temple', rating: 4.8 },
                    { name: 'Arashiyama', type: 'Nature', rating: 4.7 },
                    { name: 'Gion', type: 'Historic', rating: 4.8 },
                    { name: 'Nishiki Market', type: 'Market', rating: 4.6 }
                ],
                activities: [
                    { name: 'Tea Ceremony', duration: '2 hrs', icon: '🍵' },
                    { name: 'Cooking Class', duration: '3 hrs', icon: '🍳' },
                    { name: 'Bamboo Hike', duration: '2.5 hrs', icon: '🎋' },
                    { name: 'Sake Tasting', duration: '1.5 hrs', icon: '🍶' }
                ],
                festivals: [
                    { name: 'Hanami', date: 'Spring', status: 'upcoming' },
                    { name: 'Gion Matsuri', date: 'July', status: 'upcoming' }
                ]
            },
            paris: {
                country: 'France',
                summary: 'The City of Light awaits with its romantic avenues, world-class art, and exquisite cuisine. Discover the magic of Parisian culture.',
                bestTime: 'April - June',
                weather: '18°C - 25°C, Sunny',
                images: [
                    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1511739001486-6bfe10ce7859?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=600&fit=crop'
                ],
                places: [
                    { name: 'Eiffel Tower', type: 'Landmark', rating: 4.8 },
                    { name: 'Louvre Museum', type: 'Museum', rating: 4.9 },
                    { name: 'Notre-Dame', type: 'Cathedral', rating: 4.7 },
                    { name: 'Montmartre', type: 'District', rating: 4.6 },
                    { name: 'Seine River', type: 'Nature', rating: 4.8 }
                ],
                activities: [
                    { name: 'River Cruise', duration: '1.5 hrs', icon: '🚢' },
                    { name: 'Croissant Workshop', duration: '2 hrs', icon: '🥐' },
                    { name: 'Louvre Tour', duration: '3 hrs', icon: '🎨' },
                    { name: 'Wine Tasting', duration: '2 hrs', icon: '🍷' }
                ],
                festivals: [
                    { name: 'Bastille Day', date: 'July 14', status: 'upcoming' },
                    { name: 'Fashion Week', date: 'Sep/Oct', status: 'upcoming' }
                ]
            },
            bali: {
                country: 'Indonesia',
                summary: 'Escape to a tropical tropical paradise of lush jungles, pristine beaches, and vibrant spiritual culture. Experience the Island of the Gods.',
                bestTime: 'May - September',
                weather: '27°C - 32°C, Tropical',
                images: [
                    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1552083375-1447ce886485?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=600&fit=crop',
                    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&fit=crop'
                ],
                places: [
                    { name: 'Uluwatu Temple', type: 'Temple', rating: 4.8 },
                    { name: 'Sacred Monkey Forest', type: 'Nature', rating: 4.6 },
                    { name: 'Tegallalang Rice Terrace', type: 'Nature', rating: 4.9 },
                    { name: 'Seminyak Beach', type: 'Beach', rating: 4.7 },
                    { name: 'Tanah Lot', type: 'Landmark', rating: 4.8 }
                ],
                activities: [
                    { name: 'Surfing Lesson', duration: '2 hrs', icon: '🏄' },
                    { name: 'Yoga Retreat', duration: '1 day', icon: '🧘' },
                    { name: 'Balinese Massage', duration: '1.5 hrs', icon: '💆' },
                    { name: 'Island Hopping', duration: '6 hrs', icon: '🏝️' }
                ],
                festivals: [
                    { name: 'Nyepi (Silent Day)', date: 'March', status: 'upcoming' },
                    { name: 'Bali Arts Festival', date: 'June-July', status: 'happening' }
                ]
            }
        };

        // Fallback or Match
        let data = presets.kyoto; // Default to Kyoto
        if (normalizedDest.includes('paris') || normalizedDest.includes('france')) data = presets.paris;
        if (normalizedDest.includes('bali') || normalizedDest.includes('indonesia')) data = presets.bali;
        if (normalizedDest.includes('tokyo')) data = presets.kyoto; // Reuse Kyoto structure for now/Tokyo similar vibes

        // Generate Daily Roadmap
        const roadmap = Array.from({ length: days }, (_, i) => {
            const dayNum = i + 1;
            let title = 'City Exploration';
            let mood = 'Adventurous';

            if (dayNum === 1) { title = 'Arrival & First Impressions'; mood = 'Excited'; }
            else if (dayNum === days) { title = 'Farewell & Souvenirs'; mood = 'Nostalgic'; }
            else if (dayNum % 2 === 0) { title = 'Cultural Deep Dictionary'; mood = 'Cultural'; }
            else { title = 'Nature & Relaxation'; mood = 'Relaxing'; }

            return {
                day: dayNum,
                date: `Day ${dayNum}`,
                title: title,
                description: `A curated day of exploring the best spots tailored to your ${userVibes[0] || 'unique'} vibe.`,
                time: '9:00 AM - 8:00 PM',
                highlights: data.places.slice(0, 3).map(p => p.name),
                mood: mood,
                image: data.images[i % data.images.length]
            };
        });

        return {
            destination: dest,
            country: data.country,
            duration: `${days} Days`,
            totalCost: `$${budget.toLocaleString()}`,
            bestTime: data.bestTime,
            weather: data.weather,
            summary: data.summary,
            roadmap: roadmap,
            places: data.places,
            activities: data.activities,
            festivals: data.festivals,
            tips: [
                'Book attractions in advance',
                'Try the local street food',
                'Learn basic local phrases',
                'Carry a power bank'
            ]
        };
    };

    const travelPlan = getMockItinerary(
        destinationName,
        location.state?.budget || 2500,
        durationDays,
        userVibes
    );

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f1f5f9',
        marginBottom: '1rem',
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-secondary)', borderRightColor: 'var(--color-secondary)' }}
                />
                <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white' }}>AI is crafting your perfect journey...</h2>
                <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8' }}>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>Analyzing destinations</motion.span>
                    <span>•</span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>Optimizing routes</motion.span>
                    <span>•</span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}>Finding hidden gems</motion.span>
                </div>
            </div>
        );
    }

    const currentDay = travelPlan.roadmap.find(d => d.day === activeDay);

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '5rem' }}>
            {/* Hero Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', padding: '3rem 0', color: 'white' }}>
                <div className="container">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => navigate('/planner')}
                        style={{ marginBottom: '1.5rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        ← Back to Planner
                    </motion.button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <span style={{ background: 'var(--color-secondary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600' }}>AI Generated</span>
                            </div>
                            <h1 style={{ fontSize: '2.75rem', marginBottom: '0.5rem', color: 'white' }}>
                                <span style={{ color: '#38bdf8' }}>{travelPlan.destination}</span>, <span style={{ color: 'var(--color-secondary)' }}>{travelPlan.country}</span>
                            </h1>
                            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', lineHeight: '1.7' }}>{travelPlan.summary}</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                            style={{ display: 'flex', gap: '1.5rem', background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Duration</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{travelPlan.duration}</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Est. Cost</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-secondary)' }}>{travelPlan.totalCost}</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Weather</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>☀️ {travelPlan.weather.split(',')[0]}</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container" style={{ padding: '3rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>

                    {/* Left - Roadmap Timeline */}
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#0f172a' }}>🗺️ Your Travel Roadmap</h2>

                        {/* Day Selector Pills */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            {travelPlan.roadmap.map((day) => (
                                <button
                                    key={day.day}
                                    onClick={() => setActiveDay(day.day)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '50px',
                                        border: activeDay === day.day ? 'none' : '1px solid #e2e8f0',
                                        background: activeDay === day.day ? 'var(--color-primary)' : 'white',
                                        color: activeDay === day.day ? 'white' : '#64748b',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    Day {day.day}
                                </button>
                            ))}
                        </div>

                        {/* Active Day Detail */}
                        {currentDay && (
                            <motion.div
                                key={currentDay.day}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                            >
                                <div style={{ position: 'relative', height: '280px' }}>
                                    <img src={currentDay.image} alt={currentDay.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                        <span style={{ background: 'var(--color-secondary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600', color: 'white' }}>{currentDay.date}</span>
                                        <h3 style={{ fontSize: '1.75rem', color: 'white', marginTop: '0.5rem' }}>{currentDay.title}</h3>
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>🕐 {currentDay.time}</span>
                                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>✨ {currentDay.mood}</span>
                                    </div>

                                    <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>{currentDay.description}</p>

                                    <h4 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.1rem' }}>Highlights</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        {currentDay.highlights.map((hl, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px' }}>
                                                <span style={{ color: 'var(--color-secondary)' }}>✓</span>
                                                <span style={{ color: '#475569', fontSize: '0.95rem' }}>{hl}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Timeline Overview */}
                        <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Full Itinerary Overview</h3>
                            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: '#e2e8f0' }} />
                                {travelPlan.roadmap.map((day, idx) => (
                                    <div key={day.day} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setActiveDay(day.day)}>
                                        <div style={{
                                            width: '16px', height: '16px', borderRadius: '50%',
                                            background: activeDay === day.day ? 'var(--color-secondary)' : 'white',
                                            border: activeDay === day.day ? 'none' : '2px solid #cbd5e1',
                                            marginLeft: '-2rem', marginTop: '4px', zIndex: 1,
                                            transition: 'all 0.2s'
                                        }} />
                                        <div style={{ flex: 1, padding: '0.75rem 1rem', background: activeDay === day.day ? '#fff7ed' : 'white', borderRadius: '10px', border: '1px solid', borderColor: activeDay === day.day ? 'var(--color-secondary)' : '#e2e8f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '600', color: '#1e293b' }}>Day {day.day}: {day.title}</span>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{day.time.split(' - ')[0]}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Info Cards */}
                    <div>
                        {/* Places to Visit */}
                        <div style={cardStyle}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📍 Places to Visit
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {travelPlan.places.map((place, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{place.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{place.type}</div>
                                        </div>
                                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>⭐ {place.rating}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activities */}
                        <div style={cardStyle}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🎯 Activities & Experiences
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {travelPlan.activities.map((act, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <span style={{ fontSize: '1.25rem' }}>{act.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.9rem' }}>{act.name}</div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{act.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Festivals & Events */}
                        <div style={cardStyle}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🎉 Festivals & Events
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {travelPlan.festivals.map((fest, i) => (
                                    <div key={i} style={{ padding: '0.75rem', background: fest.status === 'happening' ? '#dcfce7' : '#f8fafc', borderRadius: '10px', border: '1px solid', borderColor: fest.status === 'happening' ? '#86efac' : '#e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{fest.name}</span>
                                            {fest.status === 'happening' && <span style={{ background: '#22c55e', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '600' }}>HAPPENING</span>}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>📅 {fest.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Travel Tips */}
                        <div style={cardStyle}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                💡 AI Travel Tips
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {travelPlan.tips.map((tip, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 0', borderBottom: i < travelPlan.tips.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                        <span style={{ color: 'var(--color-secondary)' }}>•</span>
                                        <span style={{ color: '#475569', fontSize: '0.9rem' }}>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Book Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, var(--color-secondary), #f97316)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '1.05rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(251, 146, 60, 0.3)',
                            }}
                        >
                            Book This Itinerary 🚀
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
