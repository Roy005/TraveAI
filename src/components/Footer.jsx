import React from 'react';

const Footer = () => {
    return (
        <footer style={{ padding: '4rem 0 2rem', background: '#0f172a', color: 'white' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white' }}>Trave</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-secondary)' }}>AI</span>
                        </div>
                        <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '0.95rem' }}>
                            Your AI-powered travel companion. Plan smarter, explore further, adventure awaits.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            {['📧', '🐦', '📸'].map((icon, i) => (
                                <span key={i} style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>{icon}</span>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>Explore</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['Destinations', 'AI Planner', 'Hotel Deals', 'Flight Search'].map(item => (
                                <li key={item}>
                                    <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                        onMouseOver={(e) => e.target.style.color = '#38bdf8'}
                                        onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>Company</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['About Us', 'Our Team', 'Blog', 'Partnerships'].map(item => (
                                <li key={item}>
                                    <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                        onMouseOver={(e) => e.target.style.color = '#38bdf8'}
                                        onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>Help</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['Support Center', 'Privacy Policy', 'Terms of Use', 'Cancellations'].map(item => (
                                <li key={item}>
                                    <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}
                                        onMouseOver={(e) => e.target.style.color = '#38bdf8'}
                                        onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    <span>© 2024 TraveAI. Crafted with ❤️ for explorers.</span>
                    <span>Made with AI • Built for Wanderers</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
