import requests
import csv
import json
import geojson
from shapely.geometry import Polygon, MultiPolygon 
from shapely.geometry import mapping
from shapely.ops import unary_union
import geopandas as gpd
import shapely
from time import sleep
import os

csv_file_path = 'interp_dataset.csv'
with open(csv_file_path, 'r') as file:
    csv_reader = csv.DictReader(file)
    data = [row for row in csv_reader]
def load_geojson(file_path): 
    with open(file_path, 'r') as file: 
        geojson_data = json.load(file) 
        return geojson_data

def fetch_place_id(country_name):
    # url = f"https://maps.googleapis.com/maps/api/geocode/json?address={country_name}&key=AIzaSyCHthSOsLSsNGl_RBQz6xhLoppIBHrQdAI"
    url = f'https://atlas.microsoft.com/search/address/json?api-version=1.0&query={country_name}&subscription-key=EQpqoU4nfyGucnQAjt0dKQzmGNIPR8zxReUehq0y4rwwQBGXsWYTJQQJ99ALACYeBjFPL6uYAAAgAZMP1SlG'
    try:
        for attempt in range(30):
            response = requests.get(url)
            if response.status_code == 200:
                results = response.json()["results"]
                if results:
                    # location = results[0]['geometry']['location']
                    location = results[0]['position']

                    coordinates = (str(location['lon']) + ',' + str(location['lat']))
                    return coordinates
            elif response.status_code in [429, 503]:
                sleep(2 ** attempt)
            else:
                return None
    except requests.exceptions.RequestException as e:
        print(f"Error occurred while fetching place_id for country code: {country_name}: {e}")
        return None

def fetch_polygon_coordinates(coordinates):
    # url = f"https://api.geoapify.com/v1/boundaries/consists-of?id={place_id}&geometry=geometry_10000&apiKey=3af7a5add6dd4321818e21e99a2d79b8"
    url = f"https://atlas.microsoft.com/search/polygon?api-version=2023-06-01&coordinates={coordinates}&resultType=countryRegion&subscription-key=EQpqoU4nfyGucnQAjt0dKQzmGNIPR8zxReUehq0y4rwwQBGXsWYTJQQJ99ALACYeBjFPL6uYAAAgAZMP1SlG" 
    headers = { 
        "Accept": "application/json" 
    }
    def round_coordinates(coords, decimals=3): 
        return [[round(coord, decimals) for coord in pair] for pair in coords]
    def clean_data(array): #not working
        corrected_array = []
        for item in array:
            if isinstance(item[0], list) and not isinstance(item[0][0], list):
                corrected_array.append(item)
            elif isinstance(item[0][0], list):
                for sub_item in item:
                    corrected_array.append(sub_item)
        return corrected_array
    try:
        response = requests.get(url, headers=headers)
        for attempt in range(30):
            try:
                if response.status_code == 200:
                    geometries = response.json()["geometry"]["geometries"]
                    polygons = []
                    
                    for i, geometry in enumerate(geometries):
                        if len(geometries[i]["coordinates"])>0:
                            # print(str(i)+"c")
                            rounded_coords = round_coordinates(geometries[i]["coordinates"][0])
                            polygon = Polygon(rounded_coords)
                            polygons.append(polygon)
                        else:
                            print("Polygon not found skipping...")
                    # valid_polygons = [poly for poly in polygons if poly.is_valid]
                    try:
                        merged_polygon = unary_union(polygons)
                        # merged_polygon = clean_data(merged_polygon)
                    except Exception as e:
                        print("Perhaps their were invalid polygons: ")
                        print(e)
                        valid_polygons = [poly for poly in polygons if poly.is_valid]
                        merged_polygon = unary_union(valid_polygons)
                        # merged_polygon = clean_data(merged_polygon)
                    # merged_polygon_dict = shapely.geometry.mapping(merged_polygon)
                    # gdf = gpd.GeoDataFrame(merged_polygon_dict)
                    # gdf_json = gdf.to_json()
                    # gdf_dict = json.loads(gdf_json)
                    # with open('merged_polygons.geojson', 'w') as f: f.write(gdf_json)
                    # if current_row == 29:
                    #     print(merged_polygon)
                    #     geojson_str = json.dumps(response.json(), indent=2)
                    #     output_file_path = ('log Row:'+str(current_row)+' Index:'+str(index)+'.geojson')
                    #     with open(output_file_path, 'w') as file:
                    #         file.write(geojson_str)
                    if merged_polygon:
                        return merged_polygon
                elif response.status_code in [429, 503]:
                    sleep(2 ** attempt)
                else:
                    return []
            except Exception as e:
                print(e)
                print(f"Error occurred while fetching polygon coordinates for place_id: {country_name}")
                geojson_str = json.dumps(response.json(), indent=2)
                output_file_path = ('log Row:'+str(current_row)+' Index:'+str(index)+'.geojson')
                with open(output_file_path, 'w') as file:
                    file.write(geojson_str)
    except requests.exceptions.RequestException as e:
        print(e)
        print(f"Error occurred while fetching polygon coordinates for place_id: {country_name}: {e}")
        return []
