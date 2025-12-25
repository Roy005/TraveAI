import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripsAPI } from '../utils/api';

const Planner = () => {
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        travelers: 2,
        budget: 2000,
        vibes: [],
        pricePerNight: 300,
        starRating: 4,
        amenities: [],
        propertyType: 'hotel',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { isAuthenticated } = useAuth();

    const vibesList = [
        { id: 'relax', label: '🧘 Relaxation', color: '#38bdf8' },
        { id: 'adventure', label: '🧗 Adventure', color: '#fb923c' },
        { id: 'culture', label: '⛩️ Culture', color: '#a855f7' },
        { id: 'food', label: '🍜 Foodie', color: '#f43f5e' },
        { id: 'nightlife', label: '🥂 Nightlife', color: '#e879f9' },
        { id: 'nature', label: '🌿 Nature', color: '#4ade80' },
    ];

    const amenitiesList = ['Pool', 'Free Wi-Fi', 'Parking', 'Gym', 'Spa', 'Restaurant', 'Beach Access', 'Pet Friendly'];
    const propertyTypes = ['Hotel', 'Resort', 'Apartment', 'Villa', 'Hostel', 'Boutique'];

    const toggleVibe = (id) => {
        setFormData((prev) => ({
            ...prev,
            vibes: prev.vibes.includes(id) ? prev.vibes.filter((v) => v !== id) : [...prev.vibes, id]
        }));
    };

    const toggleAmenity = (amenity) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity) ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity]
        }));
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? parseInt(value) : value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if logged in
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/planner', formData } });
            return;
        }

        // Validation
        if (!formData.destination || !formData.startDate || !formData.endDate) {
            setError('Please fill in destination and travel dates');
            return;
        }

        setLoading(true);

        try {
            const data = await tripsAPI.generate({
                destination: formData.destination,
                startDate: formData.startDate,
                endDate: formData.endDate,
                travelers: formData.travelers,
                budget: formData.budget,
                vibes: formData.vibes,
                accommodation: {
                    type: formData.propertyType,
                    starRating: formData.starRating,
                    pricePerNight: formData.pricePerNight,
                    amenities: formData.amenities
                }
            });

            // Navigate to results with the generated trip
            navigate('/results', { state: { trip: data.trip, aiGenerated: data.aiGenerated } });
        } catch (err) {
            setError(err.message || 'Failed to generate trip. Make sure the server is running.');
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const inputStyle = {
        width: '100%',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        background: 'white',
        transition: 'all 0.2s',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '600',
        color: '#1e293b',
        fontSize: '0.95rem',
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f1f5f9',
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '6rem', paddingBottom: '4rem' }}>
            {/* Floating Orbs */}
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'fixed', top: '20%', right: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'linear-gradient(to right, #bae6fd, #e0f2fe)', filter: 'blur(100px)', zIndex: 0, opacity: 0.4 }}
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'fixed', bottom: '10%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'linear-gradient(to right, #fed7aa, #ffedd5)', filter: 'blur(100px)', zIndex: 0, opacity: 0.3 }}
            />

            <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h1 style={{ fontSize: '3rem', marginBottom: '0.75rem', color: '#0f172a' }}>
                        Plan Your Perfect <span style={{ color: 'var(--color-secondary)' }}>Trip</span>
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                        Tell us your preferences and our AI will craft a personalized itinerary just for you.
                    </p>
                </motion.div>

                <motion.form
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleSubmit}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                        {/* Main Form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Trip Details Card */}
                            <motion.div variants={itemVariants} style={cardStyle}>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✈️ Trip Details
                                </h3>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={labelStyle}>Destination</label>
                                    <input
                                        type="text"
                                        name="destination"
                                        placeholder="Where do you want to go?"
                                        value={formData.destination}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Check-in</label>
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Check-out</label>
                                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} style={inputStyle} />
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Number of Travelers</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, travelers: Math.max(1, p.travelers - 1) }))}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', fontSize: '1.25rem', cursor: 'pointer' }}>−</button>
                                        <span style={{ fontSize: '1.25rem', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>{formData.travelers}</span>
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, travelers: p.travelers + 1 }))}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', fontSize: '1.25rem', cursor: 'pointer' }}>+</button>
                                        <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>travelers</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Vibes Card */}
                            <motion.div variants={itemVariants} style={cardStyle}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✨ Travel Vibes
                                </h3>
                                <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>Select what excites you</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {vibesList.map((vibe) => {
                                        const isSelected = formData.vibes.includes(vibe.id);
                                        return (
                                            <button key={vibe.id} type="button" onClick={() => toggleVibe(vibe.id)}
                                                style={{
                                                    padding: '0.6rem 1rem',
                                                    borderRadius: '50px',
                                                    border: `2px solid ${isSelected ? vibe.color : '#e2e8f0'}`,
                                                    background: isSelected ? `${vibe.color}15` : 'white',
                                                    color: isSelected ? vibe.color : '#64748b',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {vibe.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Budget Card */}
                            <motion.div variants={itemVariants} style={cardStyle}>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    💰 Total Budget
                                </h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#64748b' }}>Trip budget</span>
                                    <span style={{ fontWeight: '700', color: 'var(--color-secondary)', fontSize: '1.25rem' }}>${formData.budget.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range" name="budget" min="500" max="15000" step="250" value={formData.budget} onChange={handleChange}
                                    style={{ width: '100%', accentColor: 'var(--color-secondary)', height: '8px', borderRadius: '4px', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                    <span>$500</span><span>$15,000+</span>
                                </div>
                            </motion.div>

                            {/* Popular AI Planned Trips */}
                            <motion.div variants={itemVariants} style={cardStyle}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    🤖 Popular AI-Planned Trips
                                </h3>
                                <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' }}>Get inspired by trips our AI has crafted</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[
                                        { title: 'Tokyo Adventure', days: 7, budget: '$2,500', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop', tag: 'Culture' },
                                        { title: 'Bali Wellness', days: 5, budget: '$1,800', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=200&fit=crop', tag: 'Relaxation' },
                                        { title: 'Swiss Alps', days: 6, budget: '$3,200', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=200&fit=crop', tag: 'Adventure' },
                                    ].map((trip, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            padding: '0.75rem',
                                            borderRadius: '12px',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                            onMouseOver={(e) => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    destination: trip.title.split(' ')[0],
                                                    budget: parseInt(trip.budget.replace(/[$,]/g, '')),
                                                }));
                                            }}
                                        >
                                            <img src={trip.image} alt={trip.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1e293b' }}>{trip.title}</h4>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{trip.days} days • {trip.tag}</span>
                                            </div>
                                            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-secondary)' }}>{trip.budget}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar - Accommodation Preferences */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Price Per Night */}
                            <motion.div variants={itemVariants} style={cardStyle}>
                                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>Price per night</h4>
                                <input
                                    type="range" name="pricePerNight" min="50" max="1000" step="25" value={formData.pricePerNight} onChange={handleChange}
                                    style={{ width: '100%', accentColor: 'var(--color-primary)', height: '6px', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                                    <span>$50</span>
                                    <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>${formData.pricePerNight}</span>
                                    <span>$1000+</span>
                                </div>
                            </motion.div>

                            {/* Star Rating */}
                            <motion.div variants={itemVariants} style={cardStyle}>
                                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>Star Rating</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <label key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', background: formData.starRating === star ? '#f0f9ff' : 'transparent' }}>
                                            <input type="radio" name="starRating" value={star} checked={formData.starRating === star} onChange={(e) => setFormData({ ...formData, starRating: parseInt(e.target.value) })}
                                                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }} />
                                            <span style={{ color: '#fbbf24' }}>{'★'.repeat(star)}{'☆'.repeat(5 - star)}</span>
                                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{star} Star{star > 1 ? 's' : ''}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Amenities */}
                            <motion.div variants={itemVariants} style={cardStyle}>
                                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>Popular Amenities</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {amenitiesList.map((amenity) => (
                                        <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.4rem 0' }}>
                                            <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)}
                                                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px', borderRadius: '4px' }} />
                                            <span style={{ color: '#475569', fontSize: '0.95rem' }}>{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Property Type */}
                            <motion.div variants={itemVariants} style={cardStyle}>
                                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>Property Type</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {propertyTypes.map((type) => (
                                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.4rem 0' }}>
                                            <input type="radio" name="propertyType" value={type.toLowerCase()} checked={formData.propertyType === type.toLowerCase()} onChange={handleChange}
                                                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }} />
                                            <span style={{ color: '#475569', fontSize: '0.95rem' }}>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '12px',
                                color: '#dc2626',
                                textAlign: 'center'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} style={{ marginTop: '2rem' }}>
                        <motion.button
                            whileHover={!loading ? { scale: 1.01, boxShadow: '0 20px 40px -10px rgba(251, 146, 60, 0.3)' } : {}}
                            whileTap={!loading ? { scale: 0.99 } : {}}
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.25rem 2rem',
                                fontSize: '1.15rem',
                                fontWeight: '600',
                                borderRadius: '16px',
                                border: 'none',
                                background: loading
                                    ? '#94a3b8'
                                    : 'linear-gradient(135deg, var(--color-secondary), #f97316)',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                boxShadow: loading ? 'none' : '0 10px 30px -5px rgba(251, 146, 60, 0.25)',
                            }}
                        >
                            {loading ? (
                                <>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        ⏳
                                    </motion.span>
                                    AI is crafting your itinerary...
                                </>
                            ) : (
                                <>
                                    Generate My Perfect Itinerary
                                    <span style={{ fontSize: '1.25rem' }}>✨</span>
                                </>
                            )}
                        </motion.button>
                        {!isAuthenticated && (
                            <p style={{ textAlign: 'center', marginTop: '0.75rem', color: '#64748b', fontSize: '0.9rem' }}>
                                You'll need to sign in to generate trips
                            </p>
                        )}
                    </motion.div>
                </motion.form>
            </div>
        </div>
    );
};

export default Planner;
