import { ajax } from './ajaxF.js'

const $d = document,
        $disponibles = $d.querySelector(".servicios-disponibles"),
        $seleccionados = $d.querySelector(".servicios-seleccionados"),
        $inputs = Array.from($d.querySelector('form').querySelectorAll('input, select')),
        $puntoPartida = $d.querySelector("#punto-partida"),
        $tecnicos = $d.querySelector("#tecnico"),
        $nombre = $d.querySelector("#nombre"),
        $horaSalida = $d.querySelector("#hora-salida"),
        $distanciaTotal = $d.querySelector("#distancia-total"),
        $tiempoTotal = $d.querySelector("#tiempo-total"),
        $fecha = $d.querySelector("#fecha-ruta"),
        [calcular, guardar] = $d.querySelectorAll("#calcular, #guardar")

let servicios = []
let serviciosMap = []
let tecnicos = []
let tecnicosMap = []
let ubicaciones = []
let ubicacionesMap = []
let horas = []
let horasMap = []
let routeWaypoints = []

let seleccionados = []
let tramos = []

let control
let flag = true
let dragElement
let indexItem

let tiempoRuta
let distanciaRuta

let ruta = null
const rutaId = new URLSearchParams(window.location.search).get("ruta") ?? null
let user = null;


function loadMap() {
    const map = L.map('map').setView([42.43, -8.64], 13); // Centrado en Pontevedra
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    control = L.Routing.control({
    default: false,
    draggeable: false,
    lineOptions: {
        styles: [{color: 'blue', opacity: 1, weight: 5}]
    },
    waypoints: [],
    createMarker: function(i, waypoint) {
        const name = waypoint.latLng.nombre ?? waypoint.latLng.servicio.direccion
        const marker = L.marker(waypoint.latLng)
        .bindTooltip(`${i} - ${name}`, {
            permanent: true,
            direction: 'top',
            offset: [-15, -10],
            className: 'map-label'
        })
        .openTooltip();
        return marker;
    },
    zoom: 8,
    show: false
    }).addTo(map);
}

async function getServicios($id=null) {
    try {
        let datos  = await ajax({
            url: $id ? `http://localhost/api/servicios/getDisponibles/${parseInt($id)}` : `http://localhost/api/servicios/getDisponibles`
        })

        servicios = datos
        servicios.forEach(el => el.duracion_estimada = el.duracion_estimada.slice(0, 5))
        serviciosMap = new Map(servicios.map(el => [el.id, el]))
    } catch (error) {
        console.log(error)
    }
}
async function getTecnicos() {
    try {
        let datos  = await ajax({
            url: `http://localhost/api/usuarios/getTecnicos`
        })

        tecnicos = datos
        tecnicosMap = new Map(tecnicos.map(el => [el.id, el]))
    } catch (error) {
        swal.fire({
            title: 'No se han podido cargar los técnicos.',
            icon: 'error'
        })
    }
}
async function getUbicaciones() {
    try {
        let datos  = await ajax({
            url: `http://localhost/api/ubicaciones/getAll`
        })

        ubicaciones = datos
        ubicacionesMap = new Map(ubicaciones.map(el => [el.id, el]))
    } catch (error) {
        swal.fire({
            title: 'No se han podido cargar las ubicaciones.',
            icon: 'error'
        })
    }
}

function checkSeleccionados($id=null) {
    if ($id) {
        let checks = Array.from($disponibles.querySelectorAll('input[type="checkbox"]'))
        servicios.forEach((el, i) => {
            if (el.id_ruta == rutaId) {
                checks[i].checked = true
                seleccionados.push(formatWaypoint(el))
            }
        })
        seleccionados.sort((a, b) => a.servicio.orden - b.servicio.orden)
        calcularRuta(seleccionados)
    }
}

function renderServicios(servicios) {
    $disponibles.innerHTML = servicios.map(el => 
        `<div class="servicio">
            <input class="time" type="time" data-id="${el.id}" value="${el.duracion_estimada}">
            <label for="servicio">${el.direccion} | <span>${el.fecha_servicio} - ${el.hora_servicio.slice(0, 5)}</span></label>
            
            <input type="checkbox" name="servicio" id="servicio" data-id="${el.id}">
        </div>`
    ).join('')

    horas = Array.from($d.querySelectorAll(".time"))
    horasMap = new Map(horas.map(el => [parseInt(el.dataset.id), el]))
    console.log(horasMap)
}

function renderTecnicos(tecnicos) {
    if (tecnicos.length) {
        $tecnicos.innerHTML = tecnicos.map(el => 
            `<option value="${el.id}">${el.nombre}</option>`
        ).join('')
    } else {
        $tecnicos.innerHTML = '<option value="">Sin técnicos</option>'
    }
}

function renderUbicaciones(ubicaciones) {
    if (ubicaciones.length) {
        $puntoPartida.innerHTML = ubicaciones.map(el => 
            `<option value="${el.id}">${el.nombre}</option>`
        ).join('')
    } else {
        $puntoPartida.innerHTML = '<option value="">Sin ubicaciones</option>'
    }
}

