import pandas as pd
from scipy.interpolate import interp1d
from math import isnan

# Uses linear interpolation to fill in the missing values in merged_dataset.csv
# New interpolated data is written to interp_dataset.csv

df = pd.read_csv("disasters-pivot.csv")
numeric_cols = df.columns.drop('Country name') 
df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce') # Perform interpolation 
df[numeric_cols] = df[numeric_cols].interpolate(method='linear', axis=1)# Convert all values to numeric, forcing errors to NaN
# df = df.apply(pd.to_numeric, errors='coerce')

# for i in df.index:
#     row = df.loc[i]

#     pairs = []

#     filled_years = []
#     empty_years = []

#     for year_index in range(0, 44):  # Adjusted to start from 0
#         year = year_index + 1979
#         year_value = row[year_index]

#         if not isnan(year_value):
#             filled_years.append({"year": year, "value": year_value})
#         else:
#             empty_years.append(year)
    
#     for j in range(len(filled_years)-1):
#         pairs.append((filled_years[j], filled_years[j+1]))

#     for empty_year in empty_years:
#         for pair in pairs:
#             if empty_year < pair[1]["year"]:
#                 f = interp1d([pair[0]["year"], pair[1]["year"]], [pair[0]["value"], pair[1]["value"]], fill_value="extrapolate")
#                 break
#         if f is not None:        
#             interpolated_value = f(empty_year)
#             if interpolated_value > 0:
#                 df.at[i, str(empty_year)] = interpolated_value

df.to_csv("disasters-pivot_inter.csv")
