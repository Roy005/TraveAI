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
        console.log('🔄 Generating itinerary for:', destination);
        const aiResult = await generateTripItinerary({
            destination,
            startDate,
            endDate,
            travelers: travelers || 1,
            budget,
            vibes: vibes || [],
            accommodation
        });

        const aiSource = aiResult.source || 'unknown';
        console.log('📊 AI Result:', {
            success: aiResult.success,
            source: aiSource,
            hasItinerary: !!aiResult.itinerary,
            hasFallback: !!aiResult.fallback,
            model: aiResult.model || 'N/A',
            error: aiResult.error || 'none'
        });

        // Get itinerary (either from AI or fallback)
        let itinerary = aiResult.success ? aiResult.itinerary : aiResult.fallback;

        // Sanitize categories to valid enum values
        const validCategories = ['sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'transport', 'nightlife', 'nature', 'entertainment', 'wellness', 'market', 'museum', 'landmark', 'beach', 'temple', 'historical', 'photography', 'dining', 'breakfast', 'lunch', 'dinner', 'cafe', 'bar', 'activity', 'tour', 'other'];

        if (itinerary && itinerary.days) {
            itinerary.days = itinerary.days.map(day => ({
                ...day,
                activities: (day.activities || []).map(activity => ({
                    ...activity,
                    category: validCategories.includes(activity.category?.toLowerCase())
                        ? activity.category.toLowerCase()
                        : 'other'
                }))
            }));
        }

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

        // Build response message based on AI source
        const sourceMessages = {
            gemini: 'AI-generated itinerary created successfully (via Gemini)',
            openrouter: `AI-generated itinerary created successfully (via OpenRouter: ${aiResult.model || 'free model'})`,
            fallback: 'Static fallback itinerary created (all AI providers unavailable)',
        };

        res.status(201).json({
            success: true,
            aiGenerated: aiResult.success,
            aiSource: aiSource,
            message: sourceMessages[aiSource] || 'Itinerary created',
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
        console.error('Error stack:', error.stack);
        res.status(500).json({
            error: 'Server error',
            message: error.message || 'Failed to generate trip',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
