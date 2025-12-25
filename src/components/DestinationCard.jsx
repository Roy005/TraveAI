import React from 'react';

const DestinationCard = ({ image, title, location, price, rating }) => {
    return (
        <div
            className="card-hover"
            style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
            }}
        >
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={image}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(255,255,255,0.9)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--color-primary)',
                    }}
                >
                    ★ {rating}
                </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.25rem' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    📍 {location}
                </p>
                <div className="flex-between">
                    <div>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>From</span>
                        <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                            ${price}
                        </p>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DestinationCard;
