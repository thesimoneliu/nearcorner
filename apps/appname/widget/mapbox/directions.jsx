const data = fetch('https://jessiejessje.github.io/hackoween/mydata_clean.json');

if (!data) {
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
    <meta charset='utf-8' />
    <title>Mapbox Directions API Example</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />


    <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%}
    </style>
</head>
<body>
<script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.js'></script>
<link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.1/mapbox-gl-directions.css' type='text/css'>

<div id='map'></div>

<script>
async function markStreets() {
    // const response = await fetch('https://jessiejessje.github.io/hackoween/mydata_clean.json');
    // const data = await response.json();
    const data = ${JSON.stringify(data.body)}

    const accessToken = 'pk.eyJ1IjoiZWpsYnJhZW0iLCJhIjoiY2xrbmIwaW53MGE0NTNtbGsydWd2MmpyZSJ9.m1ZfEqv2fGet2zblGknT8A';

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [
            -73.981997, 40.712776
        ], // New York City coordinates
        zoom: 12
    });


    const directions = new MapboxDirections({
        accessToken,
        profile: 'mapbox/cycling',
        controls: {
            instructions: true
        }
    });

    directions.setOrigin([-73.9783516, 40.7871829]);
    directions.setDestination([-73.9900225, 40.7361017]);

    map.addControl(directions, 'bottom-left');

    for (const d of data) {
        const marker = new mapboxgl.Marker().setLngLat([d.long, d.lat]).addTo(map);

        marker.on("click")

        parent.postMessage()
    }

}

markStreets();
    
       
</script>

</body>
</html>


`;

return (
  <Container>
    <iframe id='myMap' className='w-100 h-100' srcDoc={code} onMessage={State} />
  </Container>
);
