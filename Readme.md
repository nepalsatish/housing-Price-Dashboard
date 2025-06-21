# 🏡 Housing Price Prediction Dashboard

A comprehensive housing price prediction and analysis platform that provides historical data visualization and future price forecasts for cities across the United States using machine learning models.

## 📊 Project Overview

This project combines a Flask-based API backend with a Next.js frontend to deliver an interactive housing price dashboard. It uses Facebook Prophet time series forecasting models to predict future housing prices based on historical Zillow Home Value Index (ZHVI) data.

## ✨ Features

- **📈 Interactive Price Charts**: Visualize historical housing price trends with interactive charts
- **🔮 Price Forecasting**: Get 12-month price predictions using Prophet ML models
- **🏙️ Multi-City Support**: Access data for 800+ cities across the United States
- **📊 Statistical Insights**: View current prices, predicted prices, price changes, and price ranges
- **🎯 Location Selection**: Easy-to-use location selector with search functionality
- **📱 Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **⚡ Real-time API**: Fast REST API endpoints for data retrieval and predictions

## 🏗️ Architecture

### Backend (Flask API)
- **Framework**: Flask
- **Data Processing**: Pandas for data manipulation
- **ML Models**: Facebook Prophet for time series forecasting
- **Model Storage**: Joblib for model serialization
- **Data Source**: Zillow Home Value Index (ZHVI) data

### Frontend (Next.js)
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **HTTP Client**: Axios for API communication

## 📁 Project Structure

```
Housing/
├── housing_backend/          # Flask API backend
│   ├── app.py                 # Main Flask application
│   └── model_utils.py         # Model loading utilities
├── housing_frontend/          # Next.js frontend
│   ├── app/
│   │   ├── components/        # React components
│   │   │   ├── ForecastChart.tsx
│   │   │   ├── LocationSelector.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── page.tsx          # Main dashboard page
│   │   └── layout.tsx        # App layout
│   └── package.json
├── models/                    # Trained Prophet models
├── csvs/                      # Forecast CSV files
├── Data_Cleaning.ipynb       # Data preprocessing notebook
├── model_training.ipynb      # Model training notebook
└── venv/                     # Python virtual environment
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Activate virtual environment**:
   ```bash
   source venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask API**:
   ```bash
   cd housing_backend
   python app.py
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies**:
   ```bash
   cd housing_frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Get Available Locations
```http
GET /locations
```
Returns all available cities and states in the dataset.

### Get Housing Data
```http
GET /housing_data?location=New York
```
Returns historical prices and 12-month forecast for a specific location.

### Get Forecast
```http
GET /forecast?locations=New York,Los Angeles
```
Returns price forecasts for multiple locations.

### Custom Prediction
```http
POST /predict?locations=New York
Content-Type: application/json

{
  "months": 12
}
```
Returns custom-length predictions for specified locations.

## 📊 Data Sources

- **Primary Dataset**: Zillow Home Value Index (ZHVI) - Metro-level data
- **Data Format**: Monthly housing price data from 2000-2024
- **Coverage**: 800+ cities across the United States
- **Data Processing**: Cleaned and transformed from wide to long format

## 🤖 Machine Learning Models

- **Algorithm**: Facebook Prophet
- **Model Type**: Time series forecasting
- **Features**: 
  - Trend modeling
  - Seasonality detection
  - Holiday effects
  - Uncertainty intervals
- **Training**: Individual models for each city
- **Forecast Period**: 12 months (configurable)

## 🛠️ Development

### Data Processing
The data cleaning process is documented in `Data_Cleaning.ipynb`:
- Converts wide-format data to long format
- Handles missing values
- Standardizes city names
- Exports cleaned data for model training

### Model Training
Model training is documented in `model_training.ipynb`:
- Trains Prophet models for each city
- Generates 12-month forecasts
- Saves models and forecast data
- Handles edge cases and data validation

### Adding New Cities
1. Ensure the city exists in the ZHVI dataset
2. Run the model training notebook
3. Models will be automatically generated and saved

## 🎨 Frontend Components

- **LocationSelector**: Dropdown for city selection
- **PriceChart**: Historical price visualization
- **ForecastChart**: Future price predictions
- **StatsCard**: Key metrics display

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### API Configuration
The Flask API can be configured in `housing_backend/app.py`:
- Port: Default 5000
- Debug mode: Enabled for development
- CORS: Configure as needed for production

## 📈 Performance

- **Model Loading**: Cached model loading for fast predictions
- **Data Caching**: Historical data loaded once at startup
- **API Response**: Optimized JSON responses
- **Frontend**: Server-side rendering with Next.js

## 🚀 Deployment

### Backend Deployment
```bash
# Production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Deployment
```bash
# Build for production
npm run build
npm start
```


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Zillow**: For providing the ZHVI dataset
- **Facebook Prophet**: For the time series forecasting library
- **Next.js**: For the React framework
- **Tailwind CSS**: For the styling framework

**Built with ❤️ for housing market analysis and prediction**
