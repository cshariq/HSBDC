import pandas as pd

# Load the datasets
df = pd.read_csv('per-capita-co-emissions.csv')
# df2 = pd.read_csv('literacy_rates2.csv')

# # df3 = df1.merge(df2, on=['Country Name'], how='outer')

# columns = list(df1.columns)
# columns.remove('Country Name')
# columns.remove('Country Code')
# print(columns)

# def custom_merge(row, col):
#     col_x = col + '_x'
#     col_y = col + '_y'
#     if pd.notna(row[col_x]) and pd.notna(row[col_y]):
#         return (row[col_x] + row[col_y]) / 2
#     elif pd.notna(row[col_x]):
#         return row[col_x]
#     else:
#         return row[col_y]

# merged_df = pd.merge(df1, df2, on='Country Name', how='outer')

# for col in columns:
#     merged_df[col] = merged_df.apply(lambda row: custom_merge(row, col), axis=1)
#     merged_df = merged_df.drop(columns=[col+'_x', col+'_y'])

# print(merged_df)
pivot_df = df.pivot(index='Entity', columns='Year', values='Annual CO₂ emissions (per capita)')
pivot_df.to_csv('pivoted_climate_change data.csv')