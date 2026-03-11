//////////////////////////////// VARIABLES GLOBALES //////////////////////////
// variables initiales
var baselayer = null;
//données
var dataterrains = terrains.features.filter((f) => {return f.geometry !== null && f.properties.TYPE_TERRAIN !== null && f.properties.PRENOM_NOM !== null}); //on filtre les données pour ne garder que les terrains avec une géométrie et un nom de membre renseignés
//couleurs utilisées plusieurs fois
const lightgray = "#cccccc";
const verylightgray = "#f5f5f5";
const grismediations = "#444444";
const jaunemediations = "#F2BE34";
const rougemediations = "#D72631";
//projections
const lambert93 = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"; //proj4string pour la projection Lambert 93 utilisée pour la carte de France


///////////////////////// FONCTIONS DE CHARGEMENT DES CARTES //////////////////////////

function loadbasemap(basedata, dataterrains) { //Charge la carte du monde avec 3 layers : les terrains de recherche, une grille de graticule et une couche de base avec les pays
    return bertin.draw({
            params:{
                background: verylightgray,
                container: '#carto', //ajout à la div carto
                width: window.innerWidth * 0.75,
                height: window.innerHeight * 0.95,
                projection: "Bertin1953", //projection de type "carte de Bertin" qui déforme les pays en fonction de leur position pour éviter les distorsions habituelles des projections cartographiques classiques, notamment aux hautes latitudes. Elle est particulièrement adaptée pour une carte du monde centrée sur l'Europe et l'Afrique, comme c'est le cas ici.
            },

            layers:[
                
                {type:"layer",
                id: "terrains", //permet de cibler ce groupe pour les événements de clic
                geojson: dataterrains,
                tooltip: {
                    fields:["$TERRAIN","______________________", "$PRENOM_NOM", "$STATUT","-  -  -  -  -  -   cliquer pour voir le profil","______________________","$TYPE_TERRAIN"],
                    fontSize: [14, 8, 22, 12, 9, 8, 14],
                    fontStyle:["normal", "normal","bold", "normal","normal", "normal"],
                    fill: verylightgray,
                    stroke: "#ffffff",
                    strokeWidth: 2
                },

                stroke: '#ffffff',
                fill: {
                    type:"typo",
                    values:"TYPE_TERRAIN",
                    colors: [lightgray, jaunemediations, rougemediations],
                    defaultColor: grismediations,
                    leg_x:window.innerWidth * 0.5,
                    leg_y:20,
                    leg_title:"Type de terrain"         
                } 
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
            background: verylightgray,
            container: '#carto-france',
            extent: [ [-5.5, 41], [9.5, 51] ], //étendue géographique de la France métropolitaine
        },
        
        layers:[
                {type:"simple",
                id: "terrains", //permet de cibler ce groupe pour les événements de clic
                geojson: dataterrains,
                symbol_size: 500,
                tooltip: {
                    fields:["$TERRAIN", "______________________", "$PRENOM_NOM", "$STATUT","-  -  -  -  -  -   cliquer pour voir le profil","______________________","$TYPE_TERRAIN"],
                    fontSize: [28, 16, 46, 24, 20, 16, 24],
                    fontStyle:["normal","normal", "bold", "normal", "normal", "normal"],
                    fill: verylightgray,
                    stroke: "#ffffff",
                    strokeWidth: 2
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
.then(response => response.json()) //une fois la requete de la couche pays effectuée, les données recues et parsées en json...
    .catch(error => console.error('Error loading world data:', error))
    .then(data => { //on lance la requete pour la couche de base de la carte de France
        document.getElementById("carto").appendChild( //à la suite de la div carto
            
            loadbasemap(data, dataterrains)); // on lance la fonction qui renvoie la carte principale en svg

        document.getElementById("carto-france").appendChild( //à la suite de la div carto-france..
          
            loadfrance(data, dataterrains));//..on lance la fonction qui renvoie la carte de France dessinée en svg
    })
    .then(() => { //une fois fait, on ajoute un événement sur le groupe svg de classe 'terrains', présent sur les deux cartes, pour au clic ouvrir la page du membre correspondant

            d3.selectAll(".terrains path")
                .on("click", function(event, d) {
                    let prenom_nom = d.properties.PRENOM_NOM.split(" "); //on reconstitue l'url du profil du membre à partir de son prénom et nom, en les mettant en minuscules et séparés par un tiret
                    window.open("https://laboratoire-mediations.sorbonne-universite.fr/" + prenom_nom[1].toLowerCase() + "-" + prenom_nom[0].toLowerCase(), "_blank");
                }).on("mouseover", function(event, d) {
                    this.style.strokeWidth = "2px"; // bordure plus épaisse au survol
                }).on("mouseout", function(event, d) {
                    this.style.strokeWidth = "0.5px"; // retour à la bordure normale au départ du survol
                })

    });