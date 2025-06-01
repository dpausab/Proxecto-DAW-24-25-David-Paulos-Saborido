import { store } from './store.js';
import { ajax } from './ajaxF.js';
import { formatearAcciones } from './utils.js';

const { dom: DOM, variables: VARIABLES } = store;

export async function sendCge(id, arr=null) {
    if (!confirm("Seguro que quieres enviar los datos de la ruta al CGE? Asegúrate de haber guardado los cambios antes")) return
    try{
        let cges = arr ? await procesarCge(id, arr) : await procesarCge(id)
        
        let resp = await ajax({
            url: "./servidor/rutas/cge_2.php",
            method: "POST",
            data: { cges }
        })
        
        if (resp.success) {
            console.log("Salida de la función CGE:", resp)
        } else {
            throw new Error()
        }
    } catch (error) {
        console.log("Error enviando el CGE:", error)
    }
}

async function procesarCge(id, arr) {
    if (arr) {
        return arr.map(el => ({ticketizar: parseInt(el.ticketizar), accion: el.accion})) 
    }

    await Promise.all(VARIABLES.ticketsAsignados.map(el => 
        ajax({
            url: "./servidor/rutas/updateTickets.php",
            method: "PUT",
            data: {
                cge: 1,
                ticket: el.id,
            }
        })
    ))

    await ajax({
        url: `./servidor/rutas/updateRuta.php?id=${id}`,
        method: "PUT",
        data: {
            glpi: 1,
            id: id,
            fechaGlpi: new Date().toLocaleString().replace('T', ' ').replace('Z', '')
        }
    })     

    const formateados = formatearAcciones()
    const tramosMap = new Map(VARIABLES.tramos.map(el => [el.destino, el]))

    return formateados.map(el => {
        let tramo = tramosMap.get(el.id)
        return {
            ruta: parseInt(id),
            ticketizar: parseInt(el.ticketizar),
            tecnico: parseInt(DOM.selects.tecnico.value),
            estimado: tramo ? tramo.llegadaEstimada : null,
            accion: el.accion 
        }
    })
}