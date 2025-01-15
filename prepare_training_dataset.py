import pandas as pd
import csv

# Read the CSV files
climate = pd.read_csv("filtered_number_disasters.csv")
gdp_data = pd.read_csv("filtered_gdp.csv")
lit_data = pd.read_csv("filtered_enrol.csv")

# Open the CSV file in append mode
with open('training_dataset.csv', mode='a', newline='') as file:
    writer = csv.writer(file)
    
    # Write the header if the file is empty
    if file.tell() == 0:
        writer.writerow(["Country Name", "Number of Disaster", "GDP Data", "Enrollment Rates"])

    # Iterate through rows of all files using "Country name" as the key
    for row_index, country in enumerate(climate["Country Name"]):
        print(f"Country: {country}")
        
        # Extract the respective rows for each country
        climate_row = climate.iloc[row_index]
        gdp_row = gdp_data.iloc[row_index]
        lit_row = lit_data.iloc[row_index]
        
        # Iterate through columns (excluding "Country name")
        for column in climate.columns:
            if column != "Country Name":
                climate_value = climate_row[column]
                gdp_value = gdp_row[column]
                lit_value = lit_row[column]

                # Print values for each column
                print(country, climate_value, gdp_value, lit_value)

                # Write the data to the CSV file
                writer.writerow([country, climate_value, gdp_value, lit_value])

print("Data appended successfully.")
