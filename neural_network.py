import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.utils import shuffle
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.regularizers import l2
import numpy as np
import joblib
from tensorflow.keras.optimizers import Adam

# Read the CSV file
data = pd.read_csv('training_dataset.csv')

# Randomize the dataset
data = shuffle(data, random_state=42)

# Encode the country names as integers using LabelEncoder
label_encoder = LabelEncoder()
data['Country_name_encoded'] = label_encoder.fit_transform(data['Country Name'])

# Check for NaN values
print(data.isna().sum())

# Drop rows where NaN values are found in specific columns
data.dropna(subset=['GDP Data', 'Enrollment Rates'], inplace=True)

# Replace infinity values with NaN, then interpolate
data = data.replace([np.inf, -np.inf], np.nan)
data = data.interpolate()

# Define inputs and output
X = data[['Country_name_encoded', 'GDP Data']]
y = data['Enrollment Rates']

# Standardize the input features
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Check for NaN values after splitting
assert not np.any(np.isnan(X_train)), "NaN values found in X_train"
assert not np.any(np.isnan(y_train)), "NaN values found in y_train"

# Build the Neural Network model with L2 regularization
model = Sequential([
    Input(shape=(X_train.shape[1],)),
    Dense(64, activation='relu', kernel_initializer='he_normal', kernel_regularizer=l2(0.01)),
    Dense(32, activation='relu', kernel_initializer='he_normal', kernel_regularizer=l2(0.01)),
    Dense(1)
])

# Compile the model with a lower learning rate
optimizer = Adam(learning_rate=0.001)
model.compile(optimizer=optimizer, loss='mean_squared_error', metrics=['mae'])

# Train the model
history = model.fit(X_train, y_train, epochs=1000, batch_size=10, validation_split=0.5, verbose=1)

# Evaluate the model
loss, mae = model.evaluate(X_test, y_test, verbose=0)
print(f"Mean Absolute Error on test data: {mae:.2f}")

# Predict enrollment rates for the next 20 years
def predict_future_lit_rates(years=20):
    future_data = []
    start_year = 2025  # Starting year for predictions
    for year in range(start_year, start_year + years):
        for country_name in label_encoder.classes_:
            encoded_country = label_encoder.transform([country_name])[0]
            future_data.append([encoded_country, np.random.random() * 10000, year])
    future_data = pd.DataFrame(future_data, columns=['Country_name_encoded', 'GDP Data', 'Year'])
    future_data['Country Name'] = label_encoder.inverse_transform(future_data['Country_name_encoded'])
    future_data_scaled = scaler.transform(future_data[['Country_name_encoded', 'GDP Data']])
    predictions = model.predict(future_data_scaled)
    future_data['Predicted Enrollment Rates'] = predictions
    return future_data

future_lit_rates = predict_future_lit_rates()
future_lit_rates.to_csv('predicted_lit_rates.csv', index=False)
print("Predicted enrollment rates saved to predicted_lit_rates.csv")

# Predict all parameters for the next 20 years
def predict_future_all_params(years=20):
    future_data = []
    start_year = 2025  # Starting year for predictions
    for year in range(start_year, start_year + years):
        for country_name in label_encoder.classes_:
            encoded_country = label_encoder.transform([country_name])[0]
            future_data.append([encoded_country, np.random.random() * 10000, year])
    future_data = pd.DataFrame(future_data, columns=['Country_name_encoded', 'GDP Data', 'Year'])
    future_data['Country Name'] = label_encoder.inverse_transform(future_data['Country_name_encoded'])
    future_data_scaled = scaler.transform(future_data[['Country_name_encoded', 'GDP Data']])
    predictions = model.predict(future_data_scaled)
    future_data['Predicted Enrollment Rates'] = predictions
    return future_data

future_all_params = predict_future_all_params()
future_all_params.to_csv('predicted_all_params.csv', index=False)
print("Predicted parameters saved to predicted_all_params.csv")

# Save the trained model, scaler, and label encoder
model.save('neural_network_model.h5')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')
print("Model and preprocessing objects saved.")
