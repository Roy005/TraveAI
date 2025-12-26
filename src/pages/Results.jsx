import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tripsAPI } from '../utils/api';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(1);
    const [tripData, setTripData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if trip data was passed from Planner
        if (location.state?.trip) {
            // AI-generated trip from Planner
            setTripData(location.state.trip);
            setLoading(false);
        } else if (location.state?.tripId) {
            // Loading existing trip by ID
            loadTripById(location.state.tripId);
        } else {
            // No trip data - redirect to planner
            setError('No trip data found. Please create a trip first.');
            setTimeout(() => navigate('/planner'), 2000);
        }
    }, [location.state]);

    const loadTripById = async (tripId) => {
        try {
            const data = await tripsAPI.getById(tripId);
            setTripData(data.trip);
            setLoading(false);
        } catch (err) {
            setError('Failed to load trip. Please try again.');
            setLoading(false);
        }
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f1f5f9',
        marginBottom: '1rem',
    };

    // Loading screen
    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-secondary)', borderRightColor: 'var(--color-secondary)' }}
                />
                <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white' }}>Loading your AI-crafted journey...</h2>
                <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8' }}>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>Fetching itinerary</motion.span>
                    <span>•</span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>Loading activities</motion.span>
                    <span>•</span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}>Preparing timeline</motion.span>
                </div>
            </div>
        );
    }

    // Error screen
    if (error) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <div style={{ fontSize: '4rem' }}>⚠️</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: 'white' }}>{error}</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/planner')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'var(--color-secondary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Go to Planner
                </motion.button>
            </div>
        );
    }

    // Extract data from tripData
    const itinerary = tripData?.itinerary || {};
    const days = itinerary.days || [];
    const currentDay = days.find(d => d.day === activeDay) || days[0];

    // Format date for display
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate duration
    const getDuration = () => {
        if (tripData?.startDate && tripData?.endDate) {
            const start = new Date(tripData.startDate);
            const end = new Date(tripData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return `${diffDays} Days`;
        }
        return `${days.length} Days`;
    };

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
                                <span style={{ background: 'var(--color-secondary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600' }}>
                                    {location.state?.aiGenerated ? '✨ AI Generated' : '📋 Saved Trip'}
                                </span>
                            </div>
                            <h1 style={{ fontSize: '2.75rem', marginBottom: '0.5rem', color: 'white' }}>
                                <span style={{ color: '#38bdf8' }}>{itinerary.tripName || tripData?.destination}</span>
                            </h1>
                            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', lineHeight: '1.7' }}>
                                {itinerary.summary || `Your personalized trip to ${tripData?.destination}`}
                            </p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                            style={{ display: 'flex', gap: '1.5rem', background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Duration</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{getDuration()}</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Budget</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-secondary)' }}>${tripData?.budget?.toLocaleString()}</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Travelers</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>👥 {tripData?.travelers}</div>
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
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#0f172a' }}>🗺️ Your AI-Generated Itinerary</h2>

                        {/* Day Selector Pills */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            {days.map((day) => (
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
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <span style={{ background: 'var(--color-secondary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600', color: 'white' }}>
                                            Day {currentDay.day} {currentDay.date ? `• ${formatDate(currentDay.date)}` : ''}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>{currentDay.title}</h3>
                                </div>

                                {/* Activities Timeline */}
                                <div style={{ padding: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.1rem' }}>📋 Today's Activities</h4>

                                    {currentDay.activities && currentDay.activities.length > 0 ? (
                                        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                            <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0' }} />

                                            {currentDay.activities.map((activity, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', position: 'relative' }}
                                                >
                                                    <div style={{
                                                        width: '16px', height: '16px', borderRadius: '50%',
                                                        background: 'var(--color-secondary)',
                                                        marginLeft: '-2rem', marginTop: '4px', zIndex: 1,
                                                        flexShrink: 0
                                                    }} />

                                                    <div style={{ flex: 1, padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.05rem' }}>{activity.activity}</span>
                                                            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
                                                                {activity.time}
                                                            </span>
                                                        </div>

                                                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: '1.6' }}>
                                                            {activity.description}
                                                        </p>

                                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                            {activity.location && (
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#64748b' }}>
                                                                    📍 {activity.location}
                                                                </span>
                                                            )}
                                                            {activity.duration && (
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#64748b' }}>
                                                                    ⏱️ {activity.duration}
                                                                </span>
                                                            )}
                                                            {activity.cost > 0 && (
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>
                                                                    💰 ${activity.cost}
                                                                </span>
                                                            )}
                                                            {activity.category && (
                                                                <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                                    {activity.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No activities planned for this day yet.</p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Full Itinerary Overview */}
                        <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Full Itinerary Overview</h3>
                            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: '#e2e8f0' }} />
                                {days.map((day) => (
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
                                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{day.activities?.length || 0} activities</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div>
                        {/* Trip Highlights */}
                        {itinerary.highlights && itinerary.highlights.length > 0 && (
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ⭐ Trip Highlights
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {itinerary.highlights.map((highlight, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '10px' }}>
                                            <span style={{ color: '#22c55e' }}>✓</span>
                                            <span style={{ color: '#166534', fontSize: '0.95rem' }}>{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Packing List */}
                        {itinerary.packingList && itinerary.packingList.length > 0 && (
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    🎒 Packing List
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {itinerary.packingList.map((item, i) => (
                                        <span key={i} style={{ padding: '0.4rem 0.75rem', background: '#f1f5f9', borderRadius: '50px', fontSize: '0.85rem', color: '#475569' }}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Travel Tips */}
                        {itinerary.tips && itinerary.tips.length > 0 && (
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    💡 AI Travel Tips
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {itinerary.tips.map((tip, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 0', borderBottom: i < itinerary.tips.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                            <span style={{ color: 'var(--color-secondary)' }}>•</span>
                                            <span style={{ color: '#475569', fontSize: '0.9rem' }}>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Estimated Cost */}
                        {itinerary.totalEstimatedCost && (
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    💵 Estimated Cost
                                </h3>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-secondary)' }}>
                                    ${itinerary.totalEstimatedCost?.toLocaleString()}
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                    Based on AI analysis of activities
                                </p>
                            </div>
                        )}

                        {/* Vibes */}
                        {tripData?.vibes && tripData.vibes.length > 0 && (
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✨ Trip Vibes
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {tripData.vibes.map((vibe, i) => (
                                        <span key={i} style={{ padding: '0.4rem 0.75rem', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '50px', fontSize: '0.85rem', color: '#92400e', fontWeight: '600' }}>
                                            {vibe}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/bookings')}
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
                                Book Hotels & Flights 🚀
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/trips')}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'white',
                                    color: '#0f172a',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                }}
                            >
                                View All My Trips 📋
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
