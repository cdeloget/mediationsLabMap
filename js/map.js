fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
.then(response => response.json())
// .then(worldData => {
//     let countries = topojson.feature(worldData, worldData.objects.countries);
//     console.log(worldData)
//     console.log(countries);

//     })
    .catch(error => console.error('Error loading world data:', error))
    .then(data => {
        console.log(data);  
        document.getElementById('carto').appendChild(
        bertin.draw({
            params:{
                background: "#f5f5f5",
                container: '#carto',
                width: 800,
                height: 600,
                projection: "Bertin1953"
            },
            layers:[{type:"layer",
                geojson: data,
                fill: "#444444"
            }]
        }));

        });
