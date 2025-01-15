import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.utils import shuffle  # For randomizing the dataset
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Input
import numpy as np
import joblib
from tensorflow.keras.optimizers import RMSprop

# Read the CSV file
data = pd.read_csv('training_dataset.csv')
print(data)
# Randomize the dataset
data = shuffle(data, random_state=42)
# Preprocess the data
# Encode the country names as integers using LabelEncoder
label_encoder = LabelEncoder()
data['Country_name_encoded'] = label_encoder.fit_transform(data['Country name'])

# Define inputs (econ_value, climate_value, country encoded) and output (lit_rate)
X = data[['Country_name_encoded', 'Climate Change Data', 'Economic Growth']]
y = data['Literacy Rates']

print(data.isna().sum())  # Check for NaN values
print((X == np.inf).sum()) # Check for infinity values

# data = data.dropna()  # Remove rows with NaN values
data = data.replace([np.inf, -np.inf], np.nan)  # Replace infinity values with NaN
data = data.interpolate()  # Interpolate missing values using linear interpolation

# Standardize the input features for better neural network performance
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build the Neural Network model
model = Sequential([
    Input(shape=(X_train.shape[1],)),  # Define input shape as the first layer
    Dense(64, activation='relu'),  # Hidden layer with 64 neurons
    Dense(32, activation='relu'),  # Hidden layer with 32 neurons
    Dense(1)  # Output layer for regression
])

# Compile the model
model.compile(optimizer="adam", loss='mean_squared_error', metrics=['mae'])

# Train the model
history = model.fit(X_train, y_train, epochs=400, batch_size=64, validation_split=0.10, verbose=1)

# Evaluate the model
loss, mae = model.evaluate(X_test, y_test, verbose=0)
print(f"Mean Absolute Error on test data: {mae:.2f}")

# Function to predict literacy rate for a new set of values
def predict_literacy_rate(country_name, econ_value, climate_value):
    # Encode the country name
    country_encoded = label_encoder.transform([country_name])[0]

    # Prepare the input data and scale it
    input_data = scaler.transform([[country_encoded, climate_value, econ_value]])

    # Make the prediction
    predicted_lit_rate = model.predict(input_data)[0][0]

    return predicted_lit_rate

# Example usage
predicted_lit_rate = predict_literacy_rate('India', 5.8, 30.0)  # Replace with actual values
print(f"Predicted Literacy Rate for India: {predicted_lit_rate:.2f}")