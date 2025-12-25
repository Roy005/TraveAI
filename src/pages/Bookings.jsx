import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Bookings = () => {
    const [activeTab, setActiveTab] = useState('hotels');
    const [searchData, setSearchData] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        from: '',
        to: '',
        passengers: 1,
        class: 'economy',
    });

    const mockHotels = [
        { id: 1, name: 'Grand Hyatt Tokyo', location: 'Roppongi, Tokyo', price: 320, rating: 4.8, reviews: 2847, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', amenities: ['Pool', 'Spa', 'Gym', 'WiFi'] },
        { id: 2, name: 'The Ritz-Carlton Kyoto', location: 'Kamogawa, Kyoto', price: 580, rating: 4.9, reviews: 1923, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500', amenities: ['Restaurant', 'Spa', 'Bar', 'WiFi'] },
        { id: 3, name: 'Park Hyatt Bali', location: 'Nusa Dua, Bali', price: 420, rating: 4.7, reviews: 3156, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500', amenities: ['Beach', 'Pool', 'Spa', 'Restaurant'] },
        { id: 4, name: 'Four Seasons Maldives', location: 'Baa Atoll, Maldives', price: 890, rating: 4.9, reviews: 1547, image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500', amenities: ['Overwater Villa', 'Diving', 'Spa', 'Private Beach'] },
    ];

    const mockFlights = [
        { id: 1, airline: 'Japan Airlines', logo: '🇯🇵', from: 'NYC', fromFull: 'New York JFK', to: 'TYO', toFull: 'Tokyo Narita', price: 1250, duration: '14h 30m', departure: '10:00 AM', arrival: '2:30 PM +1', stops: 0, class: 'Economy' },
        { id: 2, airline: 'Emirates', logo: '🇦🇪', from: 'NYC', fromFull: 'New York JFK', to: 'DXB', toFull: 'Dubai Intl', price: 980, duration: '12h 45m', departure: '11:30 PM', arrival: '8:15 PM +1', stops: 0, class: 'Economy' },
        { id: 3, airline: 'Singapore Airlines', logo: '🇸🇬', from: 'NYC', fromFull: 'New York JFK', to: 'SIN', toFull: 'Singapore Changi', price: 1180, duration: '18h 20m', departure: '1:00 AM', arrival: '6:20 AM +1', stops: 1, class: 'Economy' },
        { id: 4, airline: 'Cathay Pacific', logo: '🇭🇰', from: 'NYC', fromFull: 'New York JFK', to: 'HKG', toFull: 'Hong Kong Intl', price: 1050, duration: '16h 10m', departure: '6:45 AM', arrival: '11:55 AM +1', stops: 0, class: 'Economy' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ minHeight: '100vh', background: '#f8fafc' }}
        >
            {/* Hero Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
                paddingTop: '7rem',
                paddingBottom: '4rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative elements */}
                <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', marginBottom: '3rem' }}
                    >
                        <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '0.75rem', fontWeight: '800' }}>
                            Book Your <span style={{ color: 'var(--color-secondary)' }}>Journey</span>
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>
                            Find the perfect hotels and flights at unbeatable prices
                        </p>
                    </motion.div>

                    {/* Tab Switcher */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50px',
                            padding: '0.5rem',
                            display: 'flex',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {[
                                { id: 'hotels', label: 'Hotels', icon: '🏨' },
                                { id: 'flights', label: 'Flights', icon: '✈️' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '0.875rem 2.5rem',
                                        borderRadius: '50px',
                                        border: 'none',
                                        background: activeTab === tab.id ? 'white' : 'transparent',
                                        color: activeTab === tab.id ? '#0f172a' : 'white',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <span>{tab.icon}</span> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Card */}
                    <motion.div
                        layout
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2rem',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            maxWidth: '1000px',
                            margin: '0 auto'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {activeTab === 'hotels' ? (
                                <motion.div
                                    key="hotels-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}
                                >
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Destination</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>📍</span>
                                            <input
                                                type="text"
                                                placeholder="Where are you going?"
                                                style={{ width: '100%', padding: '1rem 1rem 1rem 2.75rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', transition: 'border-color 0.2s' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Check-in</label>
                                        <input type="date" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Check-out</label>
                                        <input type="date" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem' }} />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: '1rem 2rem',
                                            background: 'linear-gradient(135deg, var(--color-secondary), #f97316)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.3)',
                                        }}
                                    >
                                        🔍 Search
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="flights-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}
                                >
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>From</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>🛫</span>
                                            <input type="text" placeholder="Departure city" style={{ width: '100%', padding: '1rem 1rem 1rem 2.75rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', marginBottom: '0.5rem' }}>
                                        ⇄
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>To</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>🛬</span>
                                            <input type="text" placeholder="Arrival city" style={{ width: '100%', padding: '1rem 1rem 1rem 2.75rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Departure</label>
                                        <input type="date" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem' }} />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: '1rem 2rem',
                                            background: 'linear-gradient(135deg, var(--color-secondary), #f97316)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.3)',
                                        }}
                                    >
                                        🔍 Search
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container" style={{ padding: '3rem 0 4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: '#0f172a' }}>
                            {activeTab === 'hotels' ? '🏨 Available Hotels' : '✈️ Available Flights'}
                        </h2>
                        <p style={{ color: '#64748b' }}>{activeTab === 'hotels' ? mockHotels.length : mockFlights.length} results found</p>
                    </div>
                    <select style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.95rem', cursor: 'pointer' }}>
                        <option>Sort by: Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Rating</option>
                    </select>
                </div>

                <motion.div
                    key={activeTab}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                    <AnimatePresence mode="wait">
                        {activeTab === 'hotels' ? (
                            mockHotels.map(hotel => (
                                <motion.div
                                    key={hotel.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '280px 1fr',
                                        background: 'white',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        border: '1px solid #f1f5f9',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <div style={{ position: 'relative', height: '220px' }}>
                                        <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', backdropFilter: 'blur(4px)' }}>
                                            ⭐ {hotel.rating}
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#0f172a' }}>{hotel.name}</h3>
                                            <p style={{ color: '#64748b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>📍</span> {hotel.location}
                                            </p>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                                {hotel.amenities.map((amenity, i) => (
                                                    <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>{amenity}</span>
                                                ))}
                                            </div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{hotel.reviews.toLocaleString()} reviews</p>
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '140px' }}>
                                            <div>
                                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>${hotel.price}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>per night</div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                style={{
                                                    padding: '0.875rem 1.5rem',
                                                    background: 'var(--color-primary)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Book Now
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            mockFlights.map(flight => (
                                <motion.div
                                    key={flight.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 2fr 1fr',
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '1.75rem 2rem',
                                        border: '1px solid #f1f5f9',
                                        alignItems: 'center',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {/* Airline */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                            {flight.logo}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#0f172a' }}>{flight.airline}</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{flight.class}</div>
                                        </div>
                                    </div>

                                    {/* Flight Details */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>{flight.departure}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{flight.from}</div>
                                        </div>
                                        <div style={{ flex: 1, maxWidth: '200px', textAlign: 'center' }}>
                                            <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{flight.duration}</div>
                                            <div style={{ position: 'relative', height: '2px', background: '#e2e8f0', borderRadius: '2px' }}>
                                                <div style={{ position: 'absolute', left: 0, top: '-3px', width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }} />
                                                <div style={{ position: 'absolute', right: 0, top: '-3px', width: '8px', height: '8px', background: 'var(--color-secondary)', borderRadius: '50%' }} />
                                            </div>
                                            <div style={{ color: flight.stops === 0 ? '#22c55e' : '#f59e0b', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>
                                                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>{flight.arrival.split(' ')[0]}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{flight.to}</div>
                                        </div>
                                    </div>

                                    {/* Price & Book */}
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>${flight.price}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>round trip</div>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            style={{
                                                padding: '0.875rem 2rem',
                                                background: 'linear-gradient(135deg, var(--color-secondary), #f97316)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 15px rgba(251, 146, 60, 0.25)',
                                            }}
                                        >
                                            Select Flight
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Bookings;
