# TraveAI - AI-Powered Travel Planning Platform

A modern, full-stack travel planning application that uses AI to generate personalized travel itineraries.

![TraveAI](public/images/hero.png)

## Features

- 🤖 **AI Trip Generation** - Powered by Google Gemini for personalized itineraries
- 🗺️ **Interactive Explorer** - Map-based destination discovery with Leaflet
- 🏨 **Hotel & Flight Search** - Find and compare accommodations and flights
- 👤 **User Accounts** - Save trips, track history, manage preferences
- 📱 **Responsive Design** - Beautiful experience on all devices
- ✨ **Premium UI** - Glassmorphic design with smooth animations

## Tech Stack

### Frontend
- **React 19** with Vite
- **Framer Motion** for animations
- **React Router v7** for navigation
- **React Leaflet** for maps
- **Vanilla CSS** with CSS variables

### Backend
- **Express.js** API server
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Google Gemini AI** for itinerary generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier works)
- Google Gemini API key

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables

Create `server/.env` file:

```env
PORT=3001
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/traveai
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting API Keys:**

1. **MongoDB Atlas**: 
   - Go to https://cloud.mongodb.com
   - Create free M0 cluster
   - Get connection string from "Connect" > "Connect your application"

2. **Google Gemini**:
   - Go to https://makersuite.google.com/app/apikey
   - Create new API key

### 3. Run Development Servers

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get profile |
| PUT | `/api/auth/profile` | Update profile |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trips/generate` | Generate AI itinerary |
| GET | `/api/trips` | Get user's trips |
| GET | `/api/trips/:id` | Get trip details |
| DELETE | `/api/trips/:id` | Delete trip |

### Destinations & Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destinations` | List destinations |
| POST | `/api/bookings/hotels` | Search hotels |
| POST | `/api/bookings/flights` | Search flights |

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React context (Auth)
│   ├── pages/             # Page components
│   ├── utils/             # API utilities
│   ├── App.jsx           # Main app with routing
│   └── main.jsx          # Entry point
├── server/
│   ├── config/           # Database config
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # AI service
│   └── index.js          # Server entry
└── package.json
```

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist folder to Vercel
```

### Backend (Railway/Render)
1. Push server folder to separate repo
2. Connect to Railway or Render
3. Set environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ by TraveAI Team
