import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div style={{ position: 'relative', height: '90vh', width: '100%', overflow: 'hidden', isolation: 'isolate' }}>
            {/* Background Image */}
            <img
                src="/images/hero.png"
                alt="Travel Background"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    filter: 'brightness(0.9)'
                }}
                onError={(e) => {
                    console.error("Hero image failed to load:", e);
                    e.target.style.display = 'none';
                    e.target.parentNode.style.backgroundColor = '#0f172a';
                }}
            />

            {/* Premium Gradient Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.7) 100%)',
                    zIndex: 1,
                }}
            />

            <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingTop: '4rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span style={{
                        color: '#38bdf8',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        display: 'inline-block',
                        background: 'rgba(15, 23, 42, 0.6)',
                        padding: '0.5rem 1rem',
                        borderRadius: '50px',
                        backdropFilter: 'blur(4px)'
                    }}>
                        AI-Powered Travel
                    </span>
                    <h1 style={{
                        color: 'white',
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        marginBottom: '1.5rem',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        lineHeight: '1.1'
                    }}>
                        Dream. Plan. <span style={{
                            background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Go.</span>
                    </h1>
                    <p style={{
                        color: '#cbd5e1',
                        fontSize: '1.25rem',
                        maxWidth: '600px',
                        margin: '0 auto 3rem',
                        lineHeight: '1.8',
                        fontWeight: '300'
                    }}>
                        Experience the future of travel. Let our AI architect your perfect journey in seconds, not hours.
                    </p>

                    {/* Search / CTA Box */}
                    <div className="glass" style={{
                        padding: '0.75rem',
                        borderRadius: '999px', // Pill shape for search bar
                        display: 'flex',
                        maxWidth: '500px',
                        margin: '0 auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <input
                            type="text"
                            placeholder="Where is your mind wandering?"
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: 'white', // Ensure text is visible on dark overlay inputs if needed, or dark on light glass
                                fontSize: '1.1rem',
                                padding: '0 1.5rem',
                                color: '#0f172a' // Dark text for light glass
                            }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/planner')}
                            style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
                        >
                            Start
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
