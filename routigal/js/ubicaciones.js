import { ajax } from "./ajaxF.js"

const $d = document,
            $ubicaciones = $d.querySelector("tbody"),
            $form = $d.querySelector("#form-ubicaciones"),
            $filtros = $d.querySelector("#filtros"),
            $paginacion = $d.querySelector("#paginacion"),
            $nombreF = $d.querySelector("#nombre_filtro"),
            $submit = $form.querySelector("button")


let ubicaciones = []

let next = null;
let actualPage = 1;

$d.addEventListener("DOMContentLoaded", async () => {

    await getUbicaciones()
    renderUbicaciones(ubicaciones)    
    startListeners()
})

async function getUbicaciones(nombre=null, page=actualPage) {
    let datos  = await ajax({
        url: `/api/ubicaciones/getAll/${page}?nombre=${nombre}`
    })

    ubicaciones = datos.datos
    next = datos.next
}

function getToday() {
    return new Date().toLocaleDateString('es-ES', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('/').reverse().join('-')
}

function renderUbicaciones(ubicaciones) {
    if (ubicaciones.length) {
        $ubicaciones.innerHTML = ubicaciones.map(el => {
            return `<tr>
                <td>${el.nombre}</td>
                <td>${el.latitud}</td>
                <td>${el.longitud}</td>
                <td>
                    <button class="editar" data-id="${el.id}">Editar</button>
                    <button class="borrar" data-id="${el.id}">Borrar</button>
                </td>
                </tr>`
            }).join('')
    } else {
        $ubicaciones.innerHTML = "<tr>No hay ubicaciones.</tr>"
    }

    renderPaginacion()
}

function renderPaginacion() {
    $paginacion.innerHTML = ""

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
            await getUbicaciones($nombreF.value, anterior)
            renderUbicaciones(ubicaciones)
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
            await getUbicaciones($nombreF.value, siguiente)
            renderUbicaciones(ubicaciones)
        })
    }
}

function formulario(ubicacion) {
    let { id, nombre, latitud, longitud } = $form

    id.value = ubicacion.id
    nombre.value = ubicacion.nombre
    latitud.value = ubicacion.latitud
    longitud.value = ubicacion.longitud

    $submit.textContent = 'Editar'
}

async function filtrar() {
    await getUbicaciones($nombreF.value, 1)
    renderUbicaciones(ubicaciones)
}

function startListeners() {
    $nombreF.addEventListener("input", async(ev) => {
        ev.preventDefault()
        await filtrar()

    })
    $form.addEventListener("submit", async(ev) => {
        ev.preventDefault()
        handleStatus()
    })

    $ubicaciones.addEventListener("click", async(ev) => {
        ev.preventDefault()
        if (ev.target.dataset.id) {
            if (ev.target.classList.contains("editar")) {
                let ubicacion = ubicaciones.find(el => el.id == ev.target.dataset.id)
                formulario(ubicacion)
            } else {
                await deleteUbicacion(ev.target.dataset.id)
            }
        }
    })
}

function getDatos() {
    let { nombre, latitud, longitud} = $form

    return {
            nombre: nombre.value,
            latitud: latitud.value,
            longitud: longitud.value,
        } 
}

async function addUbicacion() {
    
    try {
        let datos = getDatos()
        let resp = await ajax({
                    url: "/api/ubicaciones/insert",
                    method: 'POST',
                    data: datos
                })
        
        if(resp.respuesta) {
            swal.fire({
                title: "Ubicaicon agregada",
                icon: "success"
            })
            await getUbicaciones()
            renderUbicaciones(ubicaciones)
        }
    } catch (error) {
        throw new Error()
    }
    
}

async function updateUbicacion() {
    try {        
        let datos = getDatos()
        let resp = await ajax({
                    url: `/api/ubicaciones/update/${id.value}`,
                        method: 'PUT',
                        data: datos
                    })
        if (resp.respuesta) {
            swal.fire({
                title: "Ubicación editada",
                icon: "success"
            })
            await getUbicaciones()
            renderUbicaciones(ubicaciones)
        }
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'warning'
        })
    }
    
}

async function deleteUbicacion(id) {
    try {

        let datos  = await ajax({
                    url: `/api/ubicaciones/delete/${id}`,
                    method: 'DELETE'
                })

        if(datos.respuesta) {
            swal.fire({
                title: "Ubicación eliminado",
                icon: "success"
            })
            await getUbicaciones()
            renderUbicaciones(ubicaciones)
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
        let ubicacion = ubicaciones.find(el => el.id == id) ?? null
        if (!validarForm()) return
        if (ubicacion) {
            await updateUbicacion(ubicacion)
        } else {
            await addUbicacion()
        }
        
        $form.reset()
        $submit.textContent = 'Guardar servicio'
    } catch (error) {
        swal.fire({
            title: 'Fallo en la acción.',
            icon: 'warning'
        })
    }
}


function validarForm() {
    let errores = []
    let [latitud, longitud] = $form.querySelectorAll("#latitud, #longitud")

    const regexLatitud = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    const regexLongitud = /^-?((1[0-7]\d(\.\d+)?)|([1-9]?\d(\.\d+)?|180(\.0+)?))$/;

    if (!latitud.value.trim().length && !longitud.value.trim().length) {
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



