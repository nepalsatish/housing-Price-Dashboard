# Housing Price Dashboard Frontend

A modern Next.js frontend for the Housing Price Prediction Dashboard. This application provides an interactive interface to view historical housing prices and future predictions for various locations.

## Features

- 📊 Interactive charts showing historical and predicted housing prices
- 🏠 Location selector with 20 major US cities
- 📈 Real-time statistics and metrics
- 🎨 Modern, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- ⚡ Fast loading with Next.js optimization

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ 
- npm or yarn
- The Flask backend running on `http://localhost:5000`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd housing_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
housing_frontend/
├── app/
│   ├── components/
│   │   ├── LocationSelector.tsx
│   │   ├── PriceChart.tsx
│   │   ├── ForecastChart.tsx
│   │   └── StatsCard.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## API Integration

The frontend connects to the Flask backend API endpoints:

- `GET /api/housing_data?location={location}` - Get historical and forecasted data for a location

The Next.js configuration includes API rewrites to proxy requests to the Flask backend running on port 5000.

## Components

### LocationSelector
Dropdown component for selecting different housing markets with 20 major US cities.

### StatsCard
Displays key metrics like current price, predicted price, average price, and price range with trend indicators.

### PriceChart
Shows historical housing prices over time using a line chart.

### ForecastChart
Displays predicted prices and can show combined historical + forecast data.

## Styling

The application uses Tailwind CSS for styling with a custom color palette:
- Primary blue: `#3b82f6`
- Success green: `#10b981`
- Error red: `#ef4444`

## Development

The application is built with TypeScript for better type safety and developer experience. All components are client-side rendered for interactivity.

## Deployment

To deploy the application:

1. Build the production version:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

The application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications. 