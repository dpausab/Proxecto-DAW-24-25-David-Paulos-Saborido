import { store } from './store.js';
import { routeAdd, routeUpdate } from './apis.js';
import { sendCge } from './cge_2.js';
import { formatearAcciones } from './utils.js';

let VARIABLES = store.variables

export async function handleStatus(ev) {
    let formateados = formatearAcciones()
        if (VARIABLES.idRuta) {
            try {
                await routeUpdate(VARIABLES.idRuta)
                alert("Ruta editada correctamente.")
                await sendCge(VARIABLES.idRuta, formateados)
                alert("Datos mandados al CGE")
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                let id = await routeAdd()
                alert("Ruta guardada correctamente.")
                await sendCge(id, formateados)
                alert("Datos mandados al CGE")
            } catch (error) {
                console.log(error)
            }
        }
}