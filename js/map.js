//////////////////////////////// VARIABLES GLOBALES //////////////////////////
// variables initiales
var baselayer = null;
//données
var dataterrains = terrains.features.filter((f) => {return f.geometry !== null && f.properties.TYPE_TERRAIN !== null && f.properties.PRENOM_NOM !== null});
//couleurs
const lightgray = "#cccccc"
const grismediations = "#444444";
const jaunemediations = "#F2BE34";
const rougemediations = "#D72631";

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
                projection: "Bertin1953",
            },

            layers:[
                
                {type:"layer",
                geojson: dataterrains,
                tooltip: d => d.properties.PRENOM_NOM + " - " + d.properties.STATUT + " - " + d.properties.TYPE_TERRAIN   + " - " + d.properties.TERRAIN,
                stroke: '#ffffff',
                fill: {
                    type:"typo",
                    values:"TYPE_TERRAIN",
                    colors: [lightgray, jaunemediations, rougemediations],
                    defaultColor: grismediations,
                    leg_x:550,
                    leg_y:20,
                    leg_title:"Type de terrain de recherche"            
                }
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
