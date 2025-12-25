import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripsAPI } from '../utils/api';

const TripHistory = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchTrips();
    }, [isAuthenticated]);

    const fetchTrips = async () => {
        try {
            const data = await tripsAPI.getAll();
            setTrips(data.trips || []);
        } catch (err) {
            setError('Failed to load trips. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;

        try {
            await tripsAPI.delete(id);
            setTrips(trips.filter(t => t.id !== id));
        } catch (err) {
            alert('Failed to delete trip');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            planned: '#3b82f6',
            ongoing: '#10b981',
            completed: '#6b7280',
            cancelled: '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
                    <p style={{ color: '#64748b' }}>Loading your trips...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ minHeight: '100vh', paddingTop: '7rem', paddingBottom: '4rem', background: '#f8fafc' }}
        >
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Trips</h1>
                    <p style={{ color: '#64748b' }}>Your AI-planned adventures</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '2rem'
                    }}>
                        {error}
                    </div>
                )}

                {trips.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
                        <h2 style={{ marginBottom: '0.5rem' }}>No trips yet</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Start planning your first adventure!</p>
                        <Link to="/planner">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '1rem 2rem',
                                    background: 'linear-gradient(135deg, var(--color-secondary), #f97316)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                ✨ Plan a Trip
                            </motion.button>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {trips.map((trip) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem'
                                }}>
                                    🌍
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                            {trip.tripName || trip.destination}
                                        </h3>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: `${getStatusColor(trip.status)}20`,
                                            color: getStatusColor(trip.status)
                                        }}>
                                            {trip.status}
                                        </span>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)} • {trip.travelers} travelers • ${trip.budget} budget
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/results`} state={{ tripId: trip.id }}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'var(--color-primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View
                                        </motion.button>
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => { e.stopPropagation(); handleDelete(trip.id); }}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TripHistory;
