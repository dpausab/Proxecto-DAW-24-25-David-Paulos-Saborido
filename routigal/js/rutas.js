import { ajax } from './ajaxF.js'
import { formatearHoras, formatearTiempo } from './utils.js'

const $d = document,
        $disponibles = $d.querySelector(".servicios-disponibles"),
        $seleccionados = $d.querySelector(".servicios-seleccionados"),
        $inputs = Array.from($d.querySelector('.routigal-form').querySelectorAll('input, select')),
        $puntoPartida = $d.querySelector("#punto-partida"),
        $tecnicos = $d.querySelector("#tecnico"),
        $nombre = $d.querySelector("#nombre"),
        $horaSalida = $d.querySelector("#hora-salida"),
        $distanciaTotal = $d.querySelector("#distancia-total"),
        $tiempoTotal = $d.querySelector("#tiempo-total"),
        $fecha = $d.querySelector("#fecha-ruta"),
        [calcular, guardar, completar] = $d.querySelectorAll("#calcular, #guardar, #completar")

// Guardo las variables en un objeto por tema de limpieza, ya que son muchos.
const VARIABLES = {
    servicios: [],
    serviciosMap: [],
    tecnicos: [],
    tecnicosMap: [],
    ubicaciones: [],
    ubicacionesMap: [],
    horas: [],
    horasMap: [],
    routeWaypoints: [],
    seleccionados: [],
    tramos: [],
    control: null,
    flag: true,
    dragElement: null,
    indexItem: null,
    tiempoRuta: null,
    distanciaRuta: null,
    ruta: null,
    user: null
}

const rutaId = new URLSearchParams(window.location.search).get("ruta") ?? null

/**
 * Función que renderiza el mapa obtenido de Open Street Map en el contenedor del html, crea el Routing.control, que es el gestor de la ruta y le agrega una
 * función para crear automáticamente las etiquetas en cada punto con su nombre y su indice.
 */
