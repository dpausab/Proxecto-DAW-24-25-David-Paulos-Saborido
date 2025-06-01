import { store } from './store.js'
import { ajax } from './ajaxF.js'

const { dom: DOM, variables: VARIABLES } = store;
// Función que recupera los tickets de la BBDD.
export async function getTickets(id=null) {
    try {
        let data = id ? await ajax({url: `./servidor/rutas/dataTickets.php?id=${id}`}) : await ajax({url: "./servidor/rutas/dataTickets.php"})
        VARIABLES.tickets = data
        VARIABLES.ticketsMap = new Map(VARIABLES.tickets.map(el => [el.id, el]))        
    } catch (error) {
        console.log("Error al cargar los tickets", error)
        return []
    }
}
// Función que recupera los técnicos de la BBDD.
export async function getTecnicos() {
    try {
        let data = await ajax({url: "./servidor/rutas/dataTecnicos.php"})
        VARIABLES.tecnicos = data
    } catch (error) {
        console.log("Error al cargar los técnicos", error)
        return []
    }
}
// Función que recupera las ubicaciones de la BBDD.
export async function getUbicaciones() {
    try {
        let data = await ajax({url: "./servidor/rutas/dataUbicaciones.php"})
        VARIABLES.ubicaciones = data
        VARIABLES.ubicacionesMap = new Map(VARIABLES.ubicaciones.map(el => [el.id, el]))
    } catch (error) {
        console.log("Error al cargar las ubicaciones", error)
        return []
    }
}