import express from 'express';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Mock destinations data
const destinations = [
    {
        id: 'tokyo',
        name: 'Tokyo',
        country: 'Japan',
        description: 'A mesmerizing blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        rating: 4.9,
        priceLevel: 3,
        bestTime: 'March-May, Sept-Nov',
        highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Tower', 'Tsukiji Market'],
        vibes: ['culture', 'food', 'nightlife', 'adventure'],
        coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    {
        id: 'paris',
        name: 'Paris',
        country: 'France',
        description: 'The City of Light captivates with its iconic landmarks, world-class cuisine, and romantic ambiance.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        rating: 4.8,
        priceLevel: 4,
        bestTime: 'April-June, Sept-Oct',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre'],
        vibes: ['culture', 'food', 'relaxation'],
        coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    {
        id: 'bali',
        name: 'Bali',
        country: 'Indonesia',
        description: 'A tropical paradise known for lush rice terraces, ancient temples, and stunning beaches.',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        rating: 4.9,
        priceLevel: 2,
        bestTime: 'April-October',
        highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
        vibes: ['relaxation', 'nature', 'culture', 'adventure'],
        coordinates: { lat: -8.3405, lng: 115.0920 }
    },
    {
        id: 'santorini',
        name: 'Santorini',
        country: 'Greece',
        description: 'Famous for dramatic views, stunning sunsets, and distinctive blue-domed churches.',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
        rating: 4.8,
        priceLevel: 4,
        bestTime: 'April-October',
        highlights: ['Oia Sunset', 'Red Beach', 'Ancient Thera', 'Wine Tasting'],
        vibes: ['relaxation', 'food', 'culture'],
        coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    {
        id: 'new-york',
        name: 'New York City',
        country: 'United States',
        description: 'The city that never sleeps offers world-famous attractions, diverse neighborhoods, and endless entertainment.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
        rating: 4.7,
        priceLevel: 4,
        bestTime: 'April-June, Sept-Nov',
        highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Broadway'],
        vibes: ['culture', 'food', 'nightlife', 'adventure'],
        coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
        id: 'dubai',
        name: 'Dubai',
        country: 'UAE',
        description: 'A futuristic city of superlatives featuring the world\'s tallest building and luxury experiences.',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        rating: 4.6,
        priceLevel: 5,
        bestTime: 'November-March',
        highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari'],
        vibes: ['adventure', 'nightlife', 'relaxation'],
        coordinates: { lat: 25.2048, lng: 55.2708 }
    },
    {
        id: 'kyoto',
        name: 'Kyoto',
        country: 'Japan',
        description: 'Japan\'s cultural heart, home to countless temples, traditional gardens, and geisha districts.',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        rating: 4.9,
        priceLevel: 3,
        bestTime: 'March-May, Oct-Nov',
        highlights: ['Fushimi Inari', 'Kinkaku-ji', 'Arashiyama Bamboo', 'Gion District'],
        vibes: ['culture', 'relaxation', 'nature'],
        coordinates: { lat: 35.0116, lng: 135.7681 }
    },
    {
        id: 'swiss-alps',
        name: 'Swiss Alps',
        country: 'Switzerland',
        description: 'Breathtaking mountain scenery with world-class skiing, hiking, and charming alpine villages.',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
        rating: 4.9,
        priceLevel: 5,
        bestTime: 'Dec-March (ski), June-Sept (hiking)',
        highlights: ['Matterhorn', 'Jungfraujoch', 'Lake Geneva', 'Zermatt'],
        vibes: ['adventure', 'nature', 'relaxation'],
        coordinates: { lat: 46.8182, lng: 8.2275 }
    }
];

// @route   GET /api/destinations
// @desc    Get all destinations with optional filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { vibes, priceLevel, search, limit = 20 } = req.query;

        let filtered = [...destinations];

        // Filter by vibes
        if (vibes) {
            const vibeArray = vibes.split(',');
            filtered = filtered.filter(d =>
                vibeArray.some(v => d.vibes.includes(v))
            );
        }

        // Filter by price level
        if (priceLevel) {
            filtered = filtered.filter(d => d.priceLevel <= parseInt(priceLevel));
        }

        // Search by name or country
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(d =>
                d.name.toLowerCase().includes(searchLower) ||
                d.country.toLowerCase().includes(searchLower)
            );
        }

        // Limit results
        filtered = filtered.slice(0, parseInt(limit));

        res.json({
            success: true,
            count: filtered.length,
            destinations: filtered
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to fetch destinations'
        });
    }
});

// @route   GET /api/destinations/:id
// @desc    Get single destination details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const destination = destinations.find(d => d.id === req.params.id);

        if (!destination) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Destination not found'
            });
        }

        res.json({
            success: true,
            destination
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to fetch destination'
        });
    }
});

export default router;
