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
gettooltip = (d) => {
    let tooltipcontent = d.properties.PRENOM_NOM + " - " +  d.properties.TYPE_TERRAIN;

    return tooltipcontent;
}

function loadbasemap(basedata, dataterrains) {
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
                    leg_x:550,
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
   



///////////////////////////// SCRIPT ///////////////////////////////



fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
.then(response => response.json())
    .catch(error => console.error('Error loading world data:', error))
    .then(data => { 
        document.getElementById("carto").appendChild( //à la suite de la div carto
            loadbasemap(data, dataterrains) // on lance la fonction qui dessine la carte
        )
        
        }).then(() => { //une fois fait, on ajoute un événement de clic sur le groupe svg terrains pour ouvrir la page du membre correspondant

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