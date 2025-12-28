import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini on each call (ensures new API keys are picked up)
const getGenAI = () => {
    if (process.env.GEMINI_API_KEY) {
        return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return null;
};

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

    // Format vibes for prompt with detailed descriptions
    const vibeDescriptions = {
        'relax': 'spa treatments, scenic walks, beach relaxation, peaceful gardens, yoga sessions',
        'adventure': 'hiking, water sports, zip-lining, mountain climbing, extreme activities',
        'culture': 'museums, historical sites, temples, local traditions, art galleries, heritage walks',
        'food': 'local restaurants, street food tours, cooking classes, food markets, wine/sake tasting',
        'nightlife': 'rooftop bars, clubs, live music venues, night markets, entertainment districts',
        'nature': 'national parks, wildlife, scenic viewpoints, lakes, forests, botanical gardens'
    };

    const vibesText = vibes && vibes.length > 0
        ? vibes.map(v => `${v} (${vibeDescriptions[v] || v})`).join(', ')
        : 'balanced mix of culture, food, and sightseeing';

    // Format accommodation preferences
    const accommodationText = accommodation
        ? `${accommodation.starRating || 4}-star ${accommodation.type || 'hotel'}, max $${accommodation.pricePerNight || 200}/night`
        : '4-star hotel';

    // Calculate daily budget for activities
    const dailyBudget = Math.round(budget / days);
    const perPersonBudget = Math.round(dailyBudget / travelers);

    const prompt = `You are an elite travel planner with deep knowledge of ${destination}. Create a HIGHLY DETAILED, PERSONALIZED day-by-day travel itinerary.

=== TRIP REQUIREMENTS ===
🌍 Destination: ${destination}
📅 Duration: ${days} days (${new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} to ${new Date(endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})
👥 Travelers: ${travelers} ${travelers === 1 ? 'person' : 'people'}
💰 Total Budget: $${budget} USD (~$${dailyBudget}/day, ~$${perPersonBudget}/person/day)
✨ Travel Style: ${vibesText}
🏨 Accommodation: ${accommodationText}

=== CRITICAL REQUIREMENTS ===
1. USE REAL, SPECIFIC PLACE NAMES - Include actual restaurant names, attraction names, street names in ${destination}
2. PERSONALIZE for the travel vibes - If they want "${vibes?.[0] || 'culture'}", focus 60% of activities on that
3. VARY each day - NO repetitive "morning breakfast, afternoon attraction, dinner" patterns
4. Include HIDDEN GEMS - Not just tourist spots, include local favorites
5. REALISTIC TIMING - Account for travel between locations, queues, rest breaks
6. SPECIFIC COSTS - Real prices in USD for each activity
7. UNIQUE EXPERIENCES - Cooking classes, local workshops, sunset spots, photo opportunities

=== EXAMPLE OF WHAT I WANT ===
Instead of: "9:00 AM - Morning exploration of city center"
Write: "9:00 AM - Explore Tsukiji Outer Market - Sample fresh tamagoyaki at Yamacho, try the famous tuna onigiri at Marukichi, grab matcha from Matsuya"

Instead of: "12:00 PM - Local lunch"
Write: "12:00 PM - Lunch at Ichiran Ramen Shibuya - Order the classic tonkotsu with extra noodles, customize spice level at your private booth ($15/person)"

=== GENERATE JSON RESPONSE ===
Respond with ONLY valid JSON (no markdown, no explanation):

{
    "tripName": "Creative, specific name like 'Tokyo: Neon Nights & Ancient Temples' or 'Bali Bliss: Rice Terraces to Beach Sunsets'",
    "summary": "3-4 sentence compelling summary mentioning specific highlights unique to ${destination}",
    "days": [
        {
            "day": 1,
            "date": "${start.toISOString().split('T')[0]}",
            "title": "Specific theme like 'Historic Temples & Street Food Paradise' not generic 'Arrival Day'",
            "activities": [
                {
                    "time": "9:00 AM",
                    "activity": "SPECIFIC activity name with place",
                    "location": "Exact address or well-known landmark name",
                    "description": "Detailed 2-3 sentence description with insider tips, what to order/see, why it's special",
                    "cost": 25,
                    "duration": "2 hours",
                    "category": "sightseeing|food|adventure|culture|relaxation|shopping|transport",
                    "coordinates": { "lat": 35.6762, "lng": 139.6503 },
                    "tips": "Insider tip for this specific activity"
                }
            ]
        }
    ],
    "highlights": ["5 specific must-do experiences with place names"],
    "packingList": ["10+ items specific to ${destination} and the travel vibes"],
    "tips": ["8+ insider tips specific to ${destination} - local customs, money-saving hacks, best times to visit places"],
    "totalEstimatedCost": ${budget},
    "bestPhotoSpots": ["5 Instagram-worthy locations with specific names"],
    "localPhrases": ["5 useful local phrases with pronunciation if applicable"]
}

IMPORTANT: 
- Include 5-7 activities per day, not just 3-4
- Each activity description should be 2-3 sentences with specific details
- Vary the pacing - some slow mornings, some early starts
- Include free activities to balance the budget
- For food activities, mention specific dishes to try`;

    try {
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        console.log('🔑 OpenRouter Key:', openRouterKey ? `${openRouterKey.substring(0, 8)}...${openRouterKey.substring(openRouterKey.length - 4)}` : 'NOT SET');
        console.log('🔑 Gemini Key:', geminiKey ? `${geminiKey.substring(0, 6)}...${geminiKey.substring(geminiKey.length - 4)}` : 'NOT SET');

        // Try OpenRouter first if key is available
        if (openRouterKey) {
            console.log('🔄 Using OpenRouter API...');

            // List of free models to try (in order of preference)
            const models = [
                'mistralai/mistral-small-3.1-24b-instruct:free',
                'meta-llama/llama-3.2-3b-instruct:free',
                'huggingfaceh4/zephyr-7b-beta:free'
            ];

            for (const modelName of models) {
                try {
                    console.log(`📡 Trying model: ${modelName}`);

                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${openRouterKey}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': 'http://localhost:5173',
                            'X-Title': 'TraveAI Travel Planner'
                        },
                        body: JSON.stringify({
                            model: modelName,
                            messages: [
                                {
                                    role: 'user',
                                    content: prompt
                                }
                            ],
                            temperature: 0.8,
                            max_tokens: 8000
                        })
                    });

                    console.log('📡 Response status:', response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`❌ Model ${modelName} failed:`, response.status, errorText);
                        continue; // Try next model
                    }

                    const data = await response.json();
                    console.log('📦 Response received');

                    const text = data.choices?.[0]?.message?.content || '';
                    console.log('📝 Response text length:', text.length);

                    if (!text || text.length < 100) {
                        console.error('❌ Empty or too short response');
                        continue;
                    }

                    // Extract JSON from response
                    let jsonString = text;
                    if (text.includes('```json')) {
                        jsonString = text.split('```json')[1].split('```')[0];
                    } else if (text.includes('```')) {
                        jsonString = text.split('```')[1].split('```')[0];
                    }

                    // Parse JSON
                    const itinerary = JSON.parse(jsonString.trim());
                    console.log('✅ Successfully generated itinerary with', modelName);
                    console.log('✅ Itinerary has', itinerary.days?.length || 0, 'days');

                    return {
                        success: true,
                        itinerary
                    };
                } catch (modelError) {
                    console.error(`❌ Error with model ${modelName}:`, modelError.message);
                    continue; // Try next model
                }
            }

            console.error('❌ All OpenRouter models failed');
        }

        // Fallback to Google AI SDK if OpenRouter fails or no key
        if (geminiKey) {
            console.log('🔄 Falling back to Google Gemini API...');
            const ai = getGenAI();
            if (ai) {
                const model = ai.getGenerativeModel({
                    model: 'gemini-1.5-flash',
                    generationConfig: {
                        temperature: 0.9,
                        maxOutputTokens: 8192,
                    }
                });

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                let jsonString = text;
                if (text.includes('```json')) {
                    jsonString = text.split('```json')[1].split('```')[0];
                } else if (text.includes('```')) {
                    jsonString = text.split('```')[1].split('```')[0];
                }

                const itinerary = JSON.parse(jsonString.trim());
                console.log('✅ Gemini AI generated itinerary');

                return {
                    success: true,
                    itinerary
                };
            }
        }

        throw new Error('No API keys configured or all API calls failed');
    } catch (error) {
        console.error('❌ API Error:', error.message);

        return {
            success: false,
            error: error.message,
            fallback: generateDetailedFallback(tripDetails, days)
        };
    }
};

