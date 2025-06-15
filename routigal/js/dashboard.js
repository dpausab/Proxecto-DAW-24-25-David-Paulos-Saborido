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
    
    renderDatos()
})

/**
 * Función que recibe los datos de los servicios de la BBDD.
 */
async function getServicios() {
    let serviciosData = []

    try {
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
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'error'
        })
    }

}

/**
 * Función que recibe los datos de las rutas de la BBDD.
 */
async function getRutas() {
    let rutasData = []
    try {
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
    } catch (error) {
         swal.fire({
            title: error.message,
            icon: 'error'
        })
    }

}

/**
 * Función que renderiza los datos recibidos, mostrando las rutas creadas, las completadas, el total de horas y total de km.
 */
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