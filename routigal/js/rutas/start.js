import { store } from './store.js';
import { getTickets } from './data.js';
import { renderTickets, renderSelected } from './render.js';
import { formatWaypoint, formulario } from './utils.js';
import { calcularRuta } from './rutas.js';
import { ticketListeners } from './listeners.js';

const { dom: DOM, variables: VARIABLES } = store;
export function setStart() {
    let startPoint = DOM.selects.origen.value.split('/');
    startPoint = {
        nombre: startPoint[0],
        latitud: parseFloat(startPoint[1]),
        longitud: parseFloat(startPoint[2]),
        id: parseInt(startPoint[3])
    };

    VARIABLES.start = L.latLng(startPoint.latitud, startPoint.longitud);
    VARIABLES.start.id = startPoint.id;
    VARIABLES.start.nombre = startPoint.nombre;
}
// Formatea la ubicación de destino como un objeto latLng de Leaflet.
export function setEnd() {
    let endPoint = DOM.selects.destino.value.split('/');
    endPoint = {
        nombre: endPoint[0],
        latitud: parseFloat(endPoint[1]),
        longitud: parseFloat(endPoint[2]),
        id: parseInt(endPoint[3])
    };

    VARIABLES.end = L.latLng(endPoint.latitud, endPoint.longitud);
    VARIABLES.end.id = endPoint.id;
    VARIABLES.end.nombre = endPoint.nombre;
}
export function setInit() {
    setStart();
    setEnd();
}

// Carga los tickets disponibles, setea Pontevedra como ubicación predefinida e inicia la ruta.
export async function startRoute() {    
    try {
        await getTickets();
        VARIABLES.ticketsMap = new Map(VARIABLES.tickets.map(el => [el.id, el]));
        
        renderTickets(VARIABLES.tickets);
        ticketListeners()
        VARIABLES.tramos = [];
        VARIABLES.selected = [];

        formulario()
        
        setInit();
    } catch (error) {
        console.log("Error iniciando la ruta:", error);
    }
    
}
// Inicia la ruta a ser editada, cargando sus tickets, y añadiéndolos on load al array de seleccionados
export async function startRouteExistente() {    
    try{
        await getTickets(VARIABLES.idRuta);
        VARIABLES.ticketsMap = new Map(VARIABLES.tickets.map(el => [el.id, el]));
        VARIABLES.selected = [];
        renderTickets(VARIABLES.tickets);
        ticketListeners();
        
        VARIABLES.checks = Array.from(DOM.document.querySelectorAll('input[type="checkbox"]'));
        VARIABLES.checks.forEach(el => el.checked = false);
        setInit();
        VARIABLES.checks.forEach(el => {
            if (parseInt(el.dataset.ruta) == VARIABLES.idRuta) {
                el.checked = true;
                let waypoint = formatWaypoint(el.dataset.id);
                VARIABLES.selected.push(waypoint);
            }
        });
        VARIABLES.selected.sort((a, b) => a.orden > b.orden)
        let ruta = VARIABLES.rutaUpdate
        console.log("Ruta a editar: ", ruta)
        VARIABLES.ticketsAsignados = ruta.tickets
        VARIABLES.ticketsCGE = ruta.ticketsCGE

        renderSelected(VARIABLES.selected);
        calcularRuta();
    }catch(error){
        console.log("Error iniciando la ruta existente:", error);
    }

    
}