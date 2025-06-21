import pandas as pd
import joblib
import os

# Always resolve paths relative to the repo root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_data():
    file_path = os.path.join(BASE_DIR, 'zhvi_data_long.csv')
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Data file not found: {file_path}")
    
    df = pd.read_csv(file_path)
    df['Date'] = pd.to_datetime(df['Date'])
    df['RegionName'] = df['RegionName'].str.split(',').str[0]
    return df

def load_model(location):
    """
    Loads the pre-trained Prophet model for a given location.
    """
    city_slug = location.replace(' ', '_').lower()
    model_path = os.path.join(BASE_DIR, 'models', f'prophet_{city_slug}_model.pkl')

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")

    model = joblib.load(model_path)
    return model
