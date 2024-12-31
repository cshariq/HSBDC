var markers = [];
let map;
let data = {};
const BATCH_SIZE = 50; // Adjust based on your needs
let cache = {};

function loadGeoJsonBatch(batchStart, batchEnd) {
    const promises = [];
    for (let i = batchStart; i <= batchEnd; i++) {
        let url = `data/data0/geojson_file${i}.geojson`;
        promises.push(
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`GeoJSON file not found: ${url}`);
                    }
                    return response.json();
                })
                .then(geoJsonData => {
                    cache[url] = geoJsonData;
                    map.data.addGeoJson(geoJsonData);
                })
                .catch(error => console.error('Error loading GeoJSON:', error))
        );
    }
    return Promise.all(promises);
}

async function loadAllGeoJsonData() {
    for (let i = 0; i <= 322; i += BATCH_SIZE) {
        await loadGeoJsonBatch(i, Math.min(i + BATCH_SIZE - 1, 322));
    }

    // Set the style for the GeoJSON data
    map.data.setStyle(function(feature) {
        const weight = feature.getProperty('weight');
        const color = getColor(weight);
        return {
            fillColor: color,
            fillOpacity: 0.6,
            strokeColor: '#000000',
            strokeWeight: 1
        };
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        minZoom: 2,
        maxZoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: 'cooperative',
        restriction: {
            latLngBounds: {
                north: 85,
                south: -60, // Exclude Antarctica
                west: -180,
                east: 180
            },
            strictBounds: true
        },
    });

    var input = document.getElementById('search-box');
    var searchBox = new google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            document.getElementById('info').style.display = "block";
            place.address_components.forEach(function(component) {
                if (component.types.includes("country")) {
                    document.getElementById('country').innerHTML = `<strong>Country:</strong> ${component.long_name}`;
                    const url = `https://api.api-ninjas.com/v1/country?name=${component.long_name}&X-Api-Key=1KDhTK3ghZ2spNV39PaKgQ==Q1nAqEU4RWq1twez`;
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            var population = data[0].population || 'N/A';
                            var popGrowth = data[0].pop_growth || 'N/A';
                            document.getElementById('popGrowth').innerHTML = `<strong>Population Growth:</strong> ${popGrowth}%`;
                            population = population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
                            document.getElementById('population').innerHTML = `<strong>Population:</strong> ${population} Million`;
                            var secondary_female = data[0].secondary_school_enrollment_female || 'N/A';
                            var secondary_male = data[0].secondary_school_enrollment_male || 'N/A';
                            let secondary = (secondary_female + secondary_male) / 2;
                            document.getElementById('enrollment').innerHTML = `<strong>HS Enrollment Rate:</strong> ${secondary}%`;
                        })
                        .catch(error => console.error(error));
                }
            });
        });
        map.fitBounds(bounds);
    });

    loadAllGeoJsonData();

    // Zoom Control Event Listeners
    document.getElementById('zoom-in').addEventListener('click', function() {
        map.setZoom(map.getZoom() + 1);
    });
    document.getElementById('zoom-out').addEventListener('click', function() {
        map.setZoom(map.getZoom() - 1);
    });
}

// Function to determine color based on weight
function getColor(weight) {
    return weight > 100 ? '#800026' :
           weight > 50  ? '#BD0026' :
           weight > 20  ? '#E31A1C' :
           weight > 10  ? '#FC4E2A' :
           weight > 5   ? '#FD8D3C' :
           weight > 2   ? '#FEB24C' :
           weight > 0   ? '#FED976' :
                          '#FFEDA0';
}

window.onload = initMap;