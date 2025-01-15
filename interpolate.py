import pandas as pd
from scipy.interpolate import interp1d
from math import isnan

# Uses linear interpolation to fill in the missing values in merged_dataset.csv
# New interpolated data is written to interp_dataset.csv

df = pd.read_csv("interp_gdp.csv")
f= None
for i in df.index:
    row = df.loc[i]

    pairs = []

    filled_years = []
    empty_years = []

    for year_index in range(1, 44):
        print(year_index)
        year = year_index + 1979
        year_value = row[year_index]

        if not isnan(year_value):
            filled_years.append({"year": year, "value": year_value})
        else:
            empty_years.append(year)
    
    for j in range(len(filled_years)-1):
        pairs.append((filled_years[j], filled_years[j+1]))

    for empty_year in empty_years:
        for pair in pairs:
            if empty_year < pair[1]["year"]:
                f = interp1d([pair[0]["year"], pair[1]["year"]], [pair[0]["value"], pair[1]["value"]], fill_value="extrapolate")
                break
        if f is not None:        
            df.at[i, str(empty_year)] = f(empty_year) if f(empty_year) > 0 else 0

df.to_csv("interp_gdp.csv")