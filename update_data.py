import pandas as pd
import requests
from prophet import Prophet
import os
import joblib

def update_data():
    """
    Downloads the latest Zillow Home Value Index (ZHVI) data,
    processes it, and saves it to CSV files.
    """
    # URL for Zillow's city-level ZHVI data for all homes.
    # This URL might change, so if the script fails, check for a new URL on
    # https://www.zillow.com/research/data/
    url = "https://files.zillowstatic.com/research/public_csvs/zhvi/Metro_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv"

    data_path = "/var/www/project/Housing/"
    raw_csv_path = os.path.join(data_path, 'zhvi_data.csv')
    long_csv_path = os.path.join(data_path, 'zhvi_data_long.csv')

    print("Downloading latest ZHVI data...")
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()  # Raise an exception for bad status codes
    except requests.exceptions.RequestException as e:
        print(f"Error downloading data: {e}")
        return

    print("Saving raw data to zhvi_data.csv...")
    with open(raw_csv_path, 'wb') as f:
        f.write(response.content)

    print("Processing data...")
    df = pd.read_csv(raw_csv_path)

    # Melt the dataframe to long format
    id_cols = ['RegionID', 'SizeRank', 'RegionName', 'RegionType', 'StateName', 'State', 'Metro', 'CountyName']

    # The date columns are all columns not in id_cols
    date_cols = [col for col in df.columns if col not in id_cols]

    df_long = pd.melt(df, id_vars=id_cols, value_vars=date_cols, var_name='Date', value_name='Price')

    # Convert Date column to datetime
    df_long['Date'] = pd.to_datetime(df_long['Date'])

    # Drop rows with missing prices
    df_long = df_long.dropna(subset=['Price'])

    print("Saving processed data to zhvi_data_long.csv...")
    df_long.to_csv(long_csv_path, index=False)

    print("Data update complete.")

    # Get all unique cities from the dataset
    unique_cities = df_long["RegionName"].unique()

    # Process each unique city
    for city_name in unique_cities:
        print(f"Processing {city_name}...")

        # Filter data for the current city
        city_df = df_long[df_long["RegionName"] == city_name].copy()
        city_df = city_df.rename(columns={"Date": "ds", "Price": "y"})

        print(f"Data shape for {city_name}: {city_df.shape}")

        # Check if we have enough data before fitting the model
        if len(city_df.dropna()) >= 2:
            model = Prophet()
            model = model.fit(city_df)

            # Generate forecast
            future = model.make_future_dataframe(periods=12, freq="MS")
            forecast = model.predict(future)

            # Save the model
            city_slug = city_name.replace(" ", "_").lower()
            model_path = f"/var/www/project/Housing/models/prophet_{city_slug}_model.pkl"
            forecast_path = f"/var/www/project/Housing/csvs/{city_slug}_price_forecast.csv"

            joblib.dump(model, model_path)
            forecast[["ds", "yhat"]].to_csv(forecast_path, index=False)

            print(f"Model and forecast saved for {city_name}")
        else:
            print(
                f"Not enough data for {city_name}. Need at least 2 non-NaN rows, but only have {len(city_df.dropna())} rows."
            )

        print("-" * 50)

if __name__ == "__main__":
    update_data()
