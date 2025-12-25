import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import L from 'leaflet';

// Fix for default Leaflet marker icons not displaying in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map re-centering
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 14);
        }
    }, [center, map]);
    return null;
};

// Haversine formula to calculate distance between two coordinates in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

const Explorer = () => {
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        priceRange: 4,
        rating: 0,
        distance: 50,
        quick: {
            openNow: false,
            freeEntry: false,
            familyFriendly: false,
            topRated: false
        }
    });
    const [userLocation, setUserLocation] = useState(null);
    const [recenterTrigger, setRecenterTrigger] = useState(0);

    // Mock User Location (Kyoto Station) for initial load if geolocation fails/is pending
    // Real geolocation will override this if successful
    const defaultLocation = [34.9858, 135.7588];

    const findMyPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                    setRecenterTrigger(prev => prev + 1);
                },
                (error) => {
                    alert('Unable to get your location. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    const categories = [
        { id: 'all', label: 'All', icon: '🌐' },
        { id: 'attractions', label: 'Attractions', icon: '🏛️' },
        { id: 'food', label: 'Food & Drink', icon: '🍜' },
        { id: 'accommodation', label: 'Hotels', icon: '🏨' },
        { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    ];

    const locations = [
        { id: 1, name: 'Kyoto Imperial Palace', type: 'attractions', position: [35.0254, 135.7621], desc: 'Historic royal residence with gardens.', rating: 4.8, price: 2, openNow: true, freeEntry: true, familyFriendly: true },
        { id: 2, name: 'Kinkaku-ji Temple', type: 'attractions', position: [35.0394, 135.7292], desc: 'Famous golden pavilion.', rating: 4.9, price: 2, openNow: true, freeEntry: false, familyFriendly: true },
        { id: 3, name: 'Fushimi Inari Shrine', type: 'attractions', position: [34.9671, 135.7727], desc: 'Iconic torii gates trail.', rating: 4.9, price: 1, openNow: true, freeEntry: true, familyFriendly: true },
        { id: 4, name: 'Nishiki Market', type: 'food', position: [35.0050, 135.7649], desc: 'Kyoto\'s kitchen. Great street food.', rating: 4.6, price: 2, openNow: true, freeEntry: true, familyFriendly: true },
        { id: 5, name: 'Pontocho Alley', type: 'food', position: [35.0063, 135.7708], desc: 'Atmospheric dining by the river.', rating: 4.7, price: 3, openNow: false, freeEntry: false, familyFriendly: false },
        { id: 6, name: 'Arashiyama Bamboo Grove', type: 'attractions', position: [35.0116, 135.6668], desc: 'Soaring bamboo forest.', rating: 4.8, price: 1, openNow: true, freeEntry: true, familyFriendly: true },
        { id: 7, name: 'Ritz-Carlton Kyoto', type: 'accommodation', position: [35.0145, 135.7705], desc: 'Luxury riverside hotel.', rating: 4.9, price: 4, openNow: true, freeEntry: false, familyFriendly: true },
        { id: 8, name: 'Gion Corner', type: 'shopping', position: [35.0023, 135.7736], desc: 'Traditional crafts & souvenirs.', rating: 4.3, price: 2, openNow: true, freeEntry: true, familyFriendly: true },
    ];

    useEffect(() => {
        // Try to get user location on load
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.log("Using default location");
                    setUserLocation(defaultLocation);
                }
            );
        } else {
            setUserLocation(defaultLocation);
        }
    }, []);

    const filteredLocations = locations.filter(loc => {
        // Category Filter
        if (filters.category !== 'all' && loc.type !== filters.category) return false;

        // Search Filter
        if (filters.search && !loc.name.toLowerCase().includes(filters.search.toLowerCase())) return false;

        // Rating Filter
        if (filters.rating > 0 && loc.rating < filters.rating) return false;

        // Price Range Filter
        if (loc.price > filters.priceRange) return false;

        // Distance Filter
        if (userLocation) {
            const dist = calculateDistance(userLocation[0], userLocation[1], loc.position[0], loc.position[1]);
            if (dist > filters.distance) return false;
        }

        // Quick Filters
        if (filters.quick.openNow && !loc.openNow) return false;
        if (filters.quick.freeEntry && !loc.freeEntry) return false;
        if (filters.quick.familyFriendly && !loc.familyFriendly) return false;
        if (filters.quick.topRated && loc.rating < 4.8) return false;

        return true;
    });

    const handleQuickFilterChange = (key) => {
        setFilters(prev => ({
            ...prev,
            quick: {
                ...prev.quick,
                [key]: !prev.quick[key]
            }
        }));
    };

    return (
        <div style={{ paddingTop: '5rem', height: '100vh', display: 'flex', background: '#f8fafc' }}>
            {/* Left Sidebar - Filters */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ width: '320px', padding: '1.5rem', overflowY: 'auto', background: 'white', borderRight: '1px solid #e2e8f0' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#0f172a' }}>Filter Discovery</h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Find your perfect spot</p>
                    </div>
                    {filteredLocations.length > 0 && (
                        <span style={{ background: '#eff6ff', color: 'var(--color-primary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600' }}>
                            {filteredLocations.length} results
                        </span>
                    )}
                </div>

                {/* Search */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="e.g., 'Temple' or 'Pizza'"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem 0.875rem 2.75rem',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.95rem',
                                background: '#f8fafc',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#475569' }}>Categories</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilters({ ...filters, category: cat.id })}
                                style={{
                                    padding: '0.5rem 0.875rem',
                                    borderRadius: '50px',
                                    border: filters.category === cat.id ? 'none' : '1px solid #e2e8f0',
                                    background: filters.category === cat.id ? 'var(--color-primary)' : 'white',
                                    color: filters.category === cat.id ? 'white' : '#64748b',
                                    fontWeight: '500',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    transition: 'all 0.2s',
                                    boxShadow: filters.category === cat.id ? '0 4px 12px rgba(14, 165, 233, 0.25)' : 'none'
                                }}
                            >
                                <span>{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#f1f5f9', margin: '1.5rem 0' }} />

                {/* Price Range */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>Price Range</h3>
                        <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>{'$'.repeat(filters.priceRange)}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="4"
                        value={filters.priceRange}
                        onChange={(e) => setFilters({ ...filters, priceRange: parseInt(e.target.value) })}
                        style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer', height: '6px', borderRadius: '5px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                        <span>Budget</span>
                        <span>Luxury</span>
                    </div>
                </div>

                {/* Rating */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#475569' }}>Minimum Rating</h3>
                    <div style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '12px', justifyContent: 'center' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onClick={() => setFilters({ ...filters, rating: star === filters.rating ? 0 : star })}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.75rem',
                                    cursor: 'pointer',
                                    color: star <= filters.rating ? '#fbbf24' : '#e2e8f0',
                                    transition: 'transform 0.1s',
                                    padding: '0 0.1rem'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* Distance */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>Distance Radius</h3>
                        <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>{filters.distance} km</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={filters.distance}
                        onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                        style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer', height: '6px', borderRadius: '5px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                        <span>1 km</span>
                        <span>50 km</span>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#f1f5f9', margin: '1.5rem 0' }} />

                {/* Quick Filters */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#475569' }}>Quick Filters</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            { id: 'openNow', label: 'Open Now' },
                            { id: 'freeEntry', label: 'Free Entry' },
                            { id: 'familyFriendly', label: 'Family Friendly' },
                            { id: 'topRated', label: 'Top Rated (4.8+)' }
                        ].map((filter) => (
                            <label key={filter.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s', background: filters.quick[filter.id] ? '#f0f9ff' : 'transparent' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '6px',
                                    border: filters.quick[filter.id] ? 'none' : '2px solid #cbd5e1',
                                    background: filters.quick[filter.id] ? 'var(--color-primary)' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.8rem',
                                    transition: 'all 0.2s'
                                }}>
                                    {filters.quick[filter.id] && '✓'}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={filters.quick[filter.id]}
                                    onChange={() => handleQuickFilterChange(filter.id)}
                                    style={{ display: 'none' }}
                                />
                                <span style={{ color: filters.quick[filter.id] ? '#0f172a' : '#64748b', fontSize: '0.9rem', fontWeight: filters.quick[filter.id] ? '600' : '400' }}>{filter.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Reset Button (Hidden feature for UX) */}
                <button
                    onClick={() => setFilters({
                        search: '',
                        category: 'all',
                        priceRange: 4,
                        rating: 0,
                        distance: 50,
                        quick: {
                            openNow: false,
                            freeEntry: false,
                            familyFriendly: false,
                            topRated: false
                        }
                    })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#f1f5f9',
                        color: '#64748b',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Reset Filters
                </button>
            </motion.div>

            {/* Right - Map */}
            <div style={{ flex: 1, position: 'relative' }}>
                {/* Map Header */}
                <div style={{ position: 'absolute', top: '1rem', left: '4rem', right: '1rem', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🗺️</span> Explorer Map
                        </h1>
                    </div>
                    {userLocation && (
                        <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.2)' }} />
                            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Live Location Active</span>
                        </div>
                    )}
                </div>

                <MapContainer center={defaultLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {userLocation && <RecenterMap center={userLocation} key={recenterTrigger} />}

                    {userLocation && (
                        <Marker position={userLocation}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>You are here</strong>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Exploring around {filters.distance}km</div>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {filteredLocations.map(loc => (
                        <Marker key={loc.id} position={loc.position}>
                            <Popup>
                                <div style={{ minWidth: '180px' }}>
                                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: '700' }}>{loc.name}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            background: loc.type === 'food' ? '#fecaca' : loc.type === 'accommodation' ? '#ddd6fe' : loc.type === 'shopping' ? '#fef3c7' : '#dbeafe',
                                            color: loc.type === 'food' ? '#991b1b' : loc.type === 'accommodation' ? '#5b21b6' : loc.type === 'shopping' ? '#b45309' : '#1e40af',
                                            fontWeight: 'bold',
                                        }}>
                                            {loc.type.toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 'bold' }}>⭐ {loc.rating}</span>
                                        {loc.openNow && <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#166534', fontWeight: '600' }}>OPEN</span>}
                                        {loc.freeEntry && <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#f1f5f9', color: '#475569', fontWeight: '600' }}>FREE</span>}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>{loc.desc}</p>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{'$'.repeat(loc.price)}</span>
                                        <button style={{ padding: '2px 8px', fontSize: '0.8rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Go</button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Find My Position Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={findMyPosition}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        right: '2rem',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'white',
                        border: 'none',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        zIndex: 1000,
                        color: 'var(--color-primary)'
                    }}
                    title="Find my position"
                >
                    📍
                </motion.button>
            </div>
        </div>
    );
};

export default Explorer;
