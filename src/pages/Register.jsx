import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            navigate('/planner');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        background: 'white',
        transition: 'all 0.2s',
        outline: 'none',
    };

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
            }}
        >
            {/* Background orbs */}
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                transition={{ duration: 18, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '15%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to right, #f97316, #fb923c)',
                    filter: 'blur(100px)',
                    opacity: 0.25,
                }}
            />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '3rem',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#0f172a' }}>Trave</span>
                            <span style={{ color: 'var(--color-secondary)' }}>AI</span>
                        </h1>
                    </Link>
                    <p style={{ color: '#64748b' }}>Create your account to start planning</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            style={inputStyle}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            borderRadius: '12px',
                            border: 'none',
                            background: loading
                                ? '#94a3b8'
                                : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)',
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-secondary)', fontWeight: '600', textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;
