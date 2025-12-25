import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DestinationCard from '../components/DestinationCard';
import kyotoImg from '../assets/images/kyoto.png';

const Destinations = () => {
    const [selectedRegion, setSelectedRegion] = useState('all');

    const trendingDestinations = [
        { id: 1, title: 'Kyoto Ancient Streets', location: 'Kyoto, Japan', price: 1200, rating: 4.9, image: kyotoImg },
        { id: 2, title: 'Santorini Sunset', location: 'Santorini, Greece', price: 1800, rating: 4.8, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600' },
        { id: 3, title: 'Bali Eco Retreat', location: 'Ubud, Bali', price: 850, rating: 4.9, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' },
    ];

    const allDestinations = [
        // Asia
        { id: 4, title: 'Tokyo Neon Nights', location: 'Tokyo, Japan', price: 1400, rating: 4.7, region: 'asia', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
        { id: 5, title: 'Thai Paradise', location: 'Phuket, Thailand', price: 650, rating: 4.6, region: 'asia', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600' },
        { id: 6, title: 'Singapore Skyline', location: 'Singapore', price: 1100, rating: 4.8, region: 'asia', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600' },
        // Europe
        { id: 7, title: 'Paris Romance', location: 'Paris, France', price: 1600, rating: 4.9, region: 'europe', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
        { id: 8, title: 'Barcelona Vibes', location: 'Barcelona, Spain', price: 1200, rating: 4.7, region: 'europe', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600' },
        { id: 9, title: 'Swiss Alps Adventure', location: 'Zermatt, Switzerland', price: 2200, rating: 4.9, region: 'europe', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600' },
        // Americas
        { id: 10, title: 'NYC Urban Escape', location: 'New York, USA', price: 1500, rating: 4.6, region: 'americas', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600' },
        { id: 11, title: 'Machu Picchu Trek', location: 'Cusco, Peru', price: 980, rating: 4.9, region: 'americas', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600' },
        { id: 12, title: 'Rio Carnival', location: 'Rio de Janeiro, Brazil', price: 1100, rating: 4.7, region: 'americas', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600' },
        // Africa & Middle East
        { id: 13, title: 'Safari Dreams', location: 'Serengeti, Tanzania', price: 2800, rating: 4.9, region: 'africa', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600' },
        { id: 14, title: 'Dubai Luxury', location: 'Dubai, UAE', price: 1900, rating: 4.8, region: 'africa', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' },
        { id: 15, title: 'Moroccan Magic', location: 'Marrakech, Morocco', price: 750, rating: 4.7, region: 'africa', image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600' },
        // Oceania
        { id: 16, title: 'Sydney Harbour', location: 'Sydney, Australia', price: 1300, rating: 4.8, region: 'oceania', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600' },
        { id: 17, title: 'New Zealand Adventure', location: 'Queenstown, NZ', price: 1600, rating: 4.9, region: 'oceania', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600' },
        { id: 18, title: 'Fiji Island Escape', location: 'Fiji Islands', price: 2100, rating: 4.8, region: 'oceania', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600' },
    ];

    const regions = [
        { key: 'all', label: '🌍 All Regions' },
        { key: 'asia', label: '🏯 Asia' },
        { key: 'europe', label: '🏰 Europe' },
        { key: 'americas', label: '🗽 Americas' },
        { key: 'africa', label: '🦁 Africa & Middle East' },
        { key: 'oceania', label: '🏝️ Oceania' },
    ];

    const filteredDestinations = selectedRegion === 'all'
        ? allDestinations
        : allDestinations.filter(d => d.region === selectedRegion);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: '6rem', minHeight: '100vh' }}
        >
            {/* Trending Section */}
            <section style={{ padding: '3rem 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <div className="container">
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ color: '#f97316', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🔥 Hot Right Now</span>
                        <h2 style={{ color: 'white', fontSize: '2.5rem', marginTop: '0.5rem' }}>Trending Destinations</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        {trendingDestinations.map((dest, index) => (
                            <motion.div
                                key={dest.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <DestinationCard {...dest} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Destinations */}
            <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Explore the World</h2>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Discover amazing places across all continents</p>
                    </div>

                    {/* Region Filters */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                        {regions.map(region => (
                            <button
                                key={region.key}
                                onClick={() => setSelectedRegion(region.key)}
                                className="btn"
                                style={{
                                    background: selectedRegion === region.key ? 'var(--color-primary)' : 'white',
                                    color: selectedRegion === region.key ? 'white' : 'var(--color-text-primary)',
                                    padding: '0.75rem 1.5rem',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {region.label}
                            </button>
                        ))}
                    </div>

                    {/* Destinations Grid */}
                    <motion.div
                        key={selectedRegion}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
                    >
                        {filteredDestinations.map((dest, index) => (
                            <motion.div
                                key={dest.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <DestinationCard {...dest} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {filteredDestinations.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                            No destinations found for this region.
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default Destinations;
