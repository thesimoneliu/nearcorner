const mydata = fetch('https://jessiejessje.github.io/hackoween/mydata_clean.json');
const street_name_data = JSON.stringify(mydata.body);

const token = `pk.eyJ1IjoiZWpsYnJhZW0iLCJhIjoiY2xrbmIwaW53MGE0NTNtbGsydWd2MmpyZSJ9.m1ZfEqv2fGet2zblGknT8A`;

if (!street_name_data) {
  return <p>Loading...</p>;
}

const Container = styled.div`
  height: 100vh;
  display: flex;

  /* reset */
  button,
  fieldset,
  input {
    all: unset;
  }
`;

const code = `

<!DOCTYPE html>
<html>
    <head>
        <meta charset='utf-8'/>
        <title>Mapbox Directions API Example</title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet'/>
        <style>
            body {
                margin: 0;
                padding: 0;
            }
            #map {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 100%;
                height: 100%
            }
            #instructions {
                position: absolute;
                margin: 20px;
                width: 25%;
                top: 0;
                bottom: 20%;
                padding: 20px;
                background-color: #fff;
                overflow-y: scroll;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.js'></script>
        <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.css' type='text/css'>
        <script src='https://unpkg.com/@turf/turf@6/turf.min.js'></script>


        <div id='map'></div>

        <div id='instructions'></div>

        <script>
            const accessToken = 'pk.eyJ1IjoiZWpsYnJhZW0iLCJhIjoiY2xrbmIwaW53MGE0NTNtbGsydWd2MmpyZSJ9.m1ZfEqv2fGet2zblGknT8A';
            mapboxgl.accessToken = accessToken;

            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v11',
                center: [
                    -73.9756567, 40.7701070
                ], // New York City coordinates
                zoom: 12
            });


            const start = [-73.9783516, 40.7871829];
            const instructions = document.getElementById('instructions');
            let catalog = '';

            async function getRoute(end) {

                // make a directions request using cycling profile
                // an arbitrary start will always be the same
                // only the end or destination will change

                // const queryurl = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1]+ ';' + end[0] + ',' + end[1] +'?steps=true&geometries=geojson&access_token='+mapboxgl.accessToken+'}';
                // console.log(queryurl);

                const query = await fetch('https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1]+ ';' + end[0] + ',' + end[1] +'?steps=true&geometries=geojson&access_token='+mapboxgl.accessToken);
                const json = await query.json();
                const data = json.routes[0];


                const route = data.geometry.coordinates;
                const geojson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route
                    }
                };


                // if the route already exists on the map, we'll reset it using setData
                if (map.getSource('route')) {
                    map.getSource('route').setData(geojson);
                }

                // otherwise, we'll make a new request else {
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: geojson
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3887be',
                        'line-width': 5,
                        'line-opacity': 0.75
                    }
                });


                if (map.getSource('route')) {
                    // const response = await fetch('https://jessiejessje.github.io/hackoween/mydata_clean.json');
                    // const street_name_data = await response.json();


                    const bufferDistance = 0.5;
                    const buffer = turf.buffer(geojson, bufferDistance, {units: 'kilometers'});
                    const poly = turf.polygon([buffer.geometry.coordinates[0]])

                    instructions.innerHTML = "<p><strong>NYC Memorial Street Names along the route: </strong></p>";

                    for (let d of ${street_name_data}) {
                        const spot = {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [d.long, d.lat]
                            }
                        };

                        const isNearRoute = turf.booleanPointInPolygon(spot.geometry.coordinates, poly);

                        if (isNearRoute) {
                            const marker = new mapboxgl.Marker({color: '#ff7518'}).setLngLat([d.long, d.lat]).addTo(map);
                            instructions.innerHTML += d.loc_result + "<li>" + d.coname + "</li> <br></br>";
                        } else {
                            const marker = new mapboxgl.Marker({color: '#efefef'}).setLngLat([d.long, d.lat]).addTo(map);
                        }
                    }
                    // add turn instructions here at the end
                    console.log(instructions.innerHTML ,'html')

                } // end of markers
            }
            
            map.on('load', () => {
                // make an initial directions request that
                // starts and ends at the same location
                getRoute(start);

                // Add starting point to the map
                map.addLayer({
                    id: 'point',
                    type: 'circle',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                        type: 'Point',
                                        coordinates: start
                                    }
                                }
                            ]
                        }
                    },
                    paint: {
                        'circle-radius': 10,
                        'circle-color': '#3887be'
                    }
                });
                // this is where the code from the next step will go
                map.on('click', (event) => {
                    const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
                    const end = {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: coords
                                }
                            }
                        ]
                    };
                    if (map.getLayer('end')) {
                        map.getSource('end').setData(end);

                    } else {
                        map.addLayer({
                            id: 'end',
                            type: 'circle',
                            source: {
                                type: 'geojson',
                                data: {
                                    type: 'FeatureCollection',
                                    features: [
                                        {
                                            type: 'Feature',
                                            properties: {},
                                            geometry: {
                                                type: 'Point',
                                                coordinates: coords
                                            }
                                        }
                                    ]
                                }
                            },
                            paint: {
                                'circle-radius': 10,
                                'circle-color': '#f30'
                            }
                        });
                    } getRoute(coords);


                });
            });
        </script>
    </body>
</html>



`;

return (
  <Container>
    <iframe id='myMap' className='w-100 h-100' srcDoc={code} />
  </Container>
);
