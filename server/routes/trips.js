import express from 'express';
import Trip from '../models/Trip.js';
import SearchHistory from '../models/SearchHistory.js';
import { protect } from '../middleware/auth.js';
import { generateTripItinerary } from '../services/gemini.js';

const router = express.Router();

// @route   POST /api/trips/generate
// @desc    Generate AI-powered trip itinerary
// @access  Private
router.post('/generate', protect, async (req, res) => {
    try {
        const {
            destination,
            startDate,
            endDate,
            travelers,
            budget,
            vibes,
            accommodation
        } = req.body;

        // Validation
        if (!destination || !startDate || !endDate || !budget) {
            return res.status(400).json({
                error: 'Validation failed',
                message: 'Please provide destination, dates, and budget'
            });
        }

        // Generate itinerary using AI
        const aiResult = await generateTripItinerary({
            destination,
            startDate,
            endDate,
            travelers: travelers || 1,
            budget,
            vibes: vibes || [],
            accommodation
        });

        // Get itinerary (either from AI or fallback)
        const itinerary = aiResult.success ? aiResult.itinerary : aiResult.fallback;

        // Save trip to database
        const trip = await Trip.create({
            userId: req.user.id,
            destination,
            startDate,
            endDate,
            travelers: travelers || 1,
            budget,
            vibes: vibes || [],
            accommodation,
            itinerary,
            status: 'planned'
        });

        // Save to search history
        await SearchHistory.create({
            userId: req.user.id,
            searchType: 'trip',
            query: { destination, startDate, endDate, budget, vibes },
            resultCount: 1
        });

        res.status(201).json({
            success: true,
            aiGenerated: aiResult.success,
            message: aiResult.success
                ? 'AI-generated itinerary created successfully'
                : 'Fallback itinerary created (add Gemini API key for AI features)',
            trip: {
                id: trip._id,
                destination: trip.destination,
                startDate: trip.startDate,
                endDate: trip.endDate,
                travelers: trip.travelers,
                budget: trip.budget,
                vibes: trip.vibes,
                itinerary: trip.itinerary,
                status: trip.status,
                createdAt: trip.createdAt
            }
        });
    } catch (error) {
        console.error('Trip generation error:', error);
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to generate trip'
        });
    }
});

// @route   GET /api/trips
// @desc    Get all trips for current user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, limit = 10, page = 1 } = req.query;

        const query = { userId: req.user.id };
        if (status) query.status = status;

        const trips = await Trip.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-itinerary.days'); // Exclude detailed days for list view

        const total = await Trip.countDocuments(query);

        res.json({
            success: true,
            count: trips.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            trips: trips.map(trip => ({
                id: trip._id,
                destination: trip.destination,
                startDate: trip.startDate,
                endDate: trip.endDate,
                travelers: trip.travelers,
                budget: trip.budget,
                tripName: trip.itinerary?.tripName,
                status: trip.status,
                isFavorite: trip.isFavorite,
                createdAt: trip.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to fetch trips'
        });
    }
});

// @route   GET /api/trips/:id
// @desc    Get single trip details
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to fetch trip'
        });
    }
});

// @route   PUT /api/trips/:id
// @desc    Update trip (status, favorite, etc.)
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { status, isFavorite } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (typeof isFavorite === 'boolean') updateData.isFavorite = isFavorite;

        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updateData,
            { new: true }
        );

        if (!trip) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to update trip'
        });
    }
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            message: 'Trip deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: 'Failed to delete trip'
        });
    }
});

export default router;
