import { store } from './store.js'
import { formatearTiempo, formatearHoras } from './utils.js'
import { handleDragStart, handleDragOver, handleDragEnter, handleDragLeave, handleDragEnd, handleDrop } from './drag.js'

const { dom: DOM, variables: VARIABLES } = store;
// Función que muestra los tickets como ubicaciones seleccionables.
export function renderTickets(arr, fn) {
    DOM.availeable.innerHTML = arr.map((el, i) => 
        `<div class="ticket-container">
            <div class="ticket d-flex align-items-center gap-2 mb-2">
                <select class="form-select" name="selectTiempoUbi" id="selectUbi" data-id="${el.id}">
                    <option value="0">0 min</option>
                    <option value="5">5 min</option>
                    <option value="10">10 min</option>
                    <option value="15">15 min</option>
                    <option value="20">20 min</option>
                    <option value="25">25 min</option>
                    <option value="30">30 min</option>
                    <option value="35">35 min</option>
                    <option value="40">40 min</option>
                    <option value="45">45 min</option>
                    <option value="50">50 min</option>
                    <option value="55">55 min</option>
                    <option value="60">1 hora</option>
                </select>
                <div id="ticket_info" class="flex-grow-1 d-flex justify-content-between flex-gap-2 align-items-center">
                    <label class="flex-grow-1" for="ubi${i}">${el.nombre} - (${el.horario.length > 2 ? el.horario : '00:00-00:00'})</label>
                    <button class="btn flex-grow-2" data-id="${el.id}">
                        <i class="bi bi-info-circle"></i>
                    </button>
                    <input class="flex-grow-2" type="checkbox" name="ubi${i}" id="ubi${i}" data-intervencion="${el.intervencion}" data-name="${el.nombre}" data-id="${el.id}" data-ubicacion="${el.ubicacion}" data-estado="${el.estado}" data-ruta="${el.ruta}">
                    </div>
            </div>
            <!-- Contenedor del pop-up -->
            <div class="popup-content" data-id="${el.id}">
                <p>Información adicional del ticket:</p>
                <p>Nombre: ${el.nombre}</p>
                <p>Ticket CGE: ${el.ticketizar}</p>
                <p>Prioridad: ${el.prioridad}</p>
                <p>Descripción: ${el.ticket_descripcion}</p>
                <p>Observaciones: ${el.ticket_observaciones}</p>
            </div>
        </div>`
    ).join('');

    // Seleccionamos todos los selects y les añadimos un listener para que se actualicen al cambiar el valor.
    if (fn) fn();
    
}
// Función que renderiza los técnicos como opciones seleccionables.
export function renderTecnicos(arr) {
    DOM.selects.tecnico.innerHTML = arr.map(el => 
        `
        <option value="${el.id}">${el.alias}</option>
        `
    ).join('')
}
// Función que renderiza las ubicaciones como opciones seleccionables.
export function renderUbicaciones(arr) {
    DOM.selects.origen.innerHTML = arr.map(el => 
        `
        <option value="${el.nombre}/${parseFloat(el.x)}/${parseFloat(el.y)}/${el.id}">${el.nombre}</option>
        `
    ).join('')
    
    DOM.selects.destino.innerHTML = arr.map(el => 
        `
        <option value="${el.nombre}/${parseFloat(el.x)}/${parseFloat(el.y)}/${el.id}">${el.nombre}</option>
        `
    ).join('')
}
export function renderTramos(arr, divs) {
    if (arr.length) {
        let tramosMap = new Map(VARIABLES.tramos.map(el => [el.ticket, el]))
        let selectedMap = new Map(VARIABLES.selected.map(el => [el.ticket, el]))
        divs.forEach(el => {
            let tramo = tramosMap.get(parseInt(el.dataset.ticket))
            let ticket = selectedMap.get(parseInt(el.dataset.ticket)).horario.split("-")
            let cierre = formatearHoras(ticket[1])
            let tiempoF = formatearTiempo(tramo.tiempo).split(":")
            let horas = parseFloat(tiempoF[0])>0 ? true : false
            let minutos = parseFloat(tiempoF[1])>0 ? true : false

            let color = ticket[1] == "00:00" || cierre > formatearHoras(tramo.llegadaEstimada) ? "green" : "red"
            let color2 = ticket[1] == "00:00" || cierre > formatearHoras(tramo.salidaEstimada) ? "green" : "red"
            VARIABLES.posible = color=="green" && color2=="green" ? true : false
            let loader = el.querySelector(".loader-wrapper")    
            loader.classList.remove("loader-wrapper")

            loader.innerHTML=
            `
            <div id="separador"></div>
            <div class="tramos">
                <div>${tramo.kms} km</div>
                <div>${horas ? tiempoF[0]+' h ' : ""}${minutos ? tiempoF[1]+' min' : ""}</div>
                <div>${tramo.estimado} min</div>
                <div style="background-color: ${color}; font-weight:bold; color: white;">${tramo.llegadaEstimada}</div>
                <div style="background-color: ${color2}; font-weight:bold; color: white;">${tramo.salidaEstimada}</div>
            </div>`
        })
    } else {
        DOM.tramos.innerHTML = "<p>Selecciona las ubicaciones deseadas</p>"
    }   
}
// Función que renderiza la información total de la ruta.
export function renderInfo(tramos) {
    VARIABLES.tiempoRuta = 0
    VARIABLES.distanciaRuta = 0
    VARIABLES.tramos.forEach(el => {
        VARIABLES.tiempoRuta+=el.tiempo+((el.estimado*60)??0)
        VARIABLES.distanciaRuta+=el.kms
    })
    let tiempoF = formatearTiempo(VARIABLES.tiempoRuta).split(":")
    let horas = parseFloat(tiempoF[0])>0 ? true : false
    let minutos = parseFloat(tiempoF[1])
    
    DOM.inputs.distanciaTotal.textContent = `${VARIABLES.distanciaRuta.toFixed(2)} km`.replace('.', ',')
    DOM.inputs.tiempoTotal.textContent = `${horas ? tiempoF[0] + " h " : ""}${tiempoF[1] + " minutos"}`
}
// Función que gestiona los tickets seleccionados como puntos de ruta.
export function renderSelected(waypoints) {
    // Por cada elemento de las ubicaciones seleccionadas se crea un div, representando su selección en otra sección del HTML.
    DOM.selected.innerHTML = waypoints.map((el, i) => 
        `<div draggable="true" class="po text-start fw-semibold" data-id="${i}" data-ticket="${el.ticket}">
            ${i+1} - ${el.nombre}
            <div class="infoTicket"></div>
        </div>`).join('')
    

    // Seleccionamos el contenedor y cada div creado anteriormente, añadiendo los Listener a los eventos de drag.
    let rows = document.querySelectorAll(".selected .po")
    rows.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    }) 

}