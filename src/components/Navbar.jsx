import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Pages with dark hero headers
    const darkHeaderPages = ['/', '/bookings', '/results'];
    const hasDarkHeader = darkHeaderPages.includes(location.pathname);

    const getLinkColor = () => {
        if (scrolled) return '#1e293b';
        if (hasDarkHeader) return 'white';
        return '#1e293b';
    };

    const navTextColor = getLinkColor();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Destinations', path: '/destinations' },
        { name: 'Planner', path: '/planner' },
        { name: 'Explorer', path: '/explorer' },
        { name: 'Bookings', path: '/bookings' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
                position: 'fixed',
                top: scrolled ? '10px' : '15px',
                left: scrolled ? '20px' : '30px',
                right: scrolled ? '20px' : '30px',
                zIndex: 1000,
                transition: 'top 0.5s ease, left 0.5s ease, right 0.5s ease, background 0.5s ease, box-shadow 0.5s ease, border 0.5s ease, border-radius 0.5s ease, padding 0.5s ease',
                background: scrolled
                    ? 'rgba(255, 255, 255, 0.85)'
                    : (hasDarkHeader ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.7)'),
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: scrolled ? '16px' : '20px',
                padding: scrolled ? '0.75rem 1.5rem' : '1rem 2rem',
                boxShadow: scrolled
                    ? '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
                    : (hasDarkHeader ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.05)'),
                border: scrolled
                    ? '1px solid rgba(255, 255, 255, 0.8)'
                    : (hasDarkHeader ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.05)'),
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Link
                    to="/"
                    style={{
                        fontSize: '1.6rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        textDecoration: 'none',
                        letterSpacing: '-0.5px',
                    }}
                >
                    <span style={{
                        color: navTextColor,
                        transition: 'color 0.3s',
                    }}>Trave</span>
                    <span style={{
                        background: 'linear-gradient(135deg, var(--color-secondary), #f97316)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>AI</span>
                </Link>

                {/* Navigation Links */}
                <ul style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                }}>
                    {navLinks.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    style={{
                                        position: 'relative',
                                        color: isActive
                                            ? (scrolled ? 'var(--color-primary)' : (hasDarkHeader ? 'white' : 'var(--color-primary)'))
                                            : navTextColor,
                                        fontWeight: isActive ? '600' : '500',
                                        fontSize: '0.9rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        display: 'block',
                                        background: isActive
                                            ? (scrolled ? 'rgba(14, 165, 233, 0.1)' : (hasDarkHeader ? 'rgba(255,255,255,0.15)' : 'rgba(14, 165, 233, 0.1)'))
                                            : 'transparent',
                                    }}
                                    onMouseOver={(e) => {
                                        if (!isActive) {
                                            e.target.style.background = scrolled
                                                ? 'rgba(0, 0, 0, 0.05)'
                                                : (hasDarkHeader ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.05)');
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!isActive) {
                                            e.target.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Right Section - CTA + Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(251, 146, 60, 0.35)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/planner')}
                        style={{
                            background: 'linear-gradient(135deg, var(--color-secondary), #f97316)',
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                        }}
                    >
                        <span>✨</span> Start Planning
                    </motion.button>

                    {/* Profile Icon */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: scrolled
                                ? 'linear-gradient(135deg, #e0f2fe, #bae6fd)'
                                : (hasDarkHeader ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #e0f2fe, #bae6fd)'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: scrolled
                                ? '2px solid #0ea5e9'
                                : (hasDarkHeader ? '2px solid rgba(255,255,255,0.3)' : '2px solid #0ea5e9'),
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={scrolled ? '#0ea5e9' : (hasDarkHeader ? 'white' : '#0ea5e9')}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ transition: 'stroke 0.3s ease' }}
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
