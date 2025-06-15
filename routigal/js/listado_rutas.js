import { ajax } from "./ajaxF.js"

const $d = document,
            $rutas = $d.querySelector("tbody"),
            $filtros = $d.querySelector("#filtros"),
            $nombreF = $filtros.querySelector("#nombre_filtro"),
            $paginacion = $d.querySelector("#paginacion"),
            $fechaF = $filtros.querySelector("#fecha_filtro"),
            $tecnicoF = $filtros.querySelector("#tecnico_filtro") ?? null,
            $estadoF = $filtros.querySelector("#estado_filtro")


let rutas = []
let tecnicos = []

let next = null;
let actualPage = 1;
let user = null
const today = getToday()

$d.addEventListener("DOMContentLoaded", async () => {
    $fechaF.value = today
    user = await ajax({url:"/api/auth/getLoggedUser"})
    let id = user.rol!=1 ? user.id : null
    startListeners()
    await getRutas(id)
    await getTecnicos()
    renderRutas(rutas)
    if (user.rol!=2) renderTecnicos(tecnicos)

})

function getToday() {
    return new Date().toLocaleDateString('es-ES', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('/').reverse().join('-')
}

async function getRutas(id=null, nombre=null, fecha=null, estado=null, page=actualPage) {
    let datos  = await ajax({
        url: `/api/rutas/getAll/${page}?nombre=${nombre}&fecha=${fecha}&estado=${estado}&id=${id}`
    })

    rutas = datos.datos
    next = datos.next
}

async function getTecnicos() {
    try {
        let datos  = await ajax({
            url: `http://localhost/api/usuarios/getTecnicos`
        })

        tecnicos = datos
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'error'
        })
    }
}

function renderRutas(rutas) {
    if (rutas.length) {
        $rutas.innerHTML = rutas.map(el => {
            let botones = ""
            if (user.rol === 1) {
                botones = `<td>
                        <button id="editar" data-id="${el.id}">
                            <a href="rutas.php?ruta=${el.id}">Editar</a>
                        </button>
                        <button id="borrar" data-id="${el.id}">Borrar</button>
                    </td>`
            } else {
                botones = `<td>
                        <button id="editar" data-id="${el.id}">
                            <a href="rutas.php?ruta=${el.id}">Editar</a>
                        </button>
                    </td>`
            }
            return `<tr>
                <td>${el.nombre}</td>
                <td>${el.tecnico}</td>
                <td>${el.origen}</td>
                <td>${el.fecha}</td>
                <td>${el.estado}</td>
                <td>${el.distanciaTotal}</td>
                <td>${el.tiempoTotal}</td>
                ${botones}
                </tr>`
            }).join('')
    } else {
        $rutas.innerHTML = '<tr>No hay coincidencias</tr>'
    }

    renderPaginacion()
}

function renderTecnicos(tecnicos) {
    if (tecnicos.length) {
        $tecnicoF.innerHTML = '<option value="">Todos</option>'
        $tecnicoF.innerHTML += tecnicos.map(el => 
            `<option value="${el.id}">${el.nombre}</option>`
        ).join('')
    } else {
        $tecnicoF.innerHTML = '<option value="">Sin técnicos</option>'
    }
}

function renderPaginacion() {
    $paginacion.innerHTML = ""
    let id = user.rol!=1 ? user.id : $tecnicoF.value

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
            await getRutas(id, $clienteF.value, $fechaF.value, $estadoF.value, anterior)
            renderRutas(renderTecnicos)
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
            await getRutas(id, $clienteF.value, $fechaF.value, $estadoF.value, anterior)
            renderRutas(renderTecnicos)
        })
    }
}

async function deleteRuta(id) {
    try {
        let borrados  = await ajax({
                            url: `/api/servicios/getPorRuta/${id}`
                        })
                let serviciosBorrados = borrados
                serviciosBorrados = Promise.all(serviciosBorrados.map(async el => {
                    return await ajax({
                        url: `/api/servicios/updateRutaId/${el.id}`,
                        method: 'PUT',
                        data: {
                            id_ruta: null,
                            id_estado: 1,
                            estimado: el.duracion_estimada,
                            orden: null,
                            tecnico: null
                        }
                    })
                }))
        let datos  = await ajax({
                    url: `/api/rutas/delete/${id}`,
                    method: 'DELETE'
                })

        if(datos.respuesta) {
            swal.fire({
                title: "Ruta eliminada",
                icon: "success",
                text: "La ruta ha sido eliminada correctamente."
            })
            await getRutas()
            renderRutas(rutas)
        }
    } catch (error) {
        swal.fire({
            title: "Error",
            icon: "error",
            text: error.message
        })
    }
}

async function filtrar() {
    let id = user.rol!=1 ? user.id : $tecnicoF.value
    await getRutas(id, $nombreF.value, $fechaF.value, $estadoF.value, 1)
    renderRutas(rutas)
}

function startListeners() {
    $nombreF.addEventListener("input", async(ev) => {
        ev.preventDefault()
        await filtrar()
    })

    $fechaF.addEventListener("change", async(ev) => {
        ev.preventDefault()
        await filtrar()
    })

    if ($tecnicoF) {
        $tecnicoF.addEventListener("change", async(ev) => {
            ev.preventDefault()
            await filtrar()
        })
    }

    $estadoF.addEventListener("change", async(ev) => {
        ev.preventDefault()
        await filtrar()
    }) 
}

$rutas.addEventListener("click", async(ev) => {
    if (ev.target.id === "borrar" && ev.target.dataset.id) {
        await deleteRuta(ev.target.dataset.id)
    }
})

$filtros.addEventListener("submit", ev => ev.preventDefault())