for index in range(63):
    print(index)
    output_dir = f'data/data{index}' 
    os.makedirs(output_dir, exist_ok=True)
    if index == 0:
        processed_coords = set()
        for current_row, row in enumerate(data):
            geojson = {
            "type": "FeatureCollection",
            "features": []
            }
            print(str(current_row)+"a")
            if row["Country Code_y"]:
                country_code = row["Country Code_y"] 
            elif row["Country Code_x"]:
                country_code = row["Country Code_x"] 
            else:
                country_code = ""
            country_name = row['Country Name']
            if not country_name:
                print(f"Skipped country: {row['Country Name']}")
                continue
            coordinates = fetch_place_id(country_name)
            if coordinates and not coordinates in processed_coords:
                polygons = fetch_polygon_coordinates(coordinates)
                try:
                    weight = float(row[str(1960+index)])
                    if polygons == []:
                        print(f"Could not fetch polygon coordinates for country: {row['Country Name']}")
                        continue
                    else:
                        try:
                            feature = {
                                "type": "Feature",
                                "properties": {
                                    "name": row["Country Name"],
                                    "weight": float(row[str(1960+index)])
                                },
                                "id": country_code,
                                "geometry": mapping(polygons)
                            }
                            geojson["features"].append(feature)
                            geojson_str = json.dumps(geojson, indent=2)
                            output_file_path = (f'data/data{index}/geojson_file{current_row}.geojson')
                            processed_coords.add(coordinates)
                            with open(output_file_path, 'w') as file:
                                file.write(geojson_str)
                            print(f"Saved")
                        except:
                            print(f"Invalid geometry, skiped country {country_name}")
                except ValueError:
                    print(f"Could not convert weight to float for country: {row['Country Name']}")
            else:
                print(f"Could not fetch place_id for country code: {country_name}")
        # geojson_data = load_geojson("data/geojson_file0.geojson")
    # else:
    #     # 
    #     for current_row, row in enumerate(data):
    #         geojson = {
    #             "type": "FeatureCollection",
    #             "features": []
    #         }
    #         directory = os.fsencode("data/data0")
    #         done = False
    #         for file in os.listdir(directory):
    #             filename = os.fsdecode(file)
    #             if filename.endswith(".geojson") and filename == f"geojson_file{current_row}.geojson": 
    #                 # print(os.path.join(directory, filename))
    #                 geojson_data = load_geojson(f"data/data0/{filename}")
    #                 # try:
    #                 print(str(current_row)+"b")
    #                 features = geojson_data['features'][0]
    #                 if features['properties']['name'] == row['Country Name']:
    #                     # try:
    #                     print(f"Country found: {row['Country Name']}")
    #                     feature = {
    #                         "type": "Feature",
    #                         "properties": {
    #                             "name": row["Country Name"],
    #                             "weight": float(row[str(1960+index)])
    #                         },
    #                         "id": row["Country Code_y"] if row["Country Code_y"] else row["Country Code_x"],
    #                         "geometry": {
    #                             "type": "Polygon",
    #                             "coordinates": features['geometry']['coordinates']
    #                         }
    #                     }
    #                     geojson["features"].append(feature)
    #                     geojson_str = json.dumps(geojson, indent=2)
    #                     output_file_path = (f'data/data{index}/geojson_file{current_row}.geojson')
    #                     with open(output_file_path, 'w') as file:
    #                         file.write(geojson_str)
    #                     print(f"Saved")
    #                     done = True
    #                     break
    #                         # except:
    #                         #     print(f"Could not convert weight to float for country: {row['Country Name']}")
    #                 # except:
    #                 #     print(f"Could not convert weight to float for country: {row['Country Name']}")
    #         if not done:
    #             print(f"Country not found: {row['Country Name']}")