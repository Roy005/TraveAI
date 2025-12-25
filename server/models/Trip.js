import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    time: String,
    activity: String,
    location: String,
    description: String,
    cost: {
        type: Number,
        default: 0
    },
    duration: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    category: {
        type: String,
        enum: ['sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'transport', 'other'],
        default: 'other'
    }
}, { _id: false });

const daySchema = new mongoose.Schema({
    day: Number,
    date: Date,
    title: String,
    activities: [activitySchema]
}, { _id: false });

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: [true, 'Destination is required']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    travelers: {
        type: Number,
        default: 1,
        min: 1
    },
    budget: {
        type: Number,
        required: true
    },
    vibes: [{
        type: String
    }],
    accommodation: {
        type: {
            type: String,
            enum: ['hotel', 'resort', 'apartment', 'villa', 'hostel', 'boutique'],
            default: 'hotel'
        },
        starRating: {
            type: Number,
            min: 1,
            max: 5,
            default: 4
        },
        pricePerNight: Number,
        amenities: [String]
    },
    itinerary: {
        tripName: String,
        summary: String,
        days: [daySchema],
        highlights: [String],
        packingList: [String],
        tips: [String],
        totalEstimatedCost: Number
    },
    status: {
        type: String,
        enum: ['draft', 'planned', 'ongoing', 'completed', 'cancelled'],
        default: 'planned'
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient querying
tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ destination: 'text' });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
