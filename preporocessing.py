import pandas as pd

# File paths
file_2 = "enrollment_rate_inter.csv" 
file_1 = "gdp-pivot_inter.csv" 
file_3 = "number-disasters-pivot_inter.csv" 

# Load the files into dataframes
df1 = pd.read_csv(file_1)
df2 = pd.read_csv(file_2)
df3 = pd.read_csv(file_3)

# Ensure all files contain the column "Country names"
for file_name, df in zip(["file_1", "file_2", "file_3"], [df1, df2, df3]):
    if "Country Name" not in df.columns:
        raise ValueError(f"The column 'Country Name' is missing in {file_name}.csv")

# Get the set of common country names across all files
common_countries = set(df1["Country Name"]) & set(df2["Country Name"]) & set(df3["Country Name"])

# Filter each dataframe to include only rows with common country names
df1_filtered = df1[df1["Country Name"].isin(common_countries)]
df2_filtered = df2[df2["Country Name"].isin(common_countries)]
df3_filtered = df3[df3["Country Name"].isin(common_countries)]

# Ensure all filtered dataframes have the same number of rows
if not (len(df1_filtered) == len(df2_filtered) == len(df3_filtered)):
    raise ValueError("Filtered files do not have the same number of rows!")

# Save the filtered dataframes back to CSV files
df1_filtered.to_csv("filtered_gdp.csv", index=False)
df2_filtered.to_csv("filtered_enrol.csv", index=False)
df3_filtered.to_csv("filtered_number_disasters.csv", index=False)

print("Filtered files have been saved with '_filtered' appended to their names.")
