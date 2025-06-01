import { store } from './store.js';
import { ajax } from './ajaxF.js';
import { formatearAcciones, formatearSelected } from './utils.js';
import { sendCge } from './cge_2.js';

const { dom: DOM, variables: VARIABLES } = store;

export async function routeAdd() {
    if (!confirm("¿Estás seguro de querer guardar la ruta?")) return null;
    let id = await insert()
    alert("Ruta guardada correctamente")
    return id
}

export async function routeUpdate(id) {
    let formateados = formatearAcciones()
    if (VARIABLES.ticketsDelete.length) {
        let eliminados = VARIABLES.ticketsDelete.map(el => el.id).join(" - ")
        let auxEliminados = formateados.filter(el => el.accion == 3)
        if (confirm(`¿Estás seguro de querer eliminar los siguientes tickets:  ${eliminados}? La ruta se modificará.`)) {
            await sendCge(id, auxEliminados)
            alert("Mensaje mandado al CGE")
            await update(id)
            alert("Ruta modificada")
        }
    } else if (confirm("¿Estás seguro de querer modificar la ruta?")) {
        await update(id)
        alert("Ruta modificada")
    }
}

async function update(id) {
    let ruta = await ajax({
        url: `./servidor/rutas/updateRuta.php?id=${id}`,
        method: "PUT",
        data: {
            empresa: 69,
            tecnico: DOM.selects.tecnico.value,
            nombre: DOM.inputs.nombreRuta.value.trim(),
            fecha: DOM.inputs.fecha.value,
            kms: VARIABLES.distanciaRuta,
            tiempo: VARIABLES.tiempoRuta/60,
            origen: VARIABLES.start.id,
            destino: VARIABLES.end.id,
            hora: DOM.inputs.horaSalida.value,
            fechaMod: new Date().toLocaleString().replace('T', ' ').replace('Z', ''),
            kmInicio: parseFloat(DOM.inputs.kmInicio.value.replace(',','.')),
            kmFinal: parseFloat(DOM.inputs.kmFinal.value.replace(',','.'))
        }
    })
    // Por cada tramo, los guarda y asocia con la ruta recién editada.
    if (VARIABLES.tramos.length) {
        let respuesta = await ajax({
            url: `./servidor/rutas/deleteTramos.php?id=${id}`,
            method: 'DELETE'
        })
        for(let tramo of VARIABLES.tramos) {
            await ajax({
                url: "./servidor/rutas/cargarTramos.php",
                method: "POST",
                data: {
                    ruta: id,
                    origen: tramo.origen,
                    destino: tramo.destino,
                    nombre: tramo.nombre,
                    kms: tramo.kms,
                    tiempo: tramo.tiempo/60,
                    estimada: tramo.llegadaEstimada
                }
            })
        }
    }
    // Modifica todos los tickets que se han asignado a la ruta, añadiendo el id de la misma.
    if (VARIABLES.selected.length) {
        console.log(VARIABLES.selected)
        await ajax({url: `./servidor/rutas/resetTickets.php?id=${id}`})
        for(let el of VARIABLES.selected) {
            ajax({
                url: "./servidor/rutas/updateTickets.php",
                method: "PUT",
                data: {
                    ruta: parseInt(id),
                    ticket: el.ticket,
                    intervencion: parseInt(el.estimado),
                    orden: el.orden
                }
            })
        }
    }
}

async function insert() {
    try {
        const ruta = await ajax({
            url: "./servidor/rutas/cargarRuta.php",
            method: "POST",
            data: {
                empresa: 69,
                tecnico: DOM.selects.tecnico.value,
                nombre: DOM.inputs.nombreRuta.value.trim(),
                fecha: DOM.inputs.fecha.value,
                kms: VARIABLES.distanciaRuta,
                tiempo: VARIABLES.tiempoRuta/60,
                origen: VARIABLES.start.id,
                destino: VARIABLES.end.id,
                hora: DOM.inputs.horaSalida.value
            }
        });
        console.log(ruta)
        // Por cada tramo, los guarda y asocia con la ruta recién creada.
        if (VARIABLES.tramos.length) {
            for(let tramo of VARIABLES.tramos) {
                await ajax({
                    url: "./servidor/rutas/cargarTramos.php",
                    method: "POST",
                    data: {
                        ruta: ruta.id,
                        origen: tramo.origen,
                        destino: tramo.destino,
                        nombre: tramo.nombre,
                        kms: tramo.kms,
                        tiempo: tramo.tiempo/60,
                        estimada: tramo.llegadaEstimada
                    }
                })
            }
        }
        // Modifica todos los tickets que se han asignado a la ruta, añadiendo el id de la misma.
        for(let el of VARIABLES.selected) {
            await ajax({
                url: "./servidor/rutas/updateTickets.php",
                method: "PUT",
                data: {
                    ruta: ruta.id,
                    ticket: el.ticket,
                    intervencion: el.estimado,
                    orden: el.orden
                }
            })
        }

        return ruta.id;
    } catch (error) {
        console.error("Error añadiendo ruta:", error);
        throw error;
    }
}