import { ajax } from './ajaxF.js';
import { store } from './store.js';
import { formatearTiempo, formatearHoras, formatWaypoint, formatearSelected } from './utils.js';
import { renderTramos, renderSelected, renderInfo } from './render.js';

const { dom: DOM, variables: VARIABLES } = store;

export function startLoaders() {
    const selectedDivs = Array.from(DOM.document.querySelectorAll(".po"));
    selectedDivs.forEach(el => {
        const aux = el.querySelector(".infoTicket");
        aux.classList.add("loader-wrapper");
        aux.innerHTML = `<div class="loader"></div>`;
    });
    return selectedDivs;
}

export async function simularTramos(waypoints, horaSalida = 0) {
    VARIABLES.flag = false;
    VARIABLES.tramos = [];
    let currentHoraSalida = horaSalida;

    const selectedDivs = startLoaders();
    
    const rutas = await Promise.all(waypoints.slice(0, -1).map(async (origen, i) => {
        const destino = waypoints[i + 1];
        const route = await calcularTramo(origen, destino);
        return { origen, destino, route };
    }));

    VARIABLES.tramos = rutas.map(({origen, destino, route}) => {
        const distanciaKm = parseFloat((route.distance / 1000).toFixed(2));
        const estimadoMin = destino.estimado ?? 0;
        const intervencion = (estimadoMin * 60) + route.duration;

        const tramo = {
            nombre: `${origen.nombre} - ${destino.nombre}`,
            origen: origen.id,
            destino: destino.id,
            kms: distanciaKm,
            tiempo: route.duration,
            ticket: destino.ticket ?? null,
            estimado: destino.estimado ?? null,
            llegadaEstimada: formatearTiempo(route.duration + currentHoraSalida),
            salidaEstimada: destino.ticket ? formatearTiempo(intervencion + currentHoraSalida) : null
        };

        currentHoraSalida += intervencion;
        return tramo;
    });

    renderTramos(VARIABLES.tramos, selectedDivs);
    VARIABLES.flag = true;
}

export async function calcularTramo(origen, destino) {
    /* const url = `http://192.168.200.202:5000/route/v1/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`; */
    const url = `https://router.project-osrm.org/route/v1/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;
    
    try {
        const data = await ajax({url});
        return data.routes[0];
    } catch(error) {
        console.error("Error calculando tramo:", error);
        return null;
    } 
}

export async function calcularRuta() {
    VARIABLES.auxiliar = VARIABLES.selected
    VARIABLES.horaSalida = formatearHoras(DOM.inputs.horaSalida.value)
    VARIABLES.routeWaypoints = []

    VARIABLES.routeWaypoints.push(VARIABLES.start)
    formatearSelected(VARIABLES.auxiliar)
    VARIABLES.auxiliar.forEach(el => {
        VARIABLES.routeWaypoints.push(el)
    })
    VARIABLES.routeWaypoints.push(VARIABLES.end)
    VARIABLES.control.setWaypoints(VARIABLES.routeWaypoints)
    updateWaypoints(VARIABLES.routeWaypoints)
    
    renderSelected(VARIABLES.selected)
    await simularTramos(VARIABLES.routeWaypoints, VARIABLES.horaSalida)
    renderInfo(VARIABLES.tramos)
    VARIABLES.auxiliar=[]
}

export function updateWaypoints(waypoints) {
    if (!VARIABLES.control._plan) {
        console.log('No hay plan de ruta');
        return;
    }

    /* VARIABLES.control._plan._waypoints.forEach((wp, i) => {
    
        if (!wp.marker) {
            console.log('No hay marker para el waypoint', i);
            return;
        }

        if (!waypoints[i]) {
            console.log('No hay datos para el waypoint', i);
            return;
        }

        const data = waypoints[i];
        wp.name = data.nombre;
        
        const popupContent = `
            <div class="waypoint-popup">
                <h4>${data.nombre || 'Waypoint ' + (i + 1)}</h4>
                ${data.ticket ? `<p>Ticket: ${data.ticket}</p>` : ''}
                ${data.horario ? `<p>Horario: ${data.horario}</p>` : ''}
                ${data.estimado ? `<p>Tiempo estimado: ${data.estimado} min</p>` : ''}
            </div>
        `;

        // Remover popup existente si hay
        if (wp.marker.getPopup()) {
            wp.marker.unbindPopup();
        }

        // Crear nuevo popup
        const popup = L.popup({
            closeButton: true,
            autoClose: false,
            closeOnClick: false
        }).setContent(popupContent);

        wp.marker.bindPopup(popup);
        wp.marker.openPopup();
    }); */
}