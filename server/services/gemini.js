import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateTripItinerary = async (tripDetails) => {
    const {
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        vibes,
        accommodation
    } = tripDetails;

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Format vibes for prompt
    const vibesText = vibes && vibes.length > 0
        ? vibes.join(', ')
        : 'balanced mix of culture, relaxation, and adventure';

    // Format accommodation preferences
    const accommodationText = accommodation
        ? `${accommodation.starRating || 4}-star ${accommodation.type || 'hotel'}, max $${accommodation.pricePerNight || 200}/night`
        : '4-star hotel';

    const prompt = `You are an expert travel planner. Create a detailed day-by-day travel itinerary in JSON format.

TRIP DETAILS:
- Destination: ${destination}
- Duration: ${days} days (${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()})
- Travelers: ${travelers} ${travelers === 1 ? 'person' : 'people'}
- Total Budget: $${budget} USD
- Travel Vibes: ${vibesText}
- Accommodation: ${accommodationText}

REQUIREMENTS:
1. Create a realistic, practical itinerary that fits the budget
2. Include specific times, locations, and estimated costs for each activity
3. Mix activities based on the travel vibes
4. Include meal recommendations
5. Account for travel time between locations
6. Provide coordinates for each location for map integration

RESPOND WITH ONLY VALID JSON in this exact format:
{
    "tripName": "Creative trip name",
    "summary": "2-3 sentence trip summary",
    "days": [
        {
            "day": 1,
            "date": "YYYY-MM-DD",
            "title": "Theme for the day",
            "activities": [
                {
                    "time": "9:00 AM",
                    "activity": "Activity name",
                    "location": "Specific location/address",
                    "description": "Brief description",
                    "cost": 0,
                    "duration": "2 hours",
                    "category": "sightseeing|food|adventure|culture|relaxation|shopping|transport",
                    "coordinates": { "lat": 0.0, "lng": 0.0 }
                }
            ]
        }
    ],
    "highlights": ["Top highlight 1", "Top highlight 2", "Top highlight 3"],
    "packingList": ["Item 1", "Item 2", "Item 3"],
    "tips": ["Local tip 1", "Travel tip 2"],
    "totalEstimatedCost": 0
}`;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response (handle markdown code blocks)
        let jsonString = text;
        if (text.includes('```json')) {
            jsonString = text.split('```json')[1].split('```')[0];
        } else if (text.includes('```')) {
            jsonString = text.split('```')[1].split('```')[0];
        }

        // Parse JSON
        const itinerary = JSON.parse(jsonString.trim());

        return {
            success: true,
            itinerary
        };
    } catch (error) {
        console.error('Gemini API Error:', error);

        // Return a fallback if API fails
        if (error.message.includes('API key')) {
            return {
                success: false,
                error: 'Invalid or missing Gemini API key. Please check your .env file.',
                fallback: generateFallbackItinerary(tripDetails, days)
            };
        }

        return {
            success: false,
            error: error.message,
            fallback: generateFallbackItinerary(tripDetails, days)
        };
    }
};

// Fallback itinerary generator when API fails
const generateFallbackItinerary = (tripDetails, days) => {
    const { destination, startDate, budget, travelers } = tripDetails;

    const daysArray = [];
    const start = new Date(startDate);

    for (let i = 0; i < days; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);

        daysArray.push({
            day: i + 1,
            date: date.toISOString().split('T')[0],
            title: i === 0 ? 'Arrival & Exploration' : i === days - 1 ? 'Final Day & Departure' : `Day ${i + 1} Adventure`,
            activities: [
                {
                    time: '9:00 AM',
                    activity: 'Morning exploration',
                    location: `${destination} city center`,
                    description: 'Explore the local area and get oriented',
                    cost: 0,
                    duration: '2 hours',
                    category: 'sightseeing',
                    coordinates: { lat: 0, lng: 0 }
                },
                {
                    time: '12:00 PM',
                    activity: 'Local lunch',
                    location: 'Local restaurant',
                    description: 'Try local cuisine',
                    cost: Math.round(budget / days / travelers / 3),
                    duration: '1.5 hours',
                    category: 'food',
                    coordinates: { lat: 0, lng: 0 }
                },
                {
                    time: '2:00 PM',
                    activity: 'Afternoon attraction',
                    location: `Popular ${destination} attraction`,
                    description: 'Visit a must-see location',
                    cost: Math.round(budget / days / travelers / 4),
                    duration: '3 hours',
                    category: 'culture',
                    coordinates: { lat: 0, lng: 0 }
                },
                {
                    time: '7:00 PM',
                    activity: 'Dinner',
                    location: 'Recommended restaurant',
                    description: 'Evening dining experience',
                    cost: Math.round(budget / days / travelers / 2.5),
                    duration: '2 hours',
                    category: 'food',
                    coordinates: { lat: 0, lng: 0 }
                }
            ]
        });
    }

    return {
        tripName: `${destination} Adventure`,
        summary: `A ${days}-day trip to ${destination} with a budget of $${budget}. This is a generated fallback itinerary - please add your Gemini API key for personalized AI planning.`,
        days: daysArray,
        highlights: [
            `Explore ${destination}'s iconic landmarks`,
            'Experience local cuisine and culture',
            'Create unforgettable memories'
        ],
        packingList: [
            'Comfortable walking shoes',
            'Weather-appropriate clothing',
            'Travel documents',
            'Phone charger and adapter'
        ],
        tips: [
            'Book accommodations in advance',
            'Learn a few local phrases',
            'Keep copies of important documents'
        ],
        totalEstimatedCost: budget
    };
};

export default { generateTripItinerary };