function loadMap() {
    const map = L.map('map').setView([42.43, -8.64], 13); // Centrado en Pontevedra
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    VARIABLES.control = L.Routing.control({
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

/**
 * Recupera los servicios de la BBDD.
 * @param {*} $id 
 */
async function getServicios($id=null) {
    try {
        let datos  = await ajax({
            url: $id ? `/api/servicios/getDisponibles/${parseInt($id)}` : `/api/servicios/getDisponibles`
        })

        VARIABLES.servicios = datos
        VARIABLES.servicios.sort((a, b) => a.orden - b.orden)
        console.log(VARIABLES.servicios)
        VARIABLES.servicios.forEach(el => el.duracion_estimada = el.duracion_estimada.slice(0, 5))
        VARIABLES.serviciosMap = new Map(VARIABLES.servicios.map(el => [el.id, el]))

    } catch (error) {
        swal.fire({
            title: 'No se han podido cargar los servicios.',
            icon: 'error'
        })
    }
}

/**
 * Recupera los técnicos de la BBDD.
 */
async function getTecnicos() {
    try {
        let datos  = await ajax({
            url: `/api/usuarios/getTecnicos`
        })

        VARIABLES.tecnicos = datos
        VARIABLES.tecnicosMap = new Map(VARIABLES.tecnicos.map(el => [el.id, el]))
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'error'
        })
    }
}

/**
 * Recupera las ubicaciones de la BBDD.
 */
async function getUbicaciones() {
    try {
        let datos  = await ajax({
            url: `/api/ubicaciones/getAll`
        })

        VARIABLES.ubicaciones = datos.datos
        VARIABLES.ubicacionesMap = new Map(VARIABLES.ubicaciones.map(el => [el.id, el]))
    } catch (error) {
        swal.fire({
            title: 'No se han podido cargar las ubicaciones.',
            icon: 'error'
        })
    }
}

/**
 * Comprueba, a la hora de recargar una ruta, los servicios ya seleccionados, los checkea y vuelve a calcularla.
 * @param {*} $id 
 */
function checkSeleccionados($id=null) {
    if ($id) {
        let checks = Array.from($disponibles.querySelectorAll('input[type="checkbox"]'))
        VARIABLES.servicios.forEach((el, i) => {
            if (el.id_ruta == rutaId) {
                checks[i].checked = true
                VARIABLES.seleccionados.push(formatWaypoint(el))
            }
        })
        VARIABLES.seleccionados.sort((a, b) => a.servicio.orden - b.servicio.orden)
        calcularRuta(VARIABLES.seleccionados)
    }
}

/**
 * Renderiza todos los servicios de forma que tengan un campo donde se refleja el tiempo estimado de cada servicio, la información básica y un checkbox para interactuar.
 * @param {} servicios 
 */
function renderServicios(servicios) {
    $disponibles.innerHTML = servicios.map(el => 
        `<div class="servicio">
            <input class="time" type="time" data-id="${el.id}" value="${el.duracion_estimada}">
            <label for="servicio">${el.direccion} | <span>${el.fecha_servicio} - ${el.hora_servicio.slice(0, 5)}</span></label>
            
            <input type="checkbox" name="servicio" id="servicio" data-id="${el.id}">
        </div>`
    ).join('')

    VARIABLES.horas = Array.from($d.querySelectorAll(".time"))
    VARIABLES.horasMap = new Map(VARIABLES.horas.map(el => [parseInt(el.dataset.id), el]))
}

/**
 * Renderiza los técnicos para poder asignar la ruta.
 * @param {} tecnicos 
 */
function renderTecnicos(tecnicos) {
    if (tecnicos.length) {
        $tecnicos.innerHTML = tecnicos.map(el => 
            `<option value="${el.id}">${el.nombre}</option>`
        ).join('')
    } else {
        $tecnicos.innerHTML = '<option value="">Sin técnicos</option>'
    }
}

/**
 * Renderiza las ubicaciones para seleccionar el punto de partida/destino.
 * @param {*} ubicaciones 
 */
function renderUbicaciones(ubicaciones) {
    if (ubicaciones.length) {
        $puntoPartida.innerHTML = ubicaciones.map(el => 
            `<option value="${el.id}">${el.nombre}</option>`
        ).join('')
    } else {
        $puntoPartida.innerHTML = '<option value="">Sin ubicaciones</option>'
    }
}

/**
 * Renderiza los servicios seleccionados con los KM de su tramo, el tiempo del tramo, el tiempo estimado, hora de llegada y hora de salida.
 * @param {*} seleccionados 
 */
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

/**
 * Renderiza la información de cada tramo hasta el servicio de destino desde el anterior punto.
 * @param {*} tramos 
 */
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

/**
 * Renderiza la información del tiempo total y distancia total de la ruta.
 * @param {*} tramos 
 */
function renderInfo(tramos) {
    VARIABLES.tiempoRuta = 0
    VARIABLES.distanciaRuta = 0
    tramos.forEach(el => {
        VARIABLES.tiempoRuta+=el.tiempo+((el.estimado)??0)
        VARIABLES.distanciaRuta+=el.kms
    })
    let tiempoF = formatearTiempo(VARIABLES.tiempoRuta).split(":")
    let horas = parseFloat(tiempoF[0])>0 ? true : false
    
    $distanciaTotal.textContent = `${VARIABLES.distanciaRuta.toFixed(2)} km`.replace('.', ',')
    $tiempoTotal.textContent = `${horas ? tiempoF[0] + " h " : ""}${tiempoF[1] + " minutos"}`
}

/**
 * Rellena el formulario con los campos correspondientes a la ruta que se está editando.
 * @param {*} ruta 
 */
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

    if (VARIABLES.user.rol != 1) {
        $inputs.every(el => el.disabled=true)
    }

}

/**
 * Función que inicializa las funcionalidades dejando todo a disposición dle usuario para interactuar.
 */
