import { ajax } from "./ajaxF.js"
import { getToday } from "./utils.js"

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


/**
 * Función que recibe los datos de las rutas de la BBDD.
 */
async function getRutas(id=null, nombre=null, fecha=null, estado=null, page=actualPage) {
    let datos  = await ajax({
        url: `/api/rutas/getAll/${page}?nombre=${nombre}&fecha=${fecha}&estado=${estado}&id=${id}`
    })

    rutas = datos.datos
    next = datos.next
}

/**
 * Función que recibe los datos de los técnicos de la BBDD.
 */
async function getTecnicos() {
    try {
        let datos  = await ajax({
            url: `/api/usuarios/getTecnicos`
        })

        tecnicos = datos
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'error'
        })
    }
}

/**
 * Función que renderiza las rutas dentro de la tabla, si el usuario es un admin, le dará opciones de edición o borrado.
 * @param {Array} tecnicos
 */
function renderRutas(rutas) {
    if (rutas.length) {
        $rutas.innerHTML = rutas.map(el => {
            let botones = ""
            if (user.rol === 1) {
                botones = `<td>
                        <div class="acciones">
                            <button class="editar" data-id="${el.id}">
                            <a href="rutas.php?ruta=${el.id}">Editar</a>
                            </button>
                            <button class="borrar" data-id="${el.id}">Borrar</button>
                        </div>
                    </td>`
            } else {
                botones = `<td>
                        <div class="acciones">
                            <button class="editar" data-id="${el.id}">
                            <a href="rutas.php?ruta=${el.id}">Editar</a>
                            </button>
                        </div>
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

/**
 * Función que renderiza como opciones de filtrado los técnicos.
 * @param {Array} tecnicos 
 */
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

/**
 * Función que comprueba si la base de datos contiene más registros, para mostrar los botones de "siguiente" y "anterior" según corresponda, mediante eventos "click".
 */
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

/**
 * Función que gestiona el borrado de la ruta, quitando la asignación a los servicios y borrando el registro. Posteriormente renderiza los datos.
 * @param {int} id 
 */
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

/**
 * Función que gestiona el filtro buscando en la BBDD los datos según los parámetros pasados.
 */
async function filtrar() {
    let id = user.rol!=1 ? user.id : $tecnicoF.value
    await getRutas(id, $nombreF.value, $fechaF.value, $estadoF.value, 1)
    renderRutas(rutas)
}

/**
 * Función que inicializa los listeners de los campos de filtrado.
 */
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
    if (ev.target.classList.contains('borrar') && ev.target.dataset.id) {
        await deleteRuta(ev.target.dataset.id)
    }
})

$filtros.addEventListener("submit", ev => ev.preventDefault())
