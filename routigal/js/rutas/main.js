import { store } from './store.js'
import * as data from "./data.js"
import * as start from "./start.js"
import * as render from "./render.js"
import * as listeners from "./listeners.js"
import { ajax } from './ajaxF.js'
import { formulario } from './utils.js'

const urlParams = new URLSearchParams(window.location.search);

const { dom: DOM, variables: VARIABLES } = store;
VARIABLES.idRuta = urlParams.get('id')

// Función de inicio, carga todos los datos para poder trabajar con los mismos.
async function load() {
    try {
        VARIABLES.flag = false
        DOM.inputs.kmInicio.disabled = true
        DOM.inputs.kmFinal.disabled = true

        await data.getTecnicos()
        await data.getUbicaciones()
        render.renderTecnicos(VARIABLES.tecnicos)
        render.renderUbicaciones(VARIABLES.ubicaciones)
        
        loadMap()
        if (VARIABLES.idRuta) {
            DOM.buttons.glpi.style.display = "flex"
            let updated = await ajax({
                url: `./servidor/rutas/ruta.php?id=${VARIABLES.idRuta}`
            })
            VARIABLES.rutaUpdate = updated
            loadExistente(VARIABLES.rutaUpdate)
            let fechaMod = VARIABLES.rutaUpdate.fecha_mod!=null ? VARIABLES.rutaUpdate.fecha_mod.split(" ") : null
            let fechaGlpi = VARIABLES.rutaUpdate.fecha_glpi!=null ? VARIABLES.rutaUpdate.fecha_glpi.split(" ") : null
            
            let horaMod = fechaMod ? fechaMod[1].split(':') : null
            let horaGlpi = fechaGlpi ? fechaGlpi[1].split(':') : null
            
            DOM.actualizacion.textContent = fechaMod ? `- Actualizada: ${fechaMod[0]} a la ${[horaMod[0], horaMod[1]].join(':')}` : 'No se ha actualizado aún.'
            DOM.actualizacion.innerHTML += fechaGlpi ? `<br> - GLPI: ${fechaGlpi[0]} a la ${[horaGlpi[0], horaGlpi[1]].join(':')}` : ''
        } else {
            start.startRoute()
        }

        listeners.startListeners()
        VARIABLES.flag = true
    } catch (error) {
        console.log("Error cargando los datos:", error) 
    }
    
}
// Se encarga de cargar los datos de la ruta obtenida para editar.
async function loadExistente(ruta) {
    try {
        DOM.inputs.kmInicio.disabled = false
        DOM.inputs.kmFinal.disabled = false

        VARIABLES.update = true
        formulario(ruta)

        await start.startRouteExistente()
    } catch (error) {
        console.log("Error cargando la ruta existente:", error)
    }
    
}
// Inicia el mapa de Leaflet, centrado en Galicia.
function loadMap() {
    VARIABLES.map = L.map('map').setView([42.7951, -8.1139], 8);

    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxBounds: [
            [42.5, -9.5],  // Suroeste
            [43.8, -6.0]   // Noreste
        ],
        noWrap: true,
        maxZoom: 15,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Rutas por <a href="http://project-osrm.org/">OSRM</a>',
        id: 'mapbox/satellite-streets-v12'
    }).addTo(VARIABLES.map);

    VARIABLES.control = L.Routing.control({
        default: false,
        draggeable: false,
        lineOptions: {
          styles: [{color: 'blue', opacity: 1, weight: 5}]
        },
        waypoints: [],
        createMarker: function(i, waypoint) {
            const name = waypoint.latLng.nombre
            const marker = L.marker(waypoint.latLng)
            .bindTooltip(`${i} - ${name}`, {
                permanent: true,
                direction: 'top',
                offset: [-15, -10],
                className: 'my-label'
            })
            .openTooltip();
            return marker;
        },
        zoom: 8/* ,
        router: L.Routing.osrmv1({
            serviceUrl: 'http://192.168.200.202:5000/route/v1'
        }) */
      }).addTo(VARIABLES.map);
}


/* Bloque de código para obtener la información de la BBDD - Fin     */
document.addEventListener("DOMContentLoaded", ev => {
    load()
})