function renderSeleccionados(seleccionados) {
    $seleccionados.innerHTML = seleccionados.map((el, i) => 
        `<div class="drag" draggable="true" data-index="${i}">
            <p>${i+1} - ${el.servicio.direccion}</p>
            <div class="info-tramo" data-id="${el.servicio.id}"></div>
        </div>`
    ).join('')

    // En esta parte se les añaden las funciones de drag a los servicios seleccionados.
    let info = document.querySelectorAll(".drag")
        info.forEach(function(el) {
            el.addEventListener('dragstart', handleDragStart);
            el.addEventListener('dragover', handleDragOver);
            el.addEventListener('dragenter', handleDragEnter);
            el.addEventListener('dragleave', handleDragLeave);
            el.addEventListener('dragend', handleDragEnd);
            el.addEventListener('drop', handleDrop);
        }) 
}

function renderTramos(tramos) {
    let info = Array.from($seleccionados.querySelectorAll(".info-tramo"))
    tramos.forEach(el => {
        let div = info.find(inf => parseInt(inf.dataset.id) === el.servicio)
        if (div) {
            div.innerHTML=
            `<ul>
                <li>${el.kms} kms</li>
                <li>${formatearTiempo(el.tiempo)}</li>
                <li>${formatearTiempo(el.estimado)}</li>
                <li>${el.llegadaEstimada}</li>
                <li>${el.salidaEstimada}</li>
            </ul>`
        }
    })
}

export function renderInfo(tramos) {
    tiempoRuta = 0
    distanciaRuta = 0
    tramos.forEach(el => {
        tiempoRuta+=el.tiempo+((el.estimado)??0)
        distanciaRuta+=el.kms
    })
    let tiempoF = formatearTiempo(tiempoRuta).split(":")
    let horas = parseFloat(tiempoF[0])>0 ? true : false
    
    $distanciaTotal.textContent = `${distanciaRuta.toFixed(2)} km`.replace('.', ',')
    $tiempoTotal.textContent = `${horas ? tiempoF[0] + " h " : ""}${tiempoF[1] + " minutos"}`
}


function formulario(ruta) {
    if (ruta) {
        guardar.textContent = "Editar"
        $nombre.value = ruta.nombre
        $tecnicos.value = ruta.tecnico
        $horaSalida.value = ruta.horaSalida.slice(0, 5)
        $fecha.value = ruta.fecha
    } else {
        $fecha.value = new Date().toLocaleDateString('sv-SE');
        $horaSalida.value = '08:00'
    }

}

async function start() {
    user = await ajax({url:"http://localhost/api/auth/getLoggedUser"})
    loadMap()
    await getTecnicos()
    await getUbicaciones()
    renderTecnicos(tecnicos)
    renderUbicaciones(ubicaciones)
    if (rutaId) {
        ruta = await ajax({url: `http://localhost/api/rutas/get/${rutaId}`})
        console.log(ruta)
        await getServicios(rutaId)
    } else {
        await getServicios()
    }
    formulario(ruta)
    renderServicios(servicios)
    checkSeleccionados(rutaId)

}

function formatWaypoint(servicio) {
    let waypoint = L.latLng(servicio.latitud, servicio.longitud)
    waypoint.servicio = servicio

    return waypoint
}

async function calcularRuta(seleccionados) {
    let auxiliar = [...seleccionados]
    routeWaypoints = []
    let puntoPartida = ubicacionesMap.get(parseInt($puntoPartida.value))
    let waypointPartida = L.latLng(puntoPartida.latitud, puntoPartida.longitud)
    waypointPartida.nombre = puntoPartida.nombre
    routeWaypoints.push(waypointPartida)

    auxiliar.forEach(el => {
        routeWaypoints.push(el)
    })
    routeWaypoints.push(waypointPartida)
    control.setWaypoints(routeWaypoints)
    
    renderSeleccionados(seleccionados)
    await simularTramos(routeWaypoints, $horaSalida.value)
    auxiliar = []
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

export async function simularTramos(waypoints, horaSalida) {
    swal.fire({
        title: 'Calculando ruta...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            swal.showLoading();
        }
    });

    flag = false;
    tramos = [];
    let currentHoraSalida = formatearHoras(horaSalida);
    
    
    const rutas = await Promise.all(waypoints.slice(0, -1).map(async (origen, i) => {
        const destino = waypoints[i + 1];
        const route = await calcularTramo(origen, destino);
        return { origen, destino, route };
    }));

    tramos = rutas.map(({origen, destino, route}) => {
        const distanciaKm = parseFloat((route.distance / 1000).toFixed(2));
        let tiempoEstimadoDestino = null
        if (destino.servicio) {
            tiempoEstimadoDestino = formatearHoras(horasMap.get(destino.servicio.id).value)
        }
        const intervencion = (tiempoEstimadoDestino ?? 0) + route.duration;
        const tramo = {
            nombre: `tramo pruebas`,
            origen: origen.servicio?.cliente ?? null,
            destino: destino.servicio?.cliente ?? null,
            kms: distanciaKm,
            tiempo: route.duration,
            servicio: destino.servicio?.id ?? null,
            estimado: tiempoEstimadoDestino ?? null,
            llegadaEstimada: formatearTiempo(route.duration + currentHoraSalida),
            salidaEstimada: destino.servicio ? formatearTiempo(intervencion + currentHoraSalida) : null
        };

        currentHoraSalida += intervencion;
        return tramo;
    });

    renderTramos(tramos);
    renderInfo(tramos)
    flag = true;
    swal.close();
}

