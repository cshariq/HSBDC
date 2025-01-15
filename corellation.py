import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

data = pd.read_csv('training_dataset.csv')

correlation_data = data[['GDP Data',  'Number of Disaster', 'Enrollment Rates']]

correlation_matrix = correlation_data.corr()

print("Correlation matrix:")
print(correlation_matrix)