async function start() {
    VARIABLES.user = await ajax({url:"/api/auth/getLoggedUser"})
    loadMap()
    await getTecnicos()
    await getUbicaciones()
    renderTecnicos(VARIABLES.tecnicos)
    renderUbicaciones(VARIABLES.ubicaciones)
    if (rutaId) {
        VARIABLES.ruta = await ajax({url: `/api/rutas/get/${rutaId}`})
        await getServicios(rutaId)
    } else {
        await getServicios()
    }
    formulario(VARIABLES.ruta)
    renderServicios(VARIABLES.servicios)
    checkSeleccionados(rutaId)

    // Cuando la ruta está completada, no se permite seguir editándola, asi que se desactivan los campos y los eventos.
    if (VARIABLES.ruta && VARIABLES.ruta.estado==2) {
        let campos = Array.from($d.querySelectorAll("input, select"))
        calcular.style.display='none'
        guardar.style.display='none'
        completar.style.display='none'
        campos.forEach(el => el.disabled=true)

        let info = document.querySelectorAll(".drag")
        info.forEach(function(el) {
            el.removeEventListener('dragstart', handleDragStart);
            el.removeEventListener('dragover', handleDragOver);
            el.removeEventListener('dragenter', handleDragEnter);
            el.removeEventListener('dragleave', handleDragLeave);
            el.removeEventListener('dragend', handleDragEnd);
            el.removeEventListener('drop', handleDrop);
        }) 
    }

}

/**
 * Devuelve el servicio como objeto latLng para poder añadirlo al mapa y que reconozca las coordenadas, manteniendo el resto de datos.
 * @param {*} servicio 
 * @returns 
 */
function formatWaypoint(servicio) {
    let waypoint = L.latLng(servicio.latitud, servicio.longitud)
    waypoint.servicio = servicio

    return waypoint
}

/**
 * Calcula la ruta manteniendo el orden de principio y final, añadiendo entre medias los objetos latLng creados a partir de los servicios seleccionados.
 * @param {*} seleccionados 
 */
async function calcularRuta(seleccionados) {
    let auxiliar = [...seleccionados]
    VARIABLES.routeWaypoints = []
    let puntoPartida = VARIABLES.ubicacionesMap.get(parseInt($puntoPartida.value))
    let waypointPartida = L.latLng(puntoPartida.latitud, puntoPartida.longitud)
    waypointPartida.nombre = puntoPartida.nombre
    VARIABLES.routeWaypoints.push(waypointPartida)

    auxiliar.forEach(el => {
        VARIABLES.routeWaypoints.push(el)
    })
    VARIABLES.routeWaypoints.push(waypointPartida)
    VARIABLES.control.setWaypoints(VARIABLES.routeWaypoints)
    
    renderSeleccionados(VARIABLES.seleccionados)
    await simularTramos(VARIABLES.routeWaypoints, $horaSalida.value)
    auxiliar = []
}

/**
 * Función que calcula todos los tramos a partir del array de objetos latLng de servicios seleccionados.
 * @param {*} waypoints 
 * @param {*} horaSalida 
 */