export async function calcularTramo(origen, destino) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;
    
    try {
        const data = await ajax({url});
        return data.routes[0];
    } catch(error) {
        console.error("Error calculando tramo:", error);
        return null;
    } 
}

$d.addEventListener("DOMContentLoaded", start)

$disponibles.addEventListener("click", ev => {
    if (!flag) ev.preventDefault()
    let target = ev.target
    if (target.id == "servicio" && flag) {
        if (target.checked) {
            let servicio = serviciosMap.get(parseInt(target.dataset.id))
            let waypoint = formatWaypoint(servicio)
            seleccionados.push(waypoint)        
        } else {
            let servicioIndex = seleccionados.findIndex(el => el.servicio.id === parseInt(target.dataset.id))
            seleccionados.splice(servicioIndex, 1)
        }
        calcularRuta(seleccionados)
    }
})

calcular.addEventListener("click", ev => {
    ev.preventDefault()

    simularTramos(routeWaypoints, $horaSalida.value)
})

async function crearRuta() {
    try {
        let ruta = await ajax({
            url: "http://localhost/api/rutas/insert",
            method: "POST",
            data: {
                nombre:$nombre.value.trim(),
                distanciaTotal: distanciaRuta,
                tiempoTotal: formatearTiempo(tiempoRuta),
                origen: $puntoPartida.value,
                estado: 1,
                tecnico: $tecnicos.value,
                fecha: $fecha.value,
                horaSalida: $horaSalida.value
            }
        })
        let id = ruta.respuesta 
        
        await Promise.all(seleccionados.map((el, i) =>
            ajax({
                url: `http://localhost/api/servicios/updateRutaId/${el.servicio.id}`,
                method: "PUT",
                data: {
                    orden: i,
                    id_ruta: parseInt(id),
                    estimado: horasMap.get(el.servicio.id).value+':00',
                    id_estado: 2,
                    tecnico: $tecnicos.value
                }
            })
        ));
    } catch (error) {
        throw new Error(error.message)
    }
    
}

async function modificarRuta(id) {
    try {
        let ruta = await ajax({
            url: `http://localhost/api/rutas/update/${id}`,
            method: "PUT",
            data: {
                nombre:$nombre.value.trim(),
                distanciaTotal: distanciaRuta,
                tiempoTotal: formatearTiempo(tiempoRuta),
                origen: $puntoPartida.value,
                estado: 1,
                tecnico: $tecnicos.value,
                fecha: $fecha.value,
                horaSalida: $horaSalida.value
            }
        })
        await ajax({url: "http://localhost/api/servicios/reset"})
        await Promise.all(seleccionados.map((el, i) =>
            ajax({
                url: `http://localhost/api/servicios/updateRutaId/${el.servicio.id}`,
                method: "PUT",
                data: {
                    orden: i,
                    id_ruta: parseInt(id),
                    estimado: horasMap.get(el.servicio.id).value+':00',
                    id_estado: 2,
                    tecnico: $tecnicos.value
                }
            })
        ));
    } catch (error) {
        throw new Error(error.message)
    }
    
}

guardar.addEventListener("click", async (ev) => {
    ev.preventDefault()
    if (!$inputs.every(el => el.value.length) || !seleccionados.length) {
        swal.fire({
            title: 'Todos los campos son obligatorios y debes tener seleccionado mínimo un servicio.',
            icon: 'warning'
        })
    } else if (new Date($fecha.value).toDateString() < new Date().toDateString()) {
        swal.fire({
            title: 'La fecha no puede ser anterior a la actual.',
            icon: 'warning'
        })
        
    } else{
        try {
            if (!rutaId) {
                await crearRuta()
            } else {
                await modificarRuta(rutaId)
            }
            await swal.fire({
                title: 'Completado!',
                icon: 'success'
            })
            window.location.reload()
        } catch (error){
            swal.fire({
                title: 'No se ha podido realizar la acción.',
                icon: 'error'
            })
        }
    }
})

// Esta sección de código es básicamente para intercambiar el orden dentro del array de una forma más dinámica.
// Tuve que buscar la forma porque al intentarlo no me daba salido, al final lo adapté un poco a mi forma, porque la forma que encontré me parecía demasiaod larga para conseguir algo tan secillo.
function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragElement = this
    indexItem = parseInt(dragElement.dataset.index)
}

function handleDragEnd(e) {
    this.style.opacity = '1';

    document.querySelectorAll(".drag").forEach(function (item) {
      item.classList.remove('over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation(); 

    if (dragElement !== this) {
        let old = seleccionados[parseInt(this.dataset.index)]
        seleccionados[parseInt(this.dataset.index)] = seleccionados[indexItem]
        seleccionados[indexItem] = old
        renderSeleccionados(seleccionados)
        calcularRuta(seleccionados)
    }
    return false;
}