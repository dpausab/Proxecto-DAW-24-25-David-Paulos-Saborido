import { ajax } from "./ajaxF.js"

const $d = document,
            $servicios = $d.querySelector("tbody"),
            $form = $d.querySelector("#form-servicios") ?? null,
            $filtros = $d.querySelector("#filtros"),
            $paginacion = $d.querySelector("#paginacion"),
            $clienteF = $d.querySelector("#cliente_filtro"),
            $fechaF = $d.querySelector("#fecha_filtro"),
            $submit = $form?.querySelector("button") ?? null,
            $tabla = $d.querySelector("table")

const estados = {
    1: 'Nuevo',
    2: 'En curso',
    3: 'Acabado'
}
let servicios = []

let next = null;

const page = new URLSearchParams(window.location.search).get("page") ?? 1;
let user = null

$d.addEventListener("DOMContentLoaded", async () => {
    user = await ajax({url:"/api/auth/getLoggedUser"})
    console.log(user)

    if (user.rol === 1 && $form) {
        adminPanel()
        
        $clienteF.addEventListener("input", ev => {
            ev.preventDefault()
            let filtrados = servicios.filter(el => el.nombre_cliente.toLowerCase().includes(ev.target.value.toLowerCase()))
            renderServicios(filtrados)
        })

        $form.querySelector("#fecha").value = new Date().toISOString().split("T")[0]
        $form.querySelector("#hora").value = "08:00"
        $fechaF.value = new Date().toISOString().split("T")[0]
        $fechaF.addEventListener("change", ev => {
            ev.preventDefault()
            let filtrados = servicios.filter(el => el.fecha_servicio === $fechaF.value)
            renderServicios(filtrados)
        })
    
    }   
    await getServicios()
    renderServicios(servicios)
    renderPaginacion()
    
})
async function getServicios() {
let datos  = await ajax({
        url: `/api/servicios/getAll/${parseInt(page)}`
    })

    servicios = datos.datos
    next = datos.next
}
function renderServicios(servicios) {
    if (servicios.length) {
        $servicios.innerHTML = servicios.map(el => {
            let botones = ""
            if ($form && user.rol === 1) {
                botones = `<td>
                        <button id="editar" data-id="${el.id}">Editar</button>
                        <button id="borrar" data-id="${el.id}">Borrar</button>
                    </td>`
            }
            return `<tr>
                <td>${el.nombre}</td>
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
}

function renderPaginacion() {
    $paginacion.innerHTML = ""
if (page>1) {
        $paginacion.innerHTML += 
        `<p class="paginacion">
            <a href="?page=${parseInt(page)-1}"><- Anterior</a>
        </p>`
    }
    if (next) {
        $paginacion.innerHTML += 
        `<p class="paginacion">
            <a href="?page=${parseInt(page)+1}">Siguiente -></a>
        </p>`
    }
}

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

async function addServicio($form) {
    let {id, nombre, cliente, latitud, longitud, direccion, fecha, hora, estimado} = $form
    
    try {
        if (!validarForm()) return
        let resp = await ajax({
                    url: "/api/servicios/insert",
                    method: 'POST',
                    data: {
                        nombre: nombre.value,
                        cliente: cliente.value,
                        latitud: latitud.value,
                        longitud: longitud.value,
                        direccion: direccion.value,
                        fecha: fecha.value,
                        hora: hora.value,
                        tiempoEstimado: estimado.value
                    }
                })
        
        if(resp.respuesta) {
            swal.fire({
                title: "Servicio agregado",
                icon: "success"
            })
            await getServicios()
            renderServicios(servicios)
        }
    } catch (error) {
        throw new Error()
    }
    
}

async function updateServicio(servicio) {
    try {
        if(!validarForm(servicio)) return
        
        let {id, nombre, cliente, latitud, longitud, direccion, fecha, hora, estimado} = $form

        let resp = await ajax({
                    url: `/api/servicios/update/${id.value}`,
                        method: 'PUT',
                        data: {
                            nombre: nombre.value,
                            cliente: cliente.value,
                            latitud: latitud.value,
                            longitud: longitud.value,
                            direccion: direccion.value,
                            fecha: fecha.value,
                            hora: hora.value,
                            tiempoEstimado: estimado.value
                        } 
                    })
        if (resp.respuesta) {
            swal.fire({
                title: "Servicio editado",
                icon: "success"
            })
            await getServicios()
            renderServicios(servicios)
        }
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'warning'
        })
    }
    
}

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
            await getServicios()
            renderServicios(servicios)
        }
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'warning'
        })
    }
}

async function handleStatus() {
    let id = $form.querySelector('#id').value

    try{
        if (id.length) {
            let servicio = servicios.find(el => el.id == id)
            await updateServicio(servicio)
        } else {
            await addServicio()
        }
        
        $form.reset()
        $submit.textContent = 'Guardar servicio'
    } catch (error) {
        swal.fire({
            title: 'Error',
            icon: 'warning',
            text: 'Fallo en la acción' + error.message
        })
    }
}

function adminPanel() {
        $form.addEventListener("submit", async(ev) => {
            ev.preventDefault()
            handleStatus()
        })

        $servicios.addEventListener("click", async(ev) => {
            ev.preventDefault()

            if (ev.target.dataset.id) {
                if (ev.target.id === "editar") {
                    let servicio = servicios.find(el => el.id == ev.target.dataset.id)
                    formulario(servicio)
                } else {
                    await deleteServicio(ev.target.dataset.id)
                }
            }
        })
}

function validarForm(servicio = null) {
    let errores = []
    let { id, nombre, cliente, latitud, longitud, direccion, fecha, hora, estimado } = $form
    let campos = Array.from($form.querySelectorAll("input, select, textarea"))
    // Se hace el slice para no comprobar el id ni el botónN
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
        console.log(servicio)
        if (new Date(fecha.value).toDateString() < new Date(servicio.fecha_servicio).toDateString()) {
            errores.push("La fecha del servicio no puede ser anterior a la original")
        }
    } else {
        if (new Date(fecha.value).toDateString() < new Date().toDateString()) {
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



