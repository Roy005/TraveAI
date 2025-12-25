import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

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

    const dropdownMenuStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.7rem 1rem',
        color: '#1e293b',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'background 0.2s',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        borderRadius: '8px',
    };

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

                {/* Right Section - CTA + Auth Buttons */}
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

                    {/* Auth Buttons / Account Dropdown */}
                    {user ? (
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{
                                    background: 'transparent',
                                    color: navTextColor,
                                    border: scrolled
                                        ? '1px solid rgba(30, 41, 59, 0.2)'
                                        : (hasDarkHeader ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(30, 41, 59, 0.2)'),
                                    padding: '0.6rem',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </motion.button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: 'absolute',
                                            top: scrolled ? 'calc(100% + 24px)' : 'calc(100% + 28px)',
                                            right: scrolled ? '-30px' : '-40px',
                                            width: '220px',
                                            background: scrolled
                                                ? 'rgba(255, 255, 255, 0.85)'
                                                : 'rgba(15, 23, 42, 0.75)',
                                            backdropFilter: 'blur(24px)',
                                            WebkitBackdropFilter: 'blur(24px)',
                                            borderRadius: '16px',
                                            padding: '0.75rem',
                                            boxShadow: scrolled
                                                ? '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
                                                : '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
                                            border: scrolled
                                                ? '1px solid rgba(255, 255, 255, 0.8)'
                                                : '1px solid rgba(255, 255, 255, 0.15)',
                                            overflow: 'hidden',
                                            transition: 'background 0.5s ease, box-shadow 0.5s ease, border 0.5s ease, top 0.5s ease, right 0.5s ease',
                                        }}
                                    >
                                        {/* User Info */}
                                        <div style={{
                                            padding: '0.75rem 1rem',
                                            borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)',
                                            marginBottom: '0.25rem'
                                        }}>
                                            <p style={{ margin: 0, fontWeight: '600', color: scrolled ? '#0f172a' : 'white', fontSize: '0.9rem' }}>
                                                {user?.name || 'User'}
                                            </p>
                                            <p style={{
                                                margin: '0.15rem 0 0',
                                                color: scrolled ? '#64748b' : 'rgba(255,255,255,0.6)',
                                                fontSize: '0.75rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {user?.email}
                                            </p>
                                        </div>

                                        {/* Menu Items */}
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            style={{ ...dropdownMenuStyle, color: scrolled ? '#1e293b' : 'rgba(255,255,255,0.9)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            Profile
                                        </Link>

                                        <Link
                                            to="/trips"
                                            onClick={() => setIsDropdownOpen(false)}
                                            style={{ ...dropdownMenuStyle, color: scrolled ? '#1e293b' : 'rgba(255,255,255,0.9)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            My Trips
                                        </Link>

                                        <div style={{ height: '1px', background: scrolled ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', margin: '0.25rem 0' }} />

                                        <button
                                            onClick={handleLogout}
                                            style={{ ...dropdownMenuStyle, color: '#ef4444' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Link
                                to="/login"
                                style={{
                                    color: navTextColor,
                                    fontWeight: '500',
                                    fontSize: '0.9rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                Login
                            </Link>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Link
                                    to="/register"
                                    style={{
                                        background: scrolled
                                            ? 'rgba(14, 165, 233, 0.1)'
                                            : (hasDarkHeader ? 'rgba(255,255,255,0.15)' : 'rgba(14, 165, 233, 0.1)'),
                                        color: scrolled ? 'var(--color-primary)' : (hasDarkHeader ? 'white' : 'var(--color-primary)'),
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        display: 'inline-block',
                                    }}
                                >
                                    Register
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
