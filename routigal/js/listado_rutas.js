import { ajax } from "./ajaxF.js"

const $d = document,
            $rutas = $d.querySelector("tbody"),
            $filtros = $d.querySelector("#filtros"),
            $nombreF = $filtros.querySelector("#nombre_filtro"),
            $fechaF = $filtros.querySelector("#fecha_filtro")


let rutas = []
let next = null;

const page = new URLSearchParams(window.location.search).get("page") ?? 1;
let user = null

$d.addEventListener("DOMContentLoaded", async () => {
    user = await ajax({url:"/api/auth/getLoggedUser"})
    await getRutas()
    renderRutas(rutas)
    
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
async function getRutas() {
let datos  = await ajax({
        url: `/api/rutas/getAll/${parseInt(page)}`
    })

    rutas = datos.datos
    next = datos.next
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

$rutas.addEventListener("click", async(ev) => {
    if (ev.target.id === "borrar" && ev.target.dataset.id) {
        await deleteRuta(ev.target.dataset.id)
    }
})


$nombreF.addEventListener("keyup", ev => {
    ev.preventDefault()
    let filtrados = rutas.filter(el => el.nombre.toLowerCase().includes(ev.target.value.toLowerCase()))
    renderRutas(filtrados)
    
})

$fechaF.addEventListener("change", ev => {
    ev.preventDefault()
    let filtrados = servicios.filter(el => el.fecha === $fechaF.value)
    renderRutas(filtrados)
})