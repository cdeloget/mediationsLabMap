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
//projections
const lambert93 = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";

///////////////////////// FONCTIONS DE CHARGEMENT DES CARTES //////////////////////////
gettooltip = (d) => {
    let tooltipcontent = d.properties.PRENOM_NOM + " - " +  d.properties.TYPE_TERRAIN;

    return tooltipcontent;
}

function loadbasemap(basedata, dataterrains) {
    return bertin.draw({
            params:{
                background: "#f5f5f5",
                container: '#carto',
                width: window.innerWidth * 0.75,
                height: window.innerHeight * 0.95,
                projection: "Bertin1953",
            },

            layers:[
                
                {type:"layer",
                id: "terrains", //permet de cibler ce groupe pour les événements de clic
                geojson: dataterrains,
                tooltip: {
                    fields:["$PRENOM_NOM", "$STATUT","-  -  -  -  -  -   cliquer pour voir le profil","$TYPE_TERRAIN"],
                    fontSize: [20, 12, 8, 14],
                    fontStyle:["bold", "italic","normal", "normal"]
                },

                stroke: '#ffffff',
                fill: {
                    type:"typo",
                    values:"TYPE_TERRAIN",
                    colors: [lightgray, jaunemediations, rougemediations],
                    defaultColor: grismediations,
                    leg_x:window.innerWidth * 0.5,
                    leg_y:20,
                    leg_title:"Type de terrain de recherche"            
                },
               },

                {type: "graticule", stroke: "#888888", strokeWidth: 0.5},

                {type:"layer",
                geojson: basedata,
                fill: grismediations
                }
                ]
        });
};

function loadfrance(basefrance, dataterrains) {
    return bertin.draw({
        params:{
            projection: lambert93,
            background: "#f5f5f5",
            container: '#carto-france',
            extent: [ [-5.5, 41], [9.5, 51] ], //étendue géographique de la France métropolitaine
        },
        
        layers:[
                {type:"simple",
                id: "terrains", //permet de cibler ce groupe pour les événements de clic
                geojson: dataterrains,
                symbol_size: 500,
                tooltip: {
                    fields:["$PRENOM_NOM", "$STATUT","-  -  -  -  -  -   cliquer pour voir le profil","$TYPE_TERRAIN"],
                    fontSize: [40, 24, 16, 24],
                    fontStyle:["bold", "italic","normal", "normal"]
                },

                stroke: '#ffffff',
                fill: {
                    type:"typo",
                    values:"TYPE_TERRAIN",
                    colors: [lightgray, jaunemediations, rougemediations],
                    defaultColor: grismediations    
                },
               },

            {
            type: "layer",
            geojson: basefrance,
            fill: "white",
            stroke: "#888888",
            strokeWidth: 0.7
            },
            {type: "scalebar", units: "metric", fontSize: 40, stroke: "#888888"}
        ]
    })}
   



///////////////////////////// SCRIPT ///////////////////////////////



fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
.then(response => response.json())
    .catch(error => console.error('Error loading world data:', error))
    .then(data => { 
        document.getElementById("carto").appendChild( //à la suite de la div carto
            loadbasemap(data, dataterrains)); // on lance la fonction qui dessine la carte

        document.getElementById("carto-france").appendChild( //à la suite de la div carto-france
          loadfrance(data, dataterrains));
    })
    .then(() => { //une fois fait, on ajoute un événement de clic sur le groupe svg terrains pour ouvrir la page du membre correspondant

            d3.selectAll(".terrains path")
                .on("click", function(event, d) {
                    let prenom_nom = d.properties.PRENOM_NOM.split(" ");
                    window.open("https://laboratoire-mediations.sorbonne-universite.fr/" + prenom_nom[1].toLowerCase() + "-" + prenom_nom[0].toLowerCase(), "_blank");
                }).on("mouseover", function(event, d) {
                    this.style.strokeWidth = "2px"; // bordure plus épaisse au survol
                }).on("mouseout", function(event, d) {
                    this.style.strokeWidth = "0.5px"; // retour à la bordure normale au départ du survol
                })

    });

