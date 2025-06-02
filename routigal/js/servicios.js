import { ajax } from "./ajaxF.js"

const $d = document,
            $servicios = $d.querySelector("tbody"),
            $form = $d.querySelector("#form-servicios") ?? null,
            $filtros = $d.querySelector("#filtros"),
            $clienteF = $filtros.querySelector("#cliente_filtro"),
            $fechaF = $filtros.querySelector("#fecha_filtro"),
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
    user = await ajax({url:"http://localhost/api/auth/getLoggedUser"})
    console.log(user)

    if (user.rol === 1 && $form) {
        adminPanel()
    }   
    await getServicios()
    renderServicios(servicios)
    renderPaginacion()
    
})
async function getServicios() {
let datos  = await ajax({
        url: `http://localhost/api/servicios/getAll/${parseInt(page)}`
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
if (page>1) {
        $filtros.innerHTML += 
        `<p>
            <a href="?page=${parseInt(page)-1}">Anterior</a>
        </p>`
    }
    if (next) {
        $filtros.innerHTML += 
        `<p>
            <a href="?page=${parseInt(page)+1}">Siguiente</a>
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
    hora.value = servicio.hora_servicio,
    estimado.value = servicio.duracion_estimada

    $submit.textContent = 'Editar'
}

async function addServicio($form) {
    let {id, nombre, cliente, latitud, longitud, direccion, fecha, hora, estimado} = $form

    try {
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
            await getServicios()
            renderServicios(servicios)
        }
    } catch (error) {
        throw new Error()
    }
    
}

async function updateServicio($form) {
    try {
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
            await getServicios()
            renderServicios(servicios)
        }
    } catch (error) {
        throw new Error()
    }
    
}

async function deleteServicio(id) {
    try {
        let datos  = await ajax({
                    url: `http://localhost/api/servicios/delete/${id}`,
                    method: 'DELETE'
                })

        if(datos.respuesta) {
            await getServicios()
            renderServicios(servicios)
        }
    } catch (error) {
        throw new Error()
    }
}

async function handleStatus() {
    let id = $form.querySelector('#id').value

    try{
        if (id.length) {
            await updateServicio($form)
        } else {
            await addServicio($form)
        }
        
        $form.reset()
        $submit.textContent = 'Guardar servicio'
        renderServicios(servicios)
    } catch (error) {
        swal.fire({
            title: 'Error',
            icon: 'warning',
            text: 'Fallo en la acción'
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

$clienteF.addEventListener("input", ev => {
    ev.preventDefault()
    let filtrados = servicios.filter(el => el.nombre_cliente.toLowerCase().includes(ev.target.value.toLowerCase()))
    console.log(filtrados)
    renderServicios(filtrados)
})

$fechaF.addEventListener("change", ev => {
    ev.preventDefault()
    let filtrados = servicios.filter(el => el.fecha_servicio === $fechaF.value)
    renderServicios(filtrados)
})
