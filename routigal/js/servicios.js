import { ajax } from "./ajaxF.js"
import { getToday } from "./utils.js"

const $d = document,
            $servicios = $d.querySelector("tbody"),
            $form = $d.querySelector("#form-servicios") ?? null,
            $filtros = $d.querySelector("#filtros"),
            $paginacion = $d.querySelector("#paginacion"),
            $clienteF = $d.querySelector("#cliente_filtro"),
            $fechaF = $d.querySelector("#fecha_filtro"),
            $estadoF = $d.querySelector("#estado_filtro"),
            $submit = $form?.querySelector("button") ?? null


let servicios = []

let next = null;
let actualPage = 1;
let user = null
const today = getToday()


$d.addEventListener("DOMContentLoaded", async () => {
    user = await ajax({url:"/api/auth/getLoggedUser"})

    $fechaF.value = today

    if (user.rol === 1 && $form) {
        adminPanel()
        $form.querySelector("#fecha").value = today
        $form.querySelector("#hora").value = "08:00"
        await getServicios()
    } else {
        await getServicios(user.id)
    }   
    startListeners()
    renderServicios(servicios)
    
})

/**
 * Función que recupera los datos de la BBDD sobre servicios según los parámetros de filtrado.
 * @param {int} id 
 * @param {string} nombre 
 * @param {date} fecha 
 * @param {int} estado 
 * @param {int} page 
 */
async function getServicios(id=null, nombre=null, fecha=null, estado=null, page=actualPage) {
    let datos  = await ajax({
        url: `/api/servicios/getAll/${page}?nombre=${nombre}&fecha=${fecha}&estado=${estado}&id=${id}`
    })

    servicios = datos.datos
    next = datos.next
}

/**
 * Función que renderiza todos los servicios, de forma paginada.
 * @param {Array} servicios 
 */
function renderServicios(servicios) {
    if (servicios.length) {
        $servicios.innerHTML = servicios.map(el => {
            let botones = ""
            if ($form && user.rol === 1) {
                botones = `<td>
                        <div class="acciones">
                            <button class="editar" data-id="${el.id}">Editar</button>
                            <button class="borrar" data-id="${el.id}">Borrar</button>
                        </div>
                    </td>`
            }
            return `<tr>
                <td>${el.nombre}</td>
                <td>${el.nombre_estado}</td>
                <td>${el.nombre_cliente}</td>
                <td>${el.direccion}</td>
                <td>${el.duracion_estimada.slice(0, 5)}</td>
                <td>${el.fecha_servicio} - ${el.hora_servicio.slice(0, 5)}</td>
                ${botones}
                </tr>`
            }).join('')
    } else {
        $servicios.innerHTML = "<tr>No hay servicios.</tr>"
    }

    renderPaginacion()
}

/**
 * Función que comprueba si la base de datos contiene más registros, para mostrar los botones de "siguiente" y "anterior" según corresponda, mediante eventos "click".
 */
function renderPaginacion() {
    $paginacion.innerHTML = ""
    let id = user.rol!=1 ? user.id : null

    if (actualPage>1) {
        $paginacion.innerHTML += 
        `<button class="paginacion" id="anterior">
            <- Anterior
        </button>`

        let botonAnterior = $paginacion.querySelector("#anterior")
        botonAnterior.addEventListener("click", async(ev) => {
            ev.preventDefault()
            let anterior = parseInt(actualPage)-1
            actualPage = anterior
            await getServicios(id, $clienteF.value, $fechaF.value, $estadoF.value, anterior)
            renderServicios(servicios)
        })
    }
    if (next) {
        $paginacion.innerHTML += 
        `<button class="paginacion" id="siguiente">
            Siguiente ->
        </button>`

        let botonSiguiente = $paginacion.querySelector("#siguiente")
        botonSiguiente.addEventListener("click", async(ev) => {
            ev.preventDefault()
            let siguiente = parseInt(actualPage)+1
            actualPage = siguiente
            await getServicios(id, $clienteF.value, $fechaF.value, $estadoF.value, siguiente)
            renderServicios(servicios)
        })
    }
}

/**
 * Función que rellena el formulario con los datos del servicio a editar.
 * @param {object} servicio 
 */
function formulario(servicio) {
    let {id, nombre, cliente, latitud, longitud, direccion, fecha, hora, estimado} = $form

    id.value = servicio.id
    nombre.value = servicio.nombre
    cliente.value = servicio.nombre_cliente
    latitud.value = servicio.latitud
    longitud.value = servicio.longitud
    direccion.value = servicio.direccion
    fecha.value = servicio.fecha_servicio,
    hora.value = servicio.hora_servicio.slice(0, 5),
    estimado.value = servicio.duracion_estimada.slice(0, 5)

    $submit.textContent = 'Editar'
}

/**
 * Llama a la función "getServicios" con los parámetros actualizados dinámicamente de filtrado.
 */
async function filtrar() {
    let id = user.rol!=1 ? user.id : null
    await getServicios(id, $clienteF.value, $fechaF.value, $estadoF.value, 1)
    renderServicios(servicios)
}

/**
 * Inicializa los listeners de los campos de filtrado que llaman a la función "filtrar".
 */
