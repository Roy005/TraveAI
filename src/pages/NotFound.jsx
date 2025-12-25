import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Floating Orbs */}
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                    filter: 'blur(120px)',
                    opacity: 0.3,
                }}
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to right, #f97316, #fb923c)',
                    filter: 'blur(120px)',
                    opacity: 0.25,
                }}
            />

            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <span style={{ fontSize: '8rem', display: 'block', marginBottom: '1rem' }}>
                        🧭
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(4rem, 15vw, 10rem)',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem',
                        lineHeight: '1',
                    }}>
                        404
                    </h1>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '1rem',
                    }}>
                        Lost in Paradise?
                    </h2>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: '1.15rem',
                        maxWidth: '500px',
                        margin: '0 auto 2.5rem',
                        lineHeight: '1.7',
                    }}>
                        Looks like this destination doesn't exist on our map.
                        Let's get you back to planning your perfect adventure.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(56, 189, 248, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                🏠 Back to Home
                            </motion.button>
                        </Link>
                        <Link to="/planner">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                ✨ Plan a Trip
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default NotFound;
