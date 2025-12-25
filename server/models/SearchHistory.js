import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    searchType: {
        type: String,
        enum: ['destination', 'hotel', 'flight', 'trip'],
        required: true
    },
    query: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    resultCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient querying by user
searchHistorySchema.index({ userId: 1, createdAt: -1 });

// Auto-delete old search history (keep last 100 per user)
searchHistorySchema.statics.cleanupOldHistory = async function (userId) {
    const count = await this.countDocuments({ userId });
    if (count > 100) {
        const toDelete = await this.find({ userId })
            .sort({ createdAt: 1 })
            .limit(count - 100)
            .select('_id');
        await this.deleteMany({ _id: { $in: toDelete.map(d => d._id) } });
    }
};

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

export default SearchHistory;
