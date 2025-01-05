# An interactive map

## Table of Contents
- [Overview](#Overview)
- [Usage](#usage)
- [Contributing](#contributing)

## Overview
Based on multiple sources of data, we have trained a model to predict how climate change impacts education. Users can scroll through a historical timeline and switch between different datasets to view them on the map(in development).
<img width="1728" alt="Screenshot 2025-01-05 at 6 39 45 PM" src="https://github.com/user-attachments/assets/07df956a-bd79-40e6-8b84-d0c31568a23b" />

## Usage
Go to https://cshariq.github.io/HSBDC/Index.html to access the website.
Note: Most of the frontend is under development and many bugs still exist

## Contributing
1. Contributing to data collection
   Our goal is to demonstrate the way that climate change is impacting education. Make sure that any new datasets collected are from a reliable source.
   - All datasets must have data from at least 1990
   - If using multiple datasets the datasets must be merged using the appropriate script
   - The dataset must be interpolated to fill any gaps in the dataset. The existing interpolation script uses linear interpolation, you should change the method of interpolation that best fits your data.
   - The data must be manually reviewed to a certain extent to verify that the data makes sense.
2. Contributing to website development
   The goal of our website is to look professional and modern.
   - Frontend(CSS and HTML)
     - When contributing the general design should not be changed.
     - If you'd like to implement a new design, a mock design must be requested first as an issue.
     - Any changes should be made sure to be universally compatible, this can mean adding resizable elements and testing the changes on multiple web browsers.
   - Backend(Javascript)
     - Avoid changing the general structure of the code
     - All changes should be tested before making a pull request
All changes should be submitted as pull requests.
