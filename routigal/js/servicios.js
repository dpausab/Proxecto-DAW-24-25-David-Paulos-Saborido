import { ajax } from "./ajaxF.js"

const $d = document,
            $servicios = $d.querySelector("tbody"),
            $form = $d.querySelector("#form-servicios"),
            $filtros = $d.querySelector("#filtros"),
            $submit = $form.querySelector("button")

let {cliente, latitud, longitud, fecha, hora, descripcion} = $form
const estados = {
    1: 'Nuevo',
    2: 'En curso',
    3: 'Acabado'
}
let servicios = []
let next = null;

const page = new URLSearchParams(window.location.search).get("page") ?? 1;

$d.addEventListener("DOMContentLoaded", async () => {
    let datos  = await ajax({
        url: `http://localhost/api/servicios/getAll/${parseInt(page)}`
    })

    servicios = datos.datos
    next = datos.next
    $servicios.innerHTML = servicios.map(el => 
        `<tr>
            <td>${el.nombre}</td>
            <td>${el.nombre_cliente}</td>
            <td>${el.direccion}</td>
            <td>${el.duracion_estimada.slice(0, 5)}</td>
            <td>${el.descripcion}</td>
            <td>${el.fecha_servicio} - ${el.hora_servicio.slice(0, 5)}</td>
            <td>
                <button id="editar" data-id="${el.id}">Editar</button>
                <button id="borrar" data-id="${el.id}">Borrar</button>
            </td>
        </tr>`
    ).join('')
    
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
})

$form.addEventListener("submit", async(ev) => {
    ev.preventDefault()

    if (!id.value.length) {
        let resp = await ajax({
            url: "/api/servicios/insert",
            method: 'POST',
            data: {
                cliente: cliente.value,
                latitud: latitud.value,
                longitud: longitud.value,
                descripcion: descripcion.value,
                tiempoEstimado: tiempoEstimado.value
            }
        })

        if(resp.respuesta) {
            let datos  = await ajax({
                url: `http://localhost/api/servicios/getAll/${page}`
            })

            $servicios.innerHTML = datos.map(el => 
                `<tr>
                    <td>${el.id}</td>
                    <td>${el.cliente}</td>
                    <td>${el.descripcion}</td>
                    <td>${el.tiempoEstimado / 60} minutos</td>
                    <td id="btns">
                        <button id="editar" data-id="${el.id}">Editar</button>
                        <button id="borrar" data-id="${el.id}">Borrar</button>
                    </td>
                </tr>`
            ).join('')
        }
    } else {
        let resp = await ajax({
           url: `/api/servicios/update/${id.value}`,
            method: 'PUT',
            data: {
                cliente: cliente.value,
                latitud: latitud.value,
                longitud: longitud.value,
                descripcion: descripcion.value,
                tiempoEstimado: tiempoEstimado.value
            } 
        })

        if (resp.respuesta) {
            window.location.reload()
        }
    }
    
    $form.reset()
})

$servicios.addEventListener("click", async(ev) => {
    ev.preventDefault()

    if (ev.target.dataset.id) {
        if (ev.target.id === "editar") {
            let servicio = servicios.find(el => el.id == ev.target.dataset.id)
            id.value = servicio.id
            cliente.value = servicio.cliente
            latitud.value = servicio.latitud
            longitud.value = servicio.longitud
            descripcion.value = servicio.descripcion
            tiempoEstimado.value = servicio.tiempoEstimado

            $submit.textContent = 'Editar'
        } else {
            let datos  = await ajax({
                url: `http://localhost/api/servicios/delete/${ev.target.dataset.id}`
            })

            if(datos.respuesta) {
                window.location.reload()
            }
        }
    }
})

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
