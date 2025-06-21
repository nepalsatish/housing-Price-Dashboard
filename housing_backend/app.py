from flask import Flask, jsonify, request
from model_utils import get_data, load_model
import pandas as pd
import os

app = Flask(__name__)

# Load and prepare data at startup
long_data = get_data()


@app.route("/")
def index():
    return "🏡 Housing Price Prediction API is running!"


@app.route("/forecast", methods=["GET"])
def get_forecast():
    # Get locations parameter (comma-separated)
    locations_param = request.args.get('locations')

    if not locations_param:
        return jsonify({"error": "Locations parameter is required (comma-separated)"}), 400

    # Parse locations
    locations = [loc.strip() for loc in locations_param.split(',')]

    all_forecasts = {}

    for location in locations:
        # Get historical data for the location
        location_long_data = long_data[long_data['RegionName'] == location]

        if location_long_data.empty:
            all_forecasts[location] = {"error": f"No historical data found for {location}"}
            continue

        # Load the model
        model = load_model(location)
        if model is None:
            all_forecasts[location] = {"error": f"No forecast model found for {location}"}
            continue

        # Create future dataframe and predict
        future = model.make_future_dataframe(periods=12, freq='MS')
        forecast = model.predict(future)

        # Return forecasted prices
        result = forecast[["ds", "yhat"]].rename(
            columns={"ds": "date", "yhat": "predicted_price"}
        )
        all_forecasts[location] = result.to_dict('records')

    return jsonify(all_forecasts)


@app.route("/predict", methods=["POST"])
def predict():
    content = request.json
    months = content.get("months", 12)
    # Get locations parameter (comma-separated)
    locations_param = request.args.get("locations")

    if not locations_param:
        return (
            jsonify({"error": "Locations parameter is required (comma-separated)"}),
            400,
        )

    # Parse locations
    locations = [loc.strip() for loc in locations_param.split(",")]

    all_forecasts = {}

    for location in locations:
        # Get historical data for the location
        location_long_data = long_data[
            long_data["RegionName"] == location
        ]

        if location_long_data.empty:
            all_forecasts[location] = {
                "error": f"No historical data found for {location}"
            }
            continue

        # Load the model
        model = load_model(location)
        if model is None:
            all_forecasts[location] = {
                "error": f"No forecast model found for {location}"
            }
            continue

        # Create new future dataframe
        future = model.make_future_dataframe(periods=months, freq="MS")
        new_forecast = model.predict(future)
        output = new_forecast[["ds", "yhat"]].tail(months)
        output = output.rename(columns={"ds": "date", "yhat": "predicted_price"})
        all_forecasts[location] = output.to_dict('records')

    return jsonify(all_forecasts)
@app.route('/locations', methods=['GET'])
def get_locations():
    """Return all available locations from the dataset"""
    try:
        # Get unique locations with both RegionName and StateName from the long_data DataFrame
        locations_data = long_data[['RegionName', 'StateName']].drop_duplicates()
        
        # Sort locations alphabetically by RegionName for better UX
        locations_data = locations_data.sort_values('RegionName')
        
        # Convert to list of dictionaries for JSON response
        locations = locations_data.to_dict('records')
        
        # Ensure all values are JSON serializable
        for location in locations:
            if pd.isna(location['RegionName']):
                location['RegionName'] = ''
            if pd.isna(location['StateName']):
                location['StateName'] = ''
            # Convert any non-string values to strings
            location['RegionName'] = str(location['RegionName'])
            location['StateName'] = str(location['StateName'])
        
        return jsonify({
            "locations": locations,
            "count": len(locations)
        })
    except Exception as e:
        return jsonify({
            "error": "Failed to retrieve locations",
            "message": str(e)
        }), 500


@app.route('/housing_data', methods=['GET'])
def get_housing_data():
    location = request.args.get('location')

    if not location:
        return jsonify({"error": "Location parameter is required"}), 400

    # Extract just the city name from "City, State" format
    city_name = location.split(',')[0].strip() if ',' in location else location

    # Get historical data for the location
    location_long_data = long_data[long_data['RegionName'] == city_name]

    if location_long_data.empty:
        return jsonify({"error": f"No historical data found for {city_name}"}), 404

    # Load the model
    try:
        model = load_model(city_name)
    except FileNotFoundError:
        return jsonify({"error": f"No forecast model found for {city_name}"}), 404

    # Create future dataframe and predict
    future = model.make_future_dataframe(periods=12, freq='MS')
    forecast = model.predict(future)
    
    # Prepare response
    past_data = location_long_data[['Date', 'Price']].to_dict('records')
    
    # Extracting only the forecasted part
    # The forecast dataframe contains historical data as well. 
    # We'll send the last 12 months which are the forecasted values.
    future_forecast = forecast[['ds', 'yhat']].tail(12)
    future_forecast = future_forecast.rename(columns={'ds': 'Date', 'yhat': 'PredictedPrice'})
    forecasted_data = future_forecast.to_dict('records')

    # Convert Timestamps to string for JSON serialization
    for item in past_data:
        item['Date'] = item['Date'].isoformat()
    for item in forecasted_data:
        item['Date'] = item['Date'].isoformat()
        
    response = {
        "location": location,
        "past_data": past_data,
        "forecasted_prices": forecasted_data
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