// Detailed fallback with destination-specific data
const generateDetailedFallback = (tripDetails, days) => {
    const { destination, startDate, budget, travelers, vibes } = tripDetails;
    const normalizedDest = destination.toLowerCase();

    // Destination-specific data
    const destinationData = {
        tokyo: {
            country: 'Japan',
            currency: '¥',
            attractions: [
                { name: 'Senso-ji Temple, Asakusa', category: 'culture', cost: 0, duration: '2 hours', description: 'Tokyo\'s oldest temple with the iconic Thunder Gate. Explore Nakamise shopping street for traditional snacks and souvenirs.', coords: { lat: 35.7148, lng: 139.7967 } },
                { name: 'Shibuya Crossing & Hachiko Statue', category: 'sightseeing', cost: 0, duration: '1.5 hours', description: 'World\'s busiest pedestrian crossing. Get photos from Shibuya Sky or Starbucks overlooking the intersection.', coords: { lat: 35.6595, lng: 139.7004 } },
                { name: 'TeamLab Borderless Digital Art Museum', category: 'culture', cost: 32, duration: '3 hours', description: 'Immersive digital art experience. Wear comfortable shoes and solid colors for best photos.', coords: { lat: 35.6265, lng: 139.7847 } },
                { name: 'Tsukiji Outer Market Food Tour', category: 'food', cost: 45, duration: '2.5 hours', description: 'Sample fresh sushi, tamagoyaki, and Japanese street food. Try the famous tuna auction viewing at 5 AM.', coords: { lat: 35.6654, lng: 139.7706 } },
                { name: 'Meiji Shrine & Harajuku', category: 'culture', cost: 0, duration: '3 hours', description: 'Peaceful Shinto shrine in a forest, then explore colorful Takeshita Street for unique fashion and crepes.', coords: { lat: 35.6764, lng: 139.6993 } },
                { name: 'Shinjuku Golden Gai Night Tour', category: 'nightlife', cost: 40, duration: '3 hours', description: '6 narrow alleys with 200+ tiny bars. Each fits only 6-10 people. Start at Albatross for rooftop views.', coords: { lat: 35.6938, lng: 139.7034 } },
                { name: 'Akihabara Electronics & Anime District', category: 'shopping', cost: 20, duration: '2.5 hours', description: 'Mecca for anime, manga, and electronics. Visit Yodobashi Camera\'s 9 floors of gadgets.', coords: { lat: 35.7022, lng: 139.7744 } },
                { name: 'Ramen Tasting at Ichiran', category: 'food', cost: 15, duration: '1 hour', description: 'Customize your tonkotsu ramen at private booth. Order extra noodles (kaedama) for $2.', coords: { lat: 35.6614, lng: 139.6983 } }
            ],
            restaurants: [
                { name: 'Ichiran Ramen Shibuya', cuisine: 'Ramen', cost: 15, description: 'Legendary tonkotsu ramen in private booths. Customize noodle firmness and spice level.' },
                { name: 'Tsuta Tokyo (Michelin)', cuisine: 'Ramen', cost: 20, description: 'World\'s first Michelin-starred ramen. Get there before 7 AM for tickets.' },
                { name: 'Gonpachi Nishi-Azabu', cuisine: 'Izakaya', cost: 45, description: 'The "Kill Bill" restaurant. Try their handmade soba and yakitori.' },
                { name: 'Sushi Dai at Tsukiji', cuisine: 'Sushi', cost: 35, description: 'Famous omakase breakfast. Arrive at 5 AM to avoid 3-hour waits.' }
            ],
            tips: ['Get a Suica/Pasmo card for trains', 'Bow when entering temples', 'No tipping - it\'s rude', 'Convenience store onigiri is amazing', '7-Eleven ATMs accept foreign cards', 'Download Japan Official Travel App']
        },
        paris: {
            country: 'France',
            currency: '€',
            attractions: [
                { name: 'Eiffel Tower Summit', category: 'sightseeing', cost: 28, duration: '2.5 hours', description: 'Book tickets 2 months ahead. Go at sunset for golden hour photos. The champagne bar on top is worth it.', coords: { lat: 48.8584, lng: 2.2945 } },
                { name: 'Louvre Museum (Mona Lisa route)', category: 'culture', cost: 17, duration: '4 hours', description: 'Enter via Carrousel entrance to skip lines. See Mona Lisa first at 9 AM, then Venus de Milo and Winged Victory.', coords: { lat: 48.8606, lng: 2.3376 } },
                { name: 'Montmartre & Sacré-Cœur', category: 'culture', cost: 0, duration: '3 hours', description: 'Climb 270 steps for best Paris views. Watch artists at Place du Tertre, visit Dalí museum.', coords: { lat: 48.8867, lng: 2.3431 } },
                { name: 'Seine River Dinner Cruise', category: 'food', cost: 95, duration: '2.5 hours', description: 'Bateaux Mouches offers 4-course French dinner passing illuminated monuments. Book window seats.', coords: { lat: 48.8640, lng: 2.3055 } },
                { name: 'Le Marais Jewish Quarter Walk', category: 'culture', cost: 0, duration: '2 hours', description: 'Historic district with best falafel at L\'As du Fallafel, vintage shopping, and LGBTQ+ scene.', coords: { lat: 48.8566, lng: 2.3617 } },
                { name: 'Palace of Versailles Day Trip', category: 'culture', cost: 20, duration: '6 hours', description: 'Take RER C train (40 min). Visit Hall of Mirrors and Marie Antoinette\'s Estate. Gardens free on foot.', coords: { lat: 48.8049, lng: 2.1204 } }
            ],
            restaurants: [
                { name: 'Le Comptoir du Panthéon', cuisine: 'French Bistro', cost: 35, description: 'Classic French with view of Panthéon. Try the duck confit.' },
                { name: 'L\'As du Fallafel, Le Marais', cuisine: 'Middle Eastern', cost: 12, description: 'Best falafel in Paris. Expect long lines but worth it.' },
                { name: 'Café de Flore', cuisine: 'French Café', cost: 25, description: 'Legendary café where Sartre wrote. Hot chocolate is famous.' }
            ],
            tips: ['Museum Pass saves money for 2+ days', 'Metro tickets come in packs of 10', 'Say "Bonjour" when entering any shop', 'Tip is included but round up', 'Stores closed on Sundays']
        },
        bali: {
            country: 'Indonesia',
            currency: 'IDR',
            attractions: [
                { name: 'Tegallalang Rice Terraces', category: 'nature', cost: 5, duration: '2.5 hours', description: 'Iconic cascading rice paddies. Go before 9 AM to avoid crowds. Swing photos cost $20.', coords: { lat: -8.4312, lng: 115.2792 } },
                { name: 'Uluwatu Temple Sunset & Kecak Dance', category: 'culture', cost: 15, duration: '3 hours', description: 'Clifftop temple with dramatic sunset views. Kecak fire dance at 6 PM is unmissable.', coords: { lat: -8.8291, lng: 115.0849 } },
                { name: 'Mount Batur Sunrise Trek', category: 'adventure', cost: 45, duration: '6 hours', description: 'Start at 2 AM, reach summit for sunrise over crater lake. Breakfast eggs cooked by volcanic steam.', coords: { lat: -8.2394, lng: 115.3753 } },
                { name: 'Ubud Sacred Monkey Forest', category: 'nature', cost: 8, duration: '2 hours', description: '700+ macaques in ancient temple forest. Hide your belongings - monkeys are thieves!', coords: { lat: -8.5183, lng: 115.2588 } },
                { name: 'Seminyak Beach Club Day', category: 'relaxation', cost: 50, duration: '5 hours', description: 'Potato Head Beach Club for infinity pool, cocktails, and sunset. Minimum spend $30.', coords: { lat: -8.6852, lng: 115.1565 } },
                { name: 'Balinese Cooking Class in Ubud', category: 'food', cost: 35, duration: '4 hours', description: 'Morning market visit, then cook 9 dishes including satay and nasi goreng. Take recipes home.', coords: { lat: -8.5069, lng: 115.2625 } }
            ],
            restaurants: [
                { name: 'Locavore, Ubud', cuisine: 'Modern Indonesian', cost: 150, description: 'Asia\'s 50 Best. Tasting menu uses only local ingredients.' },
                { name: 'Warung Babi Guling Ibu Oka', cuisine: 'Balinese', cost: 8, description: 'Anthony Bourdain\'s favorite. Suckling pig is legendary.' },
                { name: 'La Laguna Beach Club', cuisine: 'Mediterranean', cost: 40, description: 'Bohemian beach club with swings and sunset views.' }
            ],
            tips: ['Rent a scooter ($5/day) or hire a driver ($40/day)', 'Bargain at markets - start at 50% of asking', 'Cover shoulders/knees at temples', 'Avoid tap water', 'Best dry season is April-October']
        },
        london: {
            country: 'United Kingdom',
            currency: '£',
            attractions: [
                { name: 'Tower of London & Crown Jewels', category: 'culture', cost: 30, duration: '3 hours', description: 'Medieval fortress housing the Crown Jewels. Book the first Beefeater tour at 10 AM for the best experience and fewer crowds.', coords: { lat: 51.5081, lng: -0.0759 } },
                { name: 'Big Ben & Westminster Abbey', category: 'sightseeing', cost: 25, duration: '2.5 hours', description: 'Iconic clock tower and Gothic abbey where royals are crowned. Best photo spot is from Westminster Bridge at golden hour.', coords: { lat: 51.4994, lng: -0.1248 } },
                { name: 'British Museum', category: 'culture', cost: 0, duration: '4 hours', description: 'World-class museum with Rosetta Stone and Parthenon sculptures. Free entry - grab a map and prioritize Egyptian and Greek galleries.', coords: { lat: 51.5194, lng: -0.1270 } },
                { name: 'Borough Market Food Tour', category: 'food', cost: 40, duration: '2.5 hours', description: 'London\'s oldest food market since 1014. Must-try: Bread Ahead doughnuts, Padella fresh pasta, and Kappacasein raclette.', coords: { lat: 51.5055, lng: -0.0910 } },
                { name: 'Buckingham Palace & Changing of the Guard', category: 'sightseeing', cost: 0, duration: '1.5 hours', description: 'Royal residence with the famous guard ceremony at 11 AM (Mon, Wed, Fri, Sun). Arrive 30 mins early for front-row view.', coords: { lat: 51.5014, lng: -0.1419 } },
                { name: 'Camden Market & Street Art', category: 'shopping', cost: 20, duration: '3 hours', description: 'Eclectic market with vintage fashion, street food, and live music. Don\'t miss the famous Lock Market and Cyberdog store.', coords: { lat: 51.5416, lng: -0.1458 } },
                { name: 'Sky Garden Sunset Views', category: 'sightseeing', cost: 0, duration: '1.5 hours', description: 'Free 360° London views from the 35th floor. Book online 3 weeks ahead - includes gardens, bar, and stunning cityscape.', coords: { lat: 51.5113, lng: -0.0836 } },
                { name: 'West End Theatre Show', category: 'entertainment', cost: 60, duration: '3 hours', description: 'World-famous theatre district. Book Hamilton, Les Misérables, or The Phantom of the Opera for an unforgettable evening.', coords: { lat: 51.5117, lng: -0.1275 } }
            ],
            restaurants: [
                { name: 'Dishoom King\'s Cross', cuisine: 'Indian', cost: 25, description: 'Bombay-style café with legendary bacon naan and black daal. Worth the queue.' },
                { name: 'The Breakfast Club', cuisine: 'Brunch', cost: 18, description: 'London\'s favorite all-day breakfast. Try the Full Monty or Pancake Stack.' },
                { name: 'Duck & Waffle', cuisine: 'British', cost: 45, description: '24/7 dining on the 40th floor with the signature duck and waffle dish.' },
                { name: 'Flat Iron Steak', cuisine: 'Steakhouse', cost: 15, description: 'Quality steak for just £15. Includes cleaver cocktail and salted caramel dessert.' }
            ],
            tips: ['Get an Oyster card for cheaper tube travel', 'Many museums are free - British, Natural History, V&A', 'Right side for standing on escalators', 'Uber is often cheaper than black cabs', 'Book theatre tickets on TodayTix for discounts', 'Pubs close at 11 PM on weekdays']
        },
        newyork: {
            country: 'USA',
            currency: '$',
            attractions: [
                { name: 'Statue of Liberty & Ellis Island', category: 'sightseeing', cost: 24, duration: '4 hours', description: 'Book Crown access 3 months ahead. First ferry at 8:30 AM from Battery Park avoids crowds.', coords: { lat: 40.6892, lng: -74.0445 } },
                { name: 'Central Park Highlights Walk', category: 'nature', cost: 0, duration: '3 hours', description: 'See Bethesda Fountain, Bow Bridge, Strawberry Fields, and the Reservoir. Rent a bike for $15/hour.', coords: { lat: 40.7829, lng: -73.9654 } },
                { name: 'Top of the Rock Observation Deck', category: 'sightseeing', cost: 40, duration: '1.5 hours', description: 'Best NYC views including Empire State Building. Sunset tickets sell out - book online.', coords: { lat: 40.7587, lng: -73.9787 } },
                { name: 'Times Square & Broadway Show', category: 'entertainment', cost: 75, duration: '4 hours', description: 'The crossroads of the world. TKTS booth sells same-day Broadway tickets at 50% off.', coords: { lat: 40.7580, lng: -73.9855 } },
                { name: '9/11 Memorial & Museum', category: 'culture', cost: 26, duration: '3 hours', description: 'Moving tribute with reflecting pools. Museum is powerful - allow emotional time.', coords: { lat: 40.7115, lng: -74.0134 } },
                { name: 'Brooklyn Bridge Walk & DUMBO', category: 'sightseeing', cost: 0, duration: '2.5 hours', description: 'Walk from Manhattan to Brooklyn for iconic photos. End at Juliana\'s Pizza.', coords: { lat: 40.7061, lng: -73.9969 } },
                { name: 'Chelsea Market & High Line', category: 'food', cost: 35, duration: '3 hours', description: 'Food hall in old Nabisco factory, then elevated park walk with art installations.', coords: { lat: 40.7424, lng: -74.0061 } },
                { name: 'MoMA (Museum of Modern Art)', category: 'culture', cost: 25, duration: '3 hours', description: 'Van Gogh\'s Starry Night, Warhol, Picasso. Free Fridays 4-8 PM (book online).', coords: { lat: 40.7614, lng: -73.9776 } }
            ],
            restaurants: [
                { name: 'Katz\'s Delicatessen', cuisine: 'Deli', cost: 25, description: 'Legendary pastrami since 1888. Cash only. "I\'ll have what she\'s having" scene filmed here.' },
                { name: 'Joe\'s Pizza Greenwich Village', cuisine: 'Pizza', cost: 5, description: 'Best $5 slice in NYC. Spider-Man\'s pizza spot.' },
                { name: 'The Smith', cuisine: 'American', cost: 35, description: 'Upscale casual brunch with ricotta pancakes.' },
                { name: 'Shake Shack Madison Square Park', cuisine: 'Burgers', cost: 15, description: 'The original location. ShackBurger and concrete custard are must-tries.' }
            ],
            tips: ['Subway is 24/7 but skip express trains for first visit', 'Walk - Manhattan is smaller than it looks', 'Tip 18-20% at restaurants', 'Skip Olive Garden in Times Square', 'MTA app for real-time subway times', 'SoHo for shopping, Williamsburg for hipster vibes']
        }
    };

    // Create a generic fallback for any destination that isn't pre-configured
    const genericData = {
        country: 'Abroad',
        currency: '$',
        attractions: [
            { name: `${destination} Central District`, category: 'sightseeing', cost: 0, duration: '2 hours', description: `Explore the heart of ${destination}. Walk through the main streets, observe local life, and get your bearings in this exciting new city.`, coords: { lat: 0, lng: 0 } },
            { name: `${destination} Historical Museum`, category: 'culture', cost: 15, duration: '2.5 hours', description: `Learn about ${destination}'s rich history and cultural heritage. Features exhibits from ancient times to modern day.`, coords: { lat: 0, lng: 0 } },
            { name: `${destination} Famous Market`, category: 'shopping', cost: 25, duration: '2 hours', description: `Browse local crafts, fresh produce, and souvenirs. A great place to experience authentic local culture and find unique gifts.`, coords: { lat: 0, lng: 0 } },
            { name: `${destination} Scenic Viewpoint`, category: 'nature', cost: 10, duration: '1.5 hours', description: `Capture panoramic views of ${destination} from this popular vantage point. Best visited during golden hour for stunning photos.`, coords: { lat: 0, lng: 0 } },
            { name: `${destination} Old Town Walk`, category: 'culture', cost: 0, duration: '2 hours', description: `Wander through charming cobblestone streets lined with traditional architecture, local shops, and hidden cafes.`, coords: { lat: 0, lng: 0 } },
            { name: `${destination} Food Street Tour`, category: 'food', cost: 35, duration: '3 hours', description: `Sample the best local cuisine from street vendors and small restaurants. A culinary adventure for food lovers.`, coords: { lat: 0, lng: 0 } },
            { name: `${destination} Evening Entertainment District`, category: 'nightlife', cost: 40, duration: '3 hours', description: `Experience the vibrant nightlife scene with bars, live music, and cultural performances unique to ${destination}.`, coords: { lat: 0, lng: 0 } },
            { name: `${destination} Park & Gardens`, category: 'nature', cost: 5, duration: '2 hours', description: `Relax in beautifully landscaped gardens. Perfect for a morning jog, afternoon picnic, or peaceful meditation.`, coords: { lat: 0, lng: 0 } }
        ],
        restaurants: [
            { name: `Best of ${destination} Restaurant`, cuisine: 'Local', cost: 30, description: `Highly-rated restaurant serving authentic local cuisine. Try their signature dishes for an unforgettable dining experience.` },
            { name: `${destination} Street Food Corner`, cuisine: 'Street Food', cost: 10, description: `Popular local spot for quick, delicious, and affordable street food. A must-try for authentic flavors.` },
            { name: `${destination} Rooftop Dining`, cuisine: 'International', cost: 50, description: `Upscale restaurant with panoramic city views. Perfect for a special dinner with excellent food and ambiance.` },
            { name: `Traditional ${destination} Kitchen`, cuisine: 'Traditional', cost: 25, description: `Family-run establishment serving recipes passed down through generations. Warm atmosphere and home-cooked flavors.` }
        ],
        tips: [
            `Research local customs and etiquette before visiting ${destination}`,
            'Download offline maps for navigation',
            'Keep copies of important documents',
            'Learn a few basic phrases in the local language',
            'Check visa requirements well in advance',
            'Be aware of local scams targeting tourists',
            'Try to use local transportation for authentic experience',
            'Book popular attractions in advance to avoid queues'
        ]
    };

    // Get destination data or use generic
    let data;
    if (normalizedDest.includes('paris') || normalizedDest.includes('france')) {
        data = destinationData.paris;
    } else if (normalizedDest.includes('bali') || normalizedDest.includes('indonesia')) {
        data = destinationData.bali;
    } else if (normalizedDest.includes('tokyo') || normalizedDest.includes('japan')) {
        data = destinationData.tokyo;
    } else if (normalizedDest.includes('london') || normalizedDest.includes('uk') || normalizedDest.includes('england')) {
        data = destinationData.london;
    } else if (normalizedDest.includes('new york') || normalizedDest.includes('nyc') || normalizedDest.includes('manhattan')) {
        data = destinationData.newyork;
    } else {
        // Use generic data with the user's actual destination name
        data = genericData;
    }

    // Generate days with variety
    const daysArray = [];
    const startDateObj = new Date(startDate);
    const themes = ['Arrival & Iconic Landmarks', 'Cultural Deep Dive', 'Local Neighborhood Exploration', 'Nature & Relaxation', 'Hidden Gems & Food Trail', 'Adventure Day', 'Final Exploration & Departure'];

    for (let i = 0; i < days; i++) {
        const date = new Date(startDateObj);
        date.setDate(startDateObj.getDate() + i);

        // Select different attractions for each day
        const dayAttractions = [];
        const usedIndices = new Set();

        // Morning activity
        let idx = (i * 2) % data.attractions.length;
        dayAttractions.push({ ...data.attractions[idx], time: '9:00 AM' });
        usedIndices.add(idx);

        // Mid-morning activity
        idx = (i * 2 + 1) % data.attractions.length;
        if (!usedIndices.has(idx)) {
            dayAttractions.push({ ...data.attractions[idx], time: '11:30 AM' });
            usedIndices.add(idx);
        }

        // Lunch
        const lunchSpot = data.restaurants[i % data.restaurants.length];
        dayAttractions.push({
            time: '1:00 PM',
            activity: `Lunch at ${lunchSpot.name}`,
            location: lunchSpot.name,
            description: lunchSpot.description,
            cost: lunchSpot.cost,
            duration: '1.5 hours',
            category: 'food',
            coordinates: { lat: 0, lng: 0 }
        });

        // Afternoon activity
        idx = (i * 2 + 3) % data.attractions.length;
        if (!usedIndices.has(idx)) {
            const afternoon = { ...data.attractions[idx], time: '3:00 PM' };
            dayAttractions.push(afternoon);
        }

        // Evening activity
        idx = (i * 2 + 4) % data.attractions.length;
        const evening = { ...data.attractions[idx], time: '6:30 PM' };
        dayAttractions.push(evening);

        daysArray.push({
            day: i + 1,
            date: date.toISOString().split('T')[0],
            title: themes[i % themes.length],
            activities: dayAttractions.map(a => ({
                time: a.time,
                activity: a.activity || a.name,
                location: a.location || a.name,
                description: a.description,
                cost: a.cost,
                duration: a.duration,
                category: a.category,
                coordinates: a.coords || a.coordinates || { lat: 0, lng: 0 }
            }))
        });
    }

    return {
        tripName: `${destination} ${days}-Day Adventure`,
        summary: `An unforgettable ${days}-day journey through ${destination}, ${data.country}. This itinerary balances iconic landmarks with hidden local gems, featuring authentic cuisine and unique experiences. Budget: $${budget} total. Note: Add your Gemini API key for fully personalized AI recommendations.`,
        days: daysArray,
        highlights: data.attractions.slice(0, 5).map(a => a.name),
        packingList: [
            'Comfortable walking shoes',
            'Universal power adapter',
            'Portable phone charger',
            'Lightweight rain jacket',
            'Sunscreen & sunglasses',
            'Reusable water bottle',
            'Small day backpack',
            'Travel documents & copies',
            'Local currency & credit cards',
            'Camera for memories'
        ],
        tips: data.tips,
        totalEstimatedCost: budget,
        bestPhotoSpots: data.attractions.slice(0, 5).map(a => a.name),
        localPhrases: data.country === 'Japan'
            ? ['Arigatou (Thank you)', 'Sumimasen (Excuse me)', 'Oishi! (Delicious!)', 'Ikura desu ka? (How much?)', 'Eigo wakarimasuka? (Do you speak English?)']
            : data.country === 'France'
                ? ['Bonjour (Hello)', 'Merci (Thank you)', 'S\'il vous plaît (Please)', 'L\'addition (The bill)', 'Parlez-vous anglais? (Do you speak English?)']
                : ['Terima kasih (Thank you)', 'Selamat pagi (Good morning)', 'Berapa harganya? (How much?)', 'Satu bir (One beer)', 'Enak! (Delicious!)']
    };
};

export default { generateTripItinerary };
