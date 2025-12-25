import express from 'express';
import SearchHistory from '../models/SearchHistory.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = express.Router();

// Mock hotel data generator
const generateHotels = (destination, checkIn, checkOut, guests, priceMax, starRating) => {
    const hotelTemplates = [
        { name: 'Grand Luxury Hotel', stars: 5, basePrice: 350, amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'] },
        { name: 'Boutique Inn', stars: 4, basePrice: 180, amenities: ['Free Wi-Fi', 'Breakfast', 'Rooftop Bar'] },
        { name: 'City Center Hotel', stars: 4, basePrice: 150, amenities: ['Pool', 'Gym', 'Restaurant', 'Parking'] },
        { name: 'Seaside Resort', stars: 5, basePrice: 280, amenities: ['Beach Access', 'Pool', 'Spa', 'Water Sports'] },
        { name: 'Budget Comfort Stay', stars: 3, basePrice: 80, amenities: ['Free Wi-Fi', 'Breakfast', 'Parking'] },
        { name: 'Modern Suites', stars: 4, basePrice: 200, amenities: ['Kitchen', 'Gym', 'Laundry', 'Business Center'] },
        { name: 'Heritage Palace', stars: 5, basePrice: 400, amenities: ['Pool', 'Spa', 'Fine Dining', 'Butler Service'] },
        { name: 'Eco Lodge', stars: 3, basePrice: 100, amenities: ['Nature Tours', 'Organic Breakfast', 'Yoga'] }
    ];

    return hotelTemplates
        .filter(h => h.stars >= (starRating || 1))
        .filter(h => h.basePrice <= (priceMax || 1000))
        .map((hotel, index) => ({
            id: `hotel-${index}-${Date.now()}`,
            name: `${destination} ${hotel.name}`,
            stars: hotel.stars,
            pricePerNight: hotel.basePrice + Math.floor(Math.random() * 50),
            totalPrice: (hotel.basePrice + Math.floor(Math.random() * 50)) * Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))),
            rating: (4 + Math.random()).toFixed(1),
            reviews: Math.floor(Math.random() * 2000) + 100,
            amenities: hotel.amenities,
            image: `https://images.unsplash.com/photo-${1566073771259 + index}-6a8ad07f2${index}49?w=400`,
            location: `${destination} City Center`,
            freeCancellation: Math.random() > 0.3,
            breakfast: hotel.amenities.includes('Breakfast')
        }));
};

// Mock flight data generator
const generateFlights = (from, to, departDate, returnDate, passengers, cabinClass) => {
    const airlines = ['SkyWings', 'AeroConnect', 'GlobalAir', 'PremiumJet', 'EcoFly', 'StarAlliance'];
    const classes = { economy: 1, business: 2.5, first: 4 };
    const multiplier = classes[cabinClass] || 1;

    const flights = [];
    const basePrice = 200 + Math.floor(Math.random() * 300);

    for (let i = 0; i < 6; i++) {
        const departHour = 6 + Math.floor(Math.random() * 14);
        const duration = 2 + Math.floor(Math.random() * 10);
        const stops = Math.random() > 0.6 ? Math.floor(Math.random() * 2) + 1 : 0;

        flights.push({
            id: `flight-${i}-${Date.now()}`,
            airline: airlines[i],
            flightNumber: `${airlines[i].substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`,
            from,
            to,
            departureTime: `${departHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            arrivalTime: `${((departHour + duration) % 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            duration: `${duration}h ${Math.floor(Math.random() * 60)}m`,
            stops,
            stopLocations: stops > 0 ? ['Transit Hub'] : [],
            price: Math.floor((basePrice + i * 50) * multiplier * passengers),
            cabinClass: cabinClass || 'economy',
            seatsLeft: Math.floor(Math.random() * 10) + 1,
            baggage: cabinClass === 'economy' ? '1x23kg' : '2x32kg',
            refundable: Math.random() > 0.5
        });
    }

    return flights.sort((a, b) => a.price - b.price);
};

// @route   POST /api/bookings/hotels
// @desc    Search for hotels
// @access  Public (saves history if logged in)
router.post('/hotels', optionalAuth, async (req, res) => {
    try {
        const { destination, checkIn, checkOut, guests, priceMax, starRating } = req.body;

        if (!destination || !checkIn || !checkOut) {
            return res.status(400).json({
                error: 'Validation failed',
                message: 'Please provide destination, check-in, and check-out dates'
            });
        }

        const hotels = generateHotels(destination, checkIn, checkOut, guests, priceMax, starRating);

        // Save to search history if user is logged in
        if (req.user) {
            await SearchHistory.create({
                userId: req.user.id,
                searchType: 'hotel',
                query: { destination, checkIn, checkOut, guests, priceMax, starRating },
                resultCount: hotels.length
            });
        }

        res.json({
            success: true,
            count: hotels.length,
            searchParams: { destination, checkIn, checkOut, guests },
            hotels
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to search hotels'
        });
    }
});

// @route   POST /api/bookings/flights
// @desc    Search for flights
// @access  Public (saves history if logged in)
router.post('/flights', optionalAuth, async (req, res) => {
    try {
        const { from, to, departDate, returnDate, passengers, cabinClass } = req.body;

        if (!from || !to || !departDate) {
            return res.status(400).json({
                error: 'Validation failed',
                message: 'Please provide origin, destination, and departure date'
            });
        }

        const outboundFlights = generateFlights(from, to, departDate, returnDate, passengers || 1, cabinClass);
        let returnFlights = [];

        if (returnDate) {
            returnFlights = generateFlights(to, from, returnDate, null, passengers || 1, cabinClass);
        }

        // Save to search history if user is logged in
        if (req.user) {
            await SearchHistory.create({
                userId: req.user.id,
                searchType: 'flight',
                query: { from, to, departDate, returnDate, passengers, cabinClass },
                resultCount: outboundFlights.length
            });
        }

        res.json({
            success: true,
            searchParams: { from, to, departDate, returnDate, passengers, cabinClass },
            outboundFlights,
            returnFlights: returnDate ? returnFlights : undefined,
            isRoundTrip: !!returnDate
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to search flights'
        });
    }
});

// @route   GET /api/bookings/history
// @desc    Get user's booking search history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const { type, limit = 20 } = req.query;

        const query = { userId: req.user.id };
        if (type) query.searchType = type;

        const history = await SearchHistory.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: history.length,
            history
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to fetch search history'
        });
    }
});

// @route   DELETE /api/bookings/history
// @desc    Clear user's search history
// @access  Private
router.delete('/history', protect, async (req, res) => {
    try {
        await SearchHistory.deleteMany({ userId: req.user.id });

        res.json({
            success: true,
            message: 'Search history cleared'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to clear search history'
        });
    }
});

export default router;
