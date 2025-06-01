import { store } from './store.js';
import { ajax } from './ajaxF.js';

const { dom: DOM, variables: VARIABLES } = store;

export async function sendCge(id, arr) {
    if (confirm("¿Seguro que quieres mandar el CGE?")) {
        for (let el of arr) {
            let tramo = VARIABLES.tramos.find(tramo => tramo.destino == el.id) ?? null
            await ajax({
                url: "./servidor/rutas/cge.php",
                method: "POST",
                data: {
                    ruta: parseInt(id),
                    ticketizar: parseInt(el.ticketizar),
                    tecnico: parseInt(DOM.selects.tecnico.value),
                    estimado: tramo ? tramo.llegadaEstimada : null,
                    accion: el.accion
                }
            })
        }
    }
}