const API_URL = props.API_URL || ''
const ACCESS_TOKEN =
  props.accessToken || 'pk.eyJ1IjoiZWpsYnJhZW0iLCJhIjoiY2xrbmIwaW53MGE0NTNtbGsydWd2MmpyZSJ9.m1ZfEqv2fGet2zblGknT8A'
const styleUrl = props.styleUrl || 'mapbox://styles/mapbox/streets-v12' // see https://docs.mapbox.com/api/maps/styles/#mapbox-styles
const center = props.center || [-73.9899, 40.7367] // starting position [lng, lat]
const zoom = props.zoom || 13.5 // starting zoom
const accountId = context.accountId
const markers = props.markers || []
const onMapClick = props.onMapClick || (() => {})
const onMarkerClick = props.onMarkerClick || (() => {})
const edit = props.edit || false

const code = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
    <script id="search-js" defer src="https://api.mapbox.com/search-js/v1.0.0-beta.17/web.js"></script>
<script>
    <style></style>
  </head>
  <body>

    <div id="map"></div>

    <script>

    const accessToken =  "${ACCESS_TOKEN}";
 
    const script = document.getElementById('search-js');
    script.onload = function() {
    mapboxsearch.autofill({ accessToken});
};
    </script>

    <script>
    const accountId = "${accountId}";
    const isEditActive = ${edit};
    const markersByAccount = {};
    let selectedMarkerElement = null;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: '${styleUrl}',
        center: [${center[0]}, ${center[1]}], 
        zoom: ${zoom}
    });

    function handleMarkerClick(marker) {
      map.flyTo({
        center: [marker.coordinates.lng, marker.coordinates.lat],
        essential: true
      });

      if (selectedMarkerElement) {
        selectedMarkerElement.style.boxShadow = '';
      }

      const markerInstance = markersByAccount[marker.accountId];
      if (markerInstance) {
          const el = markerInstance.getElement();
          // el.style.boxShadow = '0px 0px 10px 3px rgba(0,0,0,0.5)';
          selectedMarkerElement = el;
      }
  
      // Post message with marker data
      window.parent.postMessage({
          handler: 'marker-click',
          data: marker
      }, '*');
    }

    // Function to populate markers to the map
    function populateMarkers() {
        const markersData = ${JSON.stringify(markers)};
        markersData.forEach(marker => {

          try {
            const el = document.createElement('div');
            el.className = 'marker';
            el.dataset.accountId = marker.accountId;
            if (marker.accountId === accountId) el.id = 'mymarker';

            markersByAccount[marker.accountId] = new mapboxgl.Marker(el)
                .setLngLat([marker.coordinates.lng, marker.coordinates.lat])
                .addTo(map);
            
            el.addEventListener('click', () => {
              event.stopPropagation();
              handleMarkerClick(marker); 
            });
          } catch (e) {
            console.log(e);
          }
        });
    }

    populateMarkers();

    map.on('click', function(event) {
      const { lngLat } = event;

      if (selectedMarkerElement) {
        // selectedMarkerElement.style.boxShadow = '';
        selectedMarkerElement = null;
      }

      if (accountId && isEditActive) {

        if (markersByAccount[accountId]) {
          markersByAccount[accountId].remove();
        }
          
        const _el = document.getElementById("mymarker");
        const myel = _el ? _el : document.createElement('div');
        myel.className = 'marker';
        myel.id = 'mymarker';

        const newMarker = new mapboxgl.Marker(myel)
          .setLngLat([lngLat.lng, lngLat.lat])
          .addTo(map);

        markersByAccount[accountId] = newMarker;
      }

      window.parent.postMessage({
        handler: 'map-click',
        data: {
          accountId,
          coordinates: lngLat
        }
      }, '*');
    });
    </script>
  </body>
</html>
  `

return <></>
