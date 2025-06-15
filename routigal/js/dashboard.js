import { ajax } from "./ajaxF.js";
import { formatearHoras, formatearTiempo } from "./utils.js";

const $d = document,
    $totales = $d.querySelector("#totales"),
    $completados = $d.querySelector("#completados"),
    $tiempo = $d.querySelector("#tiempo-total"),
    $kmTotales = $d.querySelector("#km_totales"),
    $servicios = $d.querySelector("#list-servicios")

let servicios = []
let rutas = []
let user = null
$d.addEventListener("DOMContentLoaded", async () => {
    user = await ajax({url:"/api/auth/getLoggedUser"}) ?? null
    
    await getServicios()
    await getRutas()
    $totales.textContent = servicios.length
    $completados.textContent = servicios.filter(el => el.id_estado == 3).length
    let tiempoTotal = rutas.reduce((anterior, actual) => {
        return anterior + formatearHoras(actual.tiempoTotal)
    },0)
    tiempoTotal = formatearTiempo(tiempoTotal).split(':')

    $tiempo.textContent = `${tiempoTotal[0]} h ${tiempoTotal[1]} minutos`

    let distanciaTotal = rutas.reduce((anterior, actual) => {
        return anterior + parseFloat(actual.distanciaTotal)
    },0)

    $kmTotales.textContent = distanciaTotal+' km'
    
    renderDatos()
})

async function getServicios() {
    let serviciosData = []

    if (user.rol === 1) {
        serviciosData = await ajax({
            url: `/api/servicios/getAll`
        })
    } else {
        serviciosData = await ajax({
            url: `/api/servicios/getAll?id=${user.id}`
        })
    }

    servicios = serviciosData.datos
}
async function getRutas() {
    let rutasData = []

    if (user.rol === 1) {
        rutasData = await ajax({
            url: `/api/rutas/getAll`
        })
    } else {
        rutasData = await ajax({
            url: `/api/rutas/getAll?id=${user.id}`
        })
    }

    rutas = rutasData.datos
}

function renderDatos() {
    $totales.textContent = rutas.length

    $completados.textContent = rutas.filter(el => el.estado == 'Realizada').length
    let tiempoTotal = rutas.reduce((anterior, actual) => {
        return anterior + formatearHoras(actual.tiempoTotal)
    },0)
    tiempoTotal = formatearTiempo(tiempoTotal).split(':')

    $tiempo.textContent = `${tiempoTotal[0]} h ${tiempoTotal[1]} minutos`

    let distanciaTotal = rutas.reduce((anterior, actual) => {
        return anterior + parseFloat(actual.distanciaTotal)
    },0)

    $kmTotales.textContent = distanciaTotal+' km'

    let serviciosPrimeros = [...servicios].sort((a, b) => new Date(a.fecha_servicio) + new Date(b.fecha_servicio)).splice(0,5)
    $servicios.innerHTML = serviciosPrimeros.map(el => 
        `<li>${el.fecha_servicio} - ${el.nombre}`
    ).join('')
}