function startListeners() {
    $clienteF.addEventListener("input", async(ev) => {
        ev.preventDefault()
        await filtrar()
    })

    $fechaF.value = new Date().toISOString().split("T")[0]
    $fechaF.addEventListener("change", async(ev) => {
        ev.preventDefault()
        await filtrar()
    })

    $estadoF.addEventListener("change", async(ev) => {
        ev.preventDefault()
        await filtrar()
    }) 
}

/**
 * Función que recupera los valores del formulario devolviéndolos como un objeto.
 * @returns object
 */
function getDatos() {
    let {id, nombre, cliente, latitud, longitud, direccion, fecha, hora, estimado} = $form

    return {
            nombre: nombre.value,
            cliente: cliente.value,
            latitud: latitud.value,
            longitud: longitud.value,
            direccion: direccion.value,
            fecha: fecha.value,
            hora: hora.value,
            tiempoEstimado: estimado.value
        } 
}

/**
 * Función que gestiona la llamada a la API para insertar el nuevo servicio.
 */
async function addServicio() {
    
    try {
        let datos = getDatos()
        let resp = await ajax({
                    url: "/api/servicios/insert",
                    method: 'POST',
                    data: datos
                })
        
        if(resp.respuesta) {
            swal.fire({
                title: "Servicio agregado",
                icon: "success"
            })
        }
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'warning'
        })
    }
    
}

/**
 * Función que gestiona la llamada a la API para editar el servicio.
 */
async function updateServicio(id) {
    try {        
        let datos = getDatos()
        let resp = await ajax({
                    url: `/api/servicios/update/${id}`,
                        method: 'PUT',
                        data: datos
                    })
        if (resp.respuesta) {
            swal.fire({
                title: "Servicio editado",
                icon: "success"
            }) 
        }
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'warning'
        })
    }
    
}

/**
 * Función que gestiona la llamada a la API para borrar un servicio.
 * @param {int} id 
 */
async function deleteServicio(id) {
    try {

        let datos  = await ajax({
                    url: `/api/servicios/delete/${id}`,
                    method: 'DELETE'
                })

        if(datos.respuesta) {
            swal.fire({
                title: "Servicio eliminado",
                icon: "success"
            })
        }
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'warning'
        })
    }
}

/**
 * Función que gestiona las acciones de "crear" y "editar" según haya valor en el campo "id". Previamente valida los inputs del formulario.
 * @returns 
 */
async function handleStatus() {
    let id = $form.querySelector('#id').value

    let servicio = servicios.find(el => el.id == id) ?? null
    if (!validarForm(servicio)) return
    if (servicio) {
        await updateServicio(servicio.id)
    } else {
        await addServicio()
    }
    await getServicios()
    renderServicios(servicios)
    
    reset()
}

/**
 * Resetea el formulario con los valoress por defecto.,
 */
function reset() {
    $form.reset()
    $form.querySelector("#fecha").value = new Date().toISOString().split("T")[0]
    $form.querySelector("#hora").value = "08:00"
    $submit.textContent = 'Guardar servicio'
}

/**
 * Gestiona la vista del formulario para los administradores, desde donde se puedne crear y editar servicios.
 */
function adminPanel() {
        $form.addEventListener("submit", async(ev) => {
            ev.preventDefault()
            handleStatus()
        })

        $servicios.addEventListener("click", async(ev) => {
            ev.preventDefault()

            if (ev.target.dataset.id) {
                if (ev.target.classList.contains("editar")) {
                    let servicio = servicios.find(el => el.id == ev.target.dataset.id)
                    formulario(servicio)
                } else {
                    await deleteServicio(ev.target.dataset.id)
                }
            }
        })
}

/**
 * Función básica de validación de parámtros del formulario.
 * @param {object} servicio 
 * @returns 
 */
function validarForm(servicio = null) {
    let errores = []
    let [latitud, longitud, fecha] = $form.querySelectorAll("#latitud, #longitud, #fecha")
    let campos = Array.from($form.querySelectorAll("input, select, textarea"))

    // Se hace el slice para no comprobar el id ni botómn
    campos = campos.slice(1, campos.length - 1)

    const regexLatitud = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    const regexLongitud = /^-?((1[0-7]\d(\.\d+)?)|([1-9]?\d(\.\d+)?|180(\.0+)?))$/;

    if (!campos.every(el => el.value.trim().length)) {
        errores.push("Todos los campos son obligatorios")
    }

    if (isNaN(latitud.value) || isNaN(longitud.value)) {
        errores.push("Latitud y Longitud deben ser coordenadas válidas")
    }

    if (!regexLatitud.test(latitud.value.trim())) {
        errores.push("Latitud inválida.");
    }

    if (!regexLongitud.test(longitud.value.trim())) {
        errores.push("Longitud inválida.");
    }

    if (servicio) {
        if (new Date(fecha.value).setHours(0,0,0,0) < new Date(servicio.fecha_servicio).setHours(0,0,0,0)) {
            errores.push("La fecha del servicio no puede ser anterior a la original")
        }
    } else {
        if (new Date(fecha.value).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
            errores.push("La fecha del servicio no puede ser anterior a la actual")
        }
    }

    if (errores.length){
        swal.fire({
            title: 'Error',
            icon: 'warning',
            html: errores.map(el => `<p>${el}</p>`).join('')
        })
        return false
    }

    return true
}

$filtros.addEventListener("submit", ev => {
    ev.preventDefault()
})



