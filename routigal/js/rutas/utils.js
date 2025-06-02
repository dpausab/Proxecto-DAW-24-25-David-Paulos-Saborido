import { store } from "./store.js"

const { dom: DOM, variables: VARIABLES } = store;
// Formatea los tickets seleccionados para añadirlos al array de tickets seleccionados, en formato latLng, para su posterior uso en *calcularRuta*
export function formatWaypoint(id) {
    let selectsMap = new Map(VARIABLES.selects.map(el => [parseInt(el.dataset.id), el]))
    let mod = VARIABLES.ticketsMap.get(parseInt(id)) 
    let select = selectsMap.get(mod.id)  
    

    let modData = L.latLng(mod.latitud, mod.longitud)
      modData.id = mod.ubicacion
      modData.ticket = mod.id
      modData.ticketizar = mod.ticketizar
      modData.nombre = mod.nombre
      modData.latitud = mod.latitud
      modData.longitud = mod.longitud
      modData.estimado = select.value
      modData.estado = mod.estado
      modData.horario = mod.horario.includes("-") ? mod.horario : "00:00-00:00"
      modData.cge = mod.cge
      modData.orden = mod.orden

    return modData 
}
// Función simple que formatea los segundos a horas y minutos.
export function formatearTiempo(segundos) {
    let horas = parseFloat(Math.floor(segundos/3600)).toString().padStart(2, "0")
    let minutos = parseFloat(Math.floor(((segundos) - (horas*3600)) / 60)).toString().padStart(2, "0")
    
    return `${horas}:${minutos}`.trim();
}
// Función simple de formateo de horas, para recoger las horas de la BBDD y la hora de inicio.
export function formatearHoras(hora) {
    let [horas, minutos] = hora.split(':').map(Number)
    return horas*3600+minutos*60
}
// Función que adapta los waypoints, añadiendo el tiempo estimado y el orden de ruta.
export function formatearSelected(waypoints) {    
    waypoints.forEach((el, i) => {
        let select = VARIABLES.selects.find(sel => sel.dataset.id == el.ticket)
        el.estimado = select.value
        el.orden = i
    })
    return waypoints
}
export function formatearAcciones() {
    console.log("Entra en formatear")
    let aux = [...VARIABLES.selected]
    let selectedMap = new Map(aux.map(el => [el.ticket, el]))
    let asignadosMap = new Map(VARIABLES.ticketsAsignados.map(el => [el.id, el]))
    VARIABLES.ticketsDelete = VARIABLES.ticketsCGE.filter(el => !selectedMap.get(el.id))
    
    let ticketsUpdate = VARIABLES.ticketsCGE.filter(el => asignadosMap.get(el.id)).map(el => el.id)
    let ticketsDelete = [...VARIABLES.ticketsDelete].map(el => el.id)
    console.log("tickets Delete", VARIABLES.ticketsDelete)
    console.log("tickets Update", ticketsUpdate)
    // Reintroduce los tickets borrados en el array auxiliar para posteriormente poder mandarlos al cge, manteniendo sus datos.
    VARIABLES.ticketsDelete.forEach(el => {
        let ticket = formatWaypoint(el.id)
        aux.push(ticket)
    })
    formatearSelected(aux)
    console.log("aux", aux)
    console.log("ticketsDelete", ticketsDelete)
    aux.forEach(el => {
        el.accion = 1
        if (ticketsUpdate.includes(el.ticket)) {
            el.accion = 2
        } 
        if (ticketsDelete.includes(el.ticket)) {
            el.accion = 3
        } 
        
    })
    return aux
}

export function formulario(ruta=null) {
    if (ruta) {
        DOM.availeable.style.display = "block"
        let origenRuta = VARIABLES.ubicaciones.find(el => el.id === parseInt(ruta.origen))
        let destinoRuta = VARIABLES.ubicaciones.find(el => el.id === parseInt(ruta.destino))
        
        DOM.inputs.nombreRuta.value = ruta.nombre
        DOM.inputs.fecha.value = ruta.fecha
        DOM.selects.tecnico.value = ruta.tecnico
        DOM.selects.origen.value = `${origenRuta.nombre}/${parseFloat(origenRuta.x)}/${parseFloat(origenRuta.y)}/${origenRuta.id}`
        DOM.selects.destino.value = `${destinoRuta.nombre}/${parseFloat(destinoRuta.x)}/${parseFloat(destinoRuta.y)}/${destinoRuta.id}`
        DOM.inputs.horaSalida.value = ruta.hora ? ruta.hora.substring(0, 5) : DOM.inputs.horaSalida.value
        DOM.inputs.kmInicio.value = ruta.kmInicio ?? ""
        DOM.inputs.kmFinal.value = ruta.kmFinal ?? ""
    } else {
        DOM.document.querySelectorAll('input[type="checkbox"]')
            .forEach(el => el.checked = false);
        DOM.form.reset();
        
        let startDefault = VARIABLES.ubicaciones.find(el => el.id == 5);
        DOM.selects.origen.value = `${startDefault.nombre}/${parseFloat(startDefault.x)}/${parseFloat(startDefault.y)}/${startDefault.id}`;
        DOM.selects.destino.value = `${startDefault.nombre}/${parseFloat(startDefault.x)}/${parseFloat(startDefault.y)}/${startDefault.id}`;

        DOM.inputs.tiempoTotal.textContent = "No existe una ruta";
        DOM.inputs.distanciaTotal.textContent = "No existe una ruta";
        
        DOM.selected.innerHTML = "--";
        DOM.inputs.fecha.value = new Date().toISOString().split('T')[0];
        DOM.inputs.horaSalida.value = "08:00";
    }
}