//////////////////////////////// VARIABLES GLOBALES //////////////////////////
// variables initiales
var baselayer = null;
//données
var dataterrains = terrains.features.filter(f => f.geometry !== null);
//couleurs
var grismediations = "#444444";
var jaunemediations = "#F2BE34";
var rougemediations = "#D72631";

///////////////////////// FONCTIONS DE CHARGEMENT DES CARTES //////////////////////////
getcolor = function(d) {return jaunemediations};

function loadbasemap(basedata, dataterrains) {
    console.log(dataterrains);
    return bertin.draw({
            params:{
                background: "#f5f5f5",
                container: '#carto',
                width: 800,
                height: 600,
                projection: "Bertin1953"
            },

            layers:[
                
                {type:"layer",
                geojson: dataterrains,
                tooltip: d => d.properties.TYPE_TERRAIN + " - " + d.properties.PRENOM_NOM,
                fill: getcolor()
                },

                {type: "graticule", stroke: "#888888", strokeWidth: 0.5},

                {type:"layer",
                geojson: basedata,
                fill: grismediations
                }

                ]
        });
}



///////////////////////////// SCRIPT ///////////////////////////////



fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
.then(response => response.json())
    .catch(error => console.error('Error loading world data:', error))
    .then(data => {
        console.log(data);
        baselayer = data;  
        document.getElementById('carto').appendChild(
            loadbasemap(data, dataterrains)
        )

        });
