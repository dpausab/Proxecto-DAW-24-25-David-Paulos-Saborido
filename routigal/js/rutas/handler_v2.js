import { store } from './store.js';
import { routeAdd, routeUpdate } from './apis.js';

let VARIABLES = store.variables

export async function handleStatus(ev) {
        if (VARIABLES.idRuta) {
            try {
                await routeUpdate(VARIABLES.idRuta)
                window.location.reload()
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                let id = await routeAdd()
                window.location.href = `./rutas.html?id=${id}`
            } catch (error) {
                console.log(error)
            }
        }
}