import React from 'react';
import Hero from '../components/Hero';
import DestinationCard from '../components/DestinationCard';
import kyotoImg from '../assets/images/kyoto.png';
import { motion } from 'framer-motion';

const Home = () => {
    const destinations = [
        {
            id: 1,
            title: 'Kyoto Ancient Streets',
            location: 'Kyoto, Japan',
            price: 1200,
            rating: 4.9,
            image: kyotoImg,
        },
        {
            id: 2,
            title: 'Santorini Sunset',
            location: 'Santorini, Greece',
            price: 1800,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2938&auto=format&fit=crop',
        },
        {
            id: 3,
            title: 'Bali Eco Retreat',
            location: 'Ubud, Bali',
            price: 850,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2838&auto=format&fit=crop',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />
            <section id="destinations" style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div className="flex-between" style={{ marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '0.5rem' }}>Trending Destinations</h2>
                            <p style={{ color: '#64748b' }}>Curated places just for you.</p>
                        </div>
                        <button style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            View All →
                        </button>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem',
                        }}
                    >
                        {destinations.map((dest) => (
                            <DestinationCard key={dest.id} {...dest} />
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" style={{ padding: '6rem 0', background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Reimagining Travel</h2>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: '1.8' }}>
                            Our mission is to make the world accessible to everyone through the power of artificial intelligence.
                            We believe that travel planning should be as effortless as the trip itself.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        textAlign: 'center'
                    }}>
                        {[
                            { label: 'Trips Planned', value: '10k+' },
                            { label: 'Happy Travelers', value: '50k+' },
                            { label: 'Destinations', value: '120+' },
                            { label: 'AI Accuracy', value: '99%' }
                        ].map((stat, index) => (
                            <div key={index} style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>{stat.value}</div>
                                <div style={{ fontWeight: '600', color: '#475569' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </motion.div>
    );
};

export default Home;