export async function simularTramos(waypoints, horaSalida) {
    // Se inicia una pantalla de carga mientras se procesa el cálculo.
    swal.fire({
        title: 'Calculando ruta...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            swal.showLoading();
        }
    });

    VARIABLES.flag = false;
    VARIABLES.tramos = [];
    let currentHoraSalida = formatearHoras(horaSalida);
    
    //Hay que quitar el final para evitar salirse del índice.
    const rutas = await Promise.all(waypoints.slice(0, -1).map(async (origen, i) => {
        const destino = waypoints[i + 1];
        const route = await calcularTramo(origen, destino);
        return { origen, destino, route };
    }));

    VARIABLES.tramos = rutas.map(({origen, destino, route}) => {
        const distanciaKm = parseFloat((route.distance / 1000).toFixed(2));
        let tiempoEstimadoDestino = null
        if (destino.servicio) {
            tiempoEstimadoDestino = formatearHoras(VARIABLES.horasMap.get(destino.servicio.id).value)
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

    renderTramos(VARIABLES.tramos);
    renderInfo(VARIABLES.tramos)
    VARIABLES.flag = true;
    swal.close();
}

/**
 * Por cada tramo se realiza individualmente la llamada a la api de OSRM para que calcule el mismo, devolviendo los datos.
 * @param {*} origen 
 * @param {*} destino 
 * @returns 
 */
export async function calcularTramo(origen, destino) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origen.lng},${origen.lat};${destino.lng},${destino.lat}?overview=full&geometries=geojson`;
    
    try {
        const data = await ajax({url});
        return data.routes[0];
    } catch(error) {
        swal.fire({
            title: 'Error calculando la ruta.',
            icon: 'error'
        })
        return null;
    } 
}

/**
 * Gestiona el guardado de la ruta, actualizando a su vez los servicios seleccionados, asignándoles un id_ruta y el orden dentro de la misma, y el estado "asignado".
 */
async function crearRuta() {
    try {
        let ruta = await ajax({
            url: "/api/rutas/insert",
            method: "POST",
            data: {
                nombre:$nombre.value.trim(),
                distanciaTotal: VARIABLES.distanciaRuta,
                tiempoTotal: formatearTiempo(VARIABLES.tiempoRuta),
                origen: $puntoPartida.value,
                estado: 1,
                tecnico: $tecnicos.value,
                fecha: $fecha.value,
                horaSalida: $horaSalida.value
            }
        })
        let id = ruta.respuesta 
        
        await Promise.all(VARIABLES.seleccionados.map((el, i) =>
            ajax({
                url: `/api/servicios/updateRutaId/${el.servicio.id}`,
                method: "PUT",
                data: {
                    orden: i,
                    id_ruta: parseInt(id),
                    estimado: VARIABLES.horasMap.get(el.servicio.id).value+':00',
                    id_estado: 2,
                    tecnico: $tecnicos.value
                }
            })
        ));
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'error'
        })
    }
    
}

/**
 * Gestiona la edición de la ruta, actualizando a su vez los servicios seleccionados, desasignándolos y dejándolos reseteados.
 */
async function modificarRuta(id) {
    try {
        let ruta = await ajax({
            url: `/api/rutas/update/${id}`,
            method: "PUT",
            data: {
                nombre:$nombre.value.trim(),
                distanciaTotal: VARIABLES.distanciaRuta,
                tiempoTotal: formatearTiempo(VARIABLES.tiempoRuta),
                origen: $puntoPartida.value,
                estado: 1,
                tecnico: $tecnicos.value,
                fecha: $fecha.value,
                horaSalida: $horaSalida.value
            }
        })

        if (ruta.respuesta) {
            await ajax({url: `/api/servicios/reset/${id}`})
            await Promise.all(VARIABLES.seleccionados.map((el, i) =>
                ajax({
                    url: `/api/servicios/updateRutaId/${el.servicio.id}`,
                    method: "PUT",
                    data: {
                        orden: i,
                        id_ruta: parseInt(id),
                        estimado: VARIABLES.horasMap.get(el.servicio.id).value+':00',
                        id_estado: 2,
                        tecnico: $tecnicos.value
                    }
                })
            ));
        }
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'error'
        })
    }
    
}

/**
 * Le asigna el estado de completado a la ruta y sus servicios, no permitiendo que sean editados.
 * @param {*} id 
 */
async function completarRuta(id) {
    try {
        let servicios = await ajax({
            url: `/api/servicios/getPorRuta/${id}`
        })

        if (!servicios || !servicios.length) throw new Error("No se puede completar una ruta que no ha sido creada.")

        let ruta = await ajax({
            url: `/api/rutas/completar/${id}`
        })

        if (ruta.respuesta) {
            let asignados = VARIABLES.servicios.filter(el => el.id_ruta == id)
            await Promise.all(asignados.map((el, i) =>
                ajax({
                    url: `/api/servicios/completar/${el.id}`
                })
            ));
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

function checkHora(hora) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (hora) {
        return regex.test(hora);
    } else {
        return true
    }
}

/**
 * Función básica para checkear los valores del formulario.
 * @param {*} ruta 
 * @returns 
 */
function checkForm(ruta) {
    try {
        if (!$inputs.every(el => el.value.length) || !VARIABLES.seleccionados.length) {
            swal.fire({
                title: 'Todos los campos son obligatorios y debes tener seleccionado mínimo un servicio.',
                icon: 'warning'
            })
            return false
        } 
        if(ruta) {
            if (new Date(ruta.fecha).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
                swal.fire({
                    title: 'La fecha no puede ser anterior a la actual.',
                    icon: 'warning'
                })
                return false
            }
        } else {
            if (new Date($fecha.value).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
                swal.fire({
                    title: 'La fecha no puede ser anterior a la actual.',
                    icon: 'warning'
                })
                return false
            }
        }

        VARIABLES.tramos.forEach((el) => {
            if (!checkHora(el.salidaEstimada)) {
                swal.fire({
                    title: 'Las horas deben estar entre las 00:00 y las 23:59',
                    icon: 'warning'
                })
                return false
            }
            if (!checkHora(el.llegadaEstimada)) {
                swal.fire({
                    title: 'Las horas deben estar entre las 00:00 y las 23:59',
                    icon: 'warning'
                })
                return false
            }
        });
    
        return true

    } catch (error) {
        swal.fire({
            title: 'Ha habido un error comprobando el formulario.',
            icon: 'warning',
            text: error.message
        })
    }
}

/**
 * Función que primero valida el formulario y después maneja si es una "inserción" o una "edición".
 * @returns 
 */
async function handleStatus() {
    if (!checkForm()) return;
    try {
        let confirm = await swal.fire({
            title: '¿Seguro que quieres editar la ruta?',
            icon: 'info'
        })

        if (confirm.isConfirmed) {
            if (!rutaId) {
                await crearRuta()
            } else {
                await modificarRuta(rutaId)
            }
            await swal.fire({
                title: 'Completado!',
                icon: 'success'
            })
        } else return
            
        window.location.href = '/html/listado_rutas.php'
    } catch (error){
        swal.fire({
            title: 'Error en la acción!',
            icon: 'error'
        })
    }
}

$d.addEventListener("DOMContentLoaded", start)

// Maneja el evento de las checkbox, si se hace check, se formatea el servicio y se añade a los seleccionados, si no, se quita.
$disponibles.addEventListener("click", ev => {
    if (!VARIABLES.flag) ev.preventDefault()
    let target = ev.target
    if (target.id == "servicio" && VARIABLES.flag) {
        if (target.checked) {
            let servicio = VARIABLES.serviciosMap.get(parseInt(target.dataset.id))
            let waypoint = formatWaypoint(servicio)
            VARIABLES.seleccionados.push(waypoint)        
        } else {
            let servicioIndex = VARIABLES.seleccionados.findIndex(el => el.servicio.id === parseInt(target.dataset.id))
            VARIABLES.seleccionados.splice(servicioIndex, 1)
        }
        calcularRuta(VARIABLES.seleccionados)
    }
})

// Gestiona el click del botón de recalcular, recalculando la ruta.
calcular.addEventListener("click", ev => {
    ev.preventDefault()

    simularTramos(VARIABLES.routeWaypoints, $horaSalida.value)
})

guardar.addEventListener("click", async (ev) => {
    ev.preventDefault()
    await handleStatus()

})

completar.addEventListener("click", async(ev) => {
    ev.preventDefault()
    try {
        await completarRuta(rutaId)
        await swal.fire({
            title: 'Ruta completada.',
            icon: 'success'
        })
        window.location.reload()
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'error'
        })
    }
})
// Esta sección de código es básicamente para intercambiar el orden dentro del array de una forma más dinámica.
// Tuve que buscar la forma porque al intentarlo no me daba salido, al final lo adapté un poco a mi forma, porque la forma que encontré me parecía demasiaod larga para conseguir algo tan secillo.
// Lo que hace es básicamente intercambiar los datos entre posiciones del array.
function handleDragStart(e) {
    this.style.opacity = '0.4';
    VARIABLES.dragElement = this
    VARIABLES.indexItem = parseInt(VARIABLES.dragElement.dataset.index)
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

    if (VARIABLES.dragElement !== this) {
        let old = VARIABLES.seleccionados[parseInt(this.dataset.index)]
        VARIABLES.seleccionados[parseInt(this.dataset.index)] = VARIABLES.seleccionados[VARIABLES.indexItem]
        VARIABLES.seleccionados[VARIABLES.indexItem] = old
        renderSeleccionados(VARIABLES.seleccionados)
        calcularRuta(VARIABLES.seleccionados)
    }
    return false;